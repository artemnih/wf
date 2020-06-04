import { CountSchema, repository } from '@loopback/repository';
import { get } from '@loopback/rest';
import { TestRepository } from '../repositories/test.repository';

export class TestController {
  constructor(
    @repository(TestRepository)
    public testRepo: TestRepository,
  ) { }


  @get('/test', {
    responses: {
      '200': {
        description: 'TestItem model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(): Promise<string> {
    return this.testRepo.getType();
  }

}
