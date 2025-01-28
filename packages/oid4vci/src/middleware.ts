import { Oid4VciConfig } from './type';
import { Router, Request, Response, NextFunction } from 'express';

export class Oid4VciMiddleware {
  private router: Router;
  private readonly config: Oid4VciConfig;

  constructor(config: Oid4VciConfig) {
    this.config = this.validateConfig(config);
    this.router = Router();
    this.setupRoutes();
  }

  private validateConfig(config: Oid4VciConfig) {
    if (!config.issuerMetadata.credential_issuer) {
      throw new TypeError('config.issuerMetadata.credential_issuer is missing');
    }

    return config;
  }

  private setupRoutes() {
    this.router.get(
      '/.well-known/openid-credential-issuer',
      (req: Request, res: Response) => {
        res.json(this.config.issuerMetadata);
      },
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
