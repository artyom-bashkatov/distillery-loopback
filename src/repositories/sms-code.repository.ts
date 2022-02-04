import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {SmsCode, SmsCodeRelations} from '../models';

export class SmsCodeRepository extends DefaultCrudRepository<
  SmsCode,
  typeof SmsCode.prototype.id,
  SmsCodeRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(SmsCode, dataSource);
  }
}
