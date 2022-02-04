import {inject} from '@loopback/core';
import {Entity, model, property} from '@loopback/repository';
import {
  get,
  post,
  Request,
  requestBody,
  response,
  ResponseObject,
  RestBindings,
} from '@loopback/rest';

@model()
class Phone extends Entity {
  @property({
    phone: 'phone',
    type: 'string',
  })
  public phone: string;
}

type PinCodeValidation = {
  secret: string;
  pinCode: string;
  phone: string;
};

const PIN_CODE_RESPONSE: ResponseObject = {
  description: 'Pin Code Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PinCodeResponse',
        properties: {
          pinCode: {type: 'string'},
          phone: {type: 'string'},
        },
      },
    },
  },
};

const PIN_CODE_RESPONSE_VALIDATION: ResponseObject = {
  description: 'Pin Code Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PinCodeValidationResponse',
        properties: {
          success: {type: 'boolean'},
        },
      },
    },
  },
};

export class PinCodeController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/get/sms')
  @response(200, PIN_CODE_RESPONSE)
  async getCode(@requestBody() body: Phone): Promise<object> {
    return {};
    /* const phone = body.phone;

    await promise;
    return {
      pinCode: token,
      phone,
    }; */
  }

  @post('/verify/sms')
  @response(200, PIN_CODE_RESPONSE_VALIDATION)
  async verifyCode(@requestBody() body: PinCodeValidation) {
    /* const promise = this.smsCode.find({where: {phone: body.phone}});
    const result = await promise;

    if (result[0]?.secret && result[0]?.token) {
      const tokenValidates = speakeasy.totp.verify({
        secret: result[0].secret,
        encoding: 'base32',
        token: result[0]?.token,
        window: 6,
      });
      return {
        success: tokenValidates,
      };
    } */
    return {success: false};
  }
}
