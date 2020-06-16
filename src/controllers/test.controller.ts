import { repository } from '@loopback/repository';
import { get, param } from '@loopback/rest';
import { DriverRepository } from '../repositories/driver.repository';

export class TestController {
  constructor(
    @repository(DriverRepository)
    public testRepo: DriverRepository,
  ) {}

  @get('/test/{driver}')
  async findById(@param.path.string('driver') driver: string): Promise<string> {
    return this.testRepo.getDriverName(driver);
  }

  @get('/compute/{name}')
  async compute(@param.path.string('name') name: string): Promise<void> {
    return this.testRepo.compute(name, 'script');
  }
}
