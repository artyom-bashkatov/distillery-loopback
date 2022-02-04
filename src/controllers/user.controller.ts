import {authenticate, TokenService} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Entity, model, property, repository} from '@loopback/repository';
import {
  get,
  patch,
  post,
  requestBody,
  Response,
  RestBindings,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import speakeasy from 'speakeasy';
import {
  balanceVariants,
  calculateRemainsData,
  getServicesForSelectedTarrif,
  randomNumber,
  tarrifs,
} from '../data/mockup';
import {SmsCodeRepository} from '../repositories';

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

@model()
class Phone extends Entity {
  @property({
    phone: 'phone',
    type: 'string',
  })
  public phone: string;
}

type VerifyCode = {
  phone: string;
  code: string;
};

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['phone'],
  properties: {
    phone: {
      type: 'string',
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(SmsCodeRepository) public smsCode: SmsCodeRepository,
  ) {}

  async isUserExist(req: VerifyCode) {
    const credentials = {
      password: req.phone,
      email: `${req.phone}@mail.com`,
    };
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    this.response.set('Authorization', token);
    return userProfile;
  }

  async createdUserProfile(req: VerifyCode) {
    const password = await hash(req.phone, await genSalt());
    const tarrif = tarrifs[randomNumber(0, 1)];
    const services = getServicesForSelectedTarrif(tarrif.name);
    const savedUser = await this.userRepository.create(
      _.omit(
        {
          phone: req.phone,
          code: req.code,
          password: req.phone,
          email: `${req.phone}@mail.com`,
          tarrif: tarrif,
          services: services,
          balance: balanceVariants[randomNumber(0, 6)],
          remains: calculateRemainsData(tarrif, req.phone),
        },
        'password',
      ),
    );
    await this.userRepository.userCredentials(savedUser.id).create({password});
    const userProfile = this.userService.convertToUserProfile(savedUser);
    const token = await this.jwtService.generateToken(userProfile);
    this.response.set('Authorization', token);
    return savedUser;
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async getSms(
    @requestBody(CredentialsRequestBody) req: Phone,
  ): Promise<{code: string}> {
    const {phone} = req;
    const secret = speakeasy.generateSecret();
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    const promise = this.smsCode.create({
      phone,
      secret: secret['base32'],
      token,
    });
    await promise;
    return {code: token};
  }

  @patch('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                },
                code: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async verifySmsCodeAndReturnToken(
    @requestBody(CredentialsRequestBody) req: VerifyCode,
  ): Promise<unknown> {
    const promise = this.smsCode.find({
      where: {phone: req.phone, token: req.code},
    });
    const result = await promise;
    if (result[0]?.secret && result[0]?.token) {
      const tokenValidates = speakeasy.totp.verify({
        secret: result[0].secret,
        encoding: 'base32',
        token: result[0]?.token,
        window: 6,
      });
      if (tokenValidates) {
        // return this.isUserExist(req);
        return this.createdUserProfile(req);
      }
    }
    return {token: 'Not Granted'};
  }

  @authenticate('jwt')
  @get('/users/me', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getUserProfile(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  @authenticate('jwt')
  @get('/users/me/balance', {
    responses: {
      '200': {
        description: 'Return current user services',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getUserBalance(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile?.balance;
  }
}
