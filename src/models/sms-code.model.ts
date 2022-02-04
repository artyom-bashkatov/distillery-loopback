import {Entity, model, property} from '@loopback/repository';

@model()
export class SmsCode extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  secret: string;

  constructor(data?: Partial<SmsCode>) {
    super(data);
  }
}

export interface SmsCodeRelations {
  // describe navigational properties here
}

export type SmsCodeWithRelations = SmsCode & SmsCodeRelations;
