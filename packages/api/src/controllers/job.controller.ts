import { Request, Response, NextFunction } from 'express';
import { JobCrud } from '../models/job.model';

export class JobController {

    async find(req: Request, res: Response, next: NextFunction) {
        console.log('find');
        try {
            const filter = req.query;
            const jobs = await JobCrud.find(filter);
            res.status(200).json(jobs);
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const jobId = req.params.jobId;
            const job = await JobCrud.findById(jobId);
            if (!job) {
                return res.status(404).send({ message: 'Job not found' });
            }
            return res.send(job);
        } catch (error) {
            next(error);
        }
    }
}

export default new JobController();