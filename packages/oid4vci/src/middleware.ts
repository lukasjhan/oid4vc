import { DEFAULT_PATH, IssuerMetadata, Oid4VciConfig } from './type';
import { Router, Request, Response } from 'express';
import { URL } from 'url';

export class Oid4VciMiddleware {
  private router: Router;
  private readonly metadata: IssuerMetadata;

  constructor(config: Oid4VciConfig) {
    this.metadata = this.validateConfig(config);
    this.router = Router();
    this.setupRoutes(config);
  }

  private validateConfig(config: Oid4VciConfig): IssuerMetadata {
    const { credential_issuer, credential_handler } = config;

    if (!credential_issuer) {
      throw new TypeError('config.credential_issuer is missing');
    }

    if (!credential_handler) {
      throw new TypeError('config.credential_handler is missing');
    }

    const metadata: IssuerMetadata = {
      credential_issuer: credential_issuer,
      credential_endpoint: this.appendUrl(
        credential_issuer,
        DEFAULT_PATH.CREDENTIAL,
      ),
      credential_configurations_supported: {},
    };

    return metadata;
  }

  private appendUrl(baseUrl: string, path: string): string {
    return new URL(path, baseUrl).href;
  }

  private setupRoutes(config: Oid4VciConfig) {
    this.router.get(
      '/.well-known/openid-credential-issuer',
      (req: Request, res: Response) => {
        res.set('Cache-Control', 'no-store').json(this.metadata);
      },
    );

    this.router.post(
      `/${DEFAULT_PATH.CREDENTIAL}`,
      async (req: Request, res: Response) => {
        try {
          const ret = await config.credential_handler(req);
          res.json(ret);
        } catch (err) {
          res.status(500).json(err);
        }
      },
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
