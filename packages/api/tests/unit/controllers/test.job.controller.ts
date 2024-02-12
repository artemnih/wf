// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { createStubInstance, expect, StubbedInstanceWithSinonAccessor } from '@loopback/testlab';
// import { JobRepository } from '../../../repositories';
// import { JobController } from '../../../controllers';
// import { Job } from '../../../models';

// describe('Job Controller', () => {
// 	let repository: StubbedInstanceWithSinonAccessor<JobRepository>;
// 	beforeEach(givenStubbedRepository);
// 	describe('create Jobs()()', () => {
// 		it('Create an echo job', async () => {
// 			const controller = new JobController(repository);

// 			repository.stubs.create.resolves(new Job());
// 			const plugin = await controller.create(new Job());
// 			expect(plugin).to.be.eql(new Job());
// 		});
// 		it('Get Job by id', async () => {
// 			const controller = new JobController(repository);
// 			repository.stubs.findById.resolves(new Job({ id: 'hello', title: 'hello' }));
// 			const plugins = await controller.findById('hello');
// 			expect(plugins).to.be.eql(new Job({ title: 'hello', id: 'hello' }));
// 		});
// 		it('Get Jobs', async () => {
// 			const controller = new JobController(repository);
// 			repository.stubs.find.resolves([new Job(), new Job()]);
// 			const plugins = await controller.find();
// 			expect(plugins).to.be.eql([new Job(), new Job()]);
// 		});
// 		it('Update Job by id ', async () => {
// 			const controller = new JobController(repository);
// 			repository.stubs.updateById.resolves();
// 			try {
// 				await controller.updateById('test', new Job());
// 				expect(true).to.be.true();
// 			} catch {
// 				expect(false).to.be.true();
// 			}
// 		});
// 	});

// 	function givenStubbedRepository() {
// 		repository = createStubInstance(JobRepository);
// 	}
// });
