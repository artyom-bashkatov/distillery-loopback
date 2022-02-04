import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SmsCode} from '../models';
import {SmsCodeRepository} from '../repositories';

export class SmsCodeController {
  constructor(
    @repository(SmsCodeRepository)
    public smsCodeRepository : SmsCodeRepository,
  ) {}

  @post('/sms-codes')
  @response(200, {
    description: 'SmsCode model instance',
    content: {'application/json': {schema: getModelSchemaRef(SmsCode)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SmsCode, {
            title: 'NewSmsCode',
            exclude: ['id'],
          }),
        },
      },
    })
    smsCode: Omit<SmsCode, 'id'>,
  ): Promise<SmsCode> {
    return this.smsCodeRepository.create(smsCode);
  }

  @get('/sms-codes/count')
  @response(200, {
    description: 'SmsCode model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SmsCode) where?: Where<SmsCode>,
  ): Promise<Count> {
    return this.smsCodeRepository.count(where);
  }

  @get('/sms-codes')
  @response(200, {
    description: 'Array of SmsCode model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SmsCode, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SmsCode) filter?: Filter<SmsCode>,
  ): Promise<SmsCode[]> {
    return this.smsCodeRepository.find(filter);
  }

  @patch('/sms-codes')
  @response(200, {
    description: 'SmsCode PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SmsCode, {partial: true}),
        },
      },
    })
    smsCode: SmsCode,
    @param.where(SmsCode) where?: Where<SmsCode>,
  ): Promise<Count> {
    return this.smsCodeRepository.updateAll(smsCode, where);
  }

  @get('/sms-codes/{id}')
  @response(200, {
    description: 'SmsCode model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SmsCode, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SmsCode, {exclude: 'where'}) filter?: FilterExcludingWhere<SmsCode>
  ): Promise<SmsCode> {
    return this.smsCodeRepository.findById(id, filter);
  }

  @patch('/sms-codes/{id}')
  @response(204, {
    description: 'SmsCode PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SmsCode, {partial: true}),
        },
      },
    })
    smsCode: SmsCode,
  ): Promise<void> {
    await this.smsCodeRepository.updateById(id, smsCode);
  }

  @put('/sms-codes/{id}')
  @response(204, {
    description: 'SmsCode PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() smsCode: SmsCode,
  ): Promise<void> {
    await this.smsCodeRepository.replaceById(id, smsCode);
  }

  @del('/sms-codes/{id}')
  @response(204, {
    description: 'SmsCode DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.smsCodeRepository.deleteById(id);
  }
}
