import { IssuerMetadata, Oid4VciConfig } from './type';
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
    if (!config.credential_issuer) {
      throw new TypeError('config.issuerMetadata.credential_issuer is missing');
    }

    return config;
  }

  private setupRoutes() {
    this.router.get(
      '/.well-known/openid-credential-issuer',
      (req: Request, res: Response) => {
        const config: IssuerMetadata = {
          credential_issuer: this.config.credential_issuer,
          credential_endpoint: this.config.credential_endpoint ?? '',
          credential_configurations_supported: {},
        };
        res.set('Cache-Control', 'no-store').json(config);
      },
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
