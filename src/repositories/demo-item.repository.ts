import { DefaultCrudRepository } from '@loopback/repository';
import { ApiDsDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { DemoItem, DemoItemRelations } from '../models/demo-item.model';

export class DemoItemRepository extends DefaultCrudRepository<DemoItem, typeof DemoItem.prototype.id, DemoItemRelations> {
  constructor(@inject('datasources.ApiDS') dataSource: ApiDsDataSource) {
    super(DemoItem, dataSource);
  }
}
