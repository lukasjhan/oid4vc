import { IssuerMetadata, Oid4VciConfig } from './type';
import { Router, Request, Response, NextFunction } from 'express';

export class Oid4VciMiddleware {
  private router: Router;
  private readonly metadata: IssuerMetadata;

  constructor(config: Oid4VciConfig) {
    this.metadata = this.validateConfig(config);
    this.router = Router();
    this.setupRoutes(config);
  }

  private validateConfig(config: Oid4VciConfig): IssuerMetadata {
    if (!config.credential_issuer) {
      throw new TypeError('config.issuerMetadata.credential_issuer is missing');
    }

    const metadata: IssuerMetadata = {
      credential_issuer: config.credential_issuer,
      credential_endpoint: config.credential_endpoint ?? '',
      credential_configurations_supported: {},
    };

    return metadata;
  }

  private setupRoutes(config: Oid4VciConfig) {
    this.router.get(
      '/.well-known/openid-credential-issuer',
      (req: Request, res: Response) => {
        res.set('Cache-Control', 'no-store').json(this.metadata);
      },
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
