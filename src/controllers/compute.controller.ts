import { repository } from '@loopback/repository';
import { param, post, requestBody } from '@loopback/rest';
import { ComputeRepository } from '../repositories/compute.repository';
import { ServiceConfigRepository } from '../repositories/service-config.repository';

export class ComputeController {
  constructor(
    @repository(ComputeRepository) public computeRepo: ComputeRepository,
    @repository(ServiceConfigRepository) public serviceConfigRepo: ServiceConfigRepository,
  ) {}

  @post('/compute/{name}')
  async compute(
    @param.path.string('name') name: string,
    @requestBody({
      content: {
        'text/plain': {},
        'application/xml': {},
      },
    })
    script: string,
  ): Promise<void> {
    const config = await this.serviceConfigRepo.getByTitle(name);
    if (!config) throw new Error('Config not found');
    return this.computeRepo.compute(config, script);
  }

  @post('/install/{name}')
  async install(@param.path.string('name') name: string): Promise<void> {
    const config = await this.serviceConfigRepo.getByTitle(name);
    if (!config) throw new Error('Config not found');
    return this.computeRepo.install(config);
  }
}
