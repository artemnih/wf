import { NextFunction, Request, Response } from 'express';

export class HealthController {

  async ping(req: Request, res: Response, next: NextFunction) {
    // Reply with a greeting, the current time, the url, and request headers
    try {
      res.status(200).json({
        greeting: 'Argo Driver is healthy',
        date: new Date(),
        url: req.url,
        headers: Object.assign({}, req.headers),
      });
    } catch (error) {
      next(error);
    }
  }
}


export default new HealthController();