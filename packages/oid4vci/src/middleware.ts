import {
  DEFAULT_PATH,
  IssuerMetadata,
  NotificationRequestDto,
  Oid4VciConfig,
} from './type';
import express, { Router, Request, Response } from 'express';
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
    const {
      credential_issuer,
      credential_handler,
      nonce_handler,
      deferred_credential_handler,
      notification_handler,
    } = config;

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
      nonce_endpoint: nonce_handler
        ? this.appendUrl(credential_issuer, DEFAULT_PATH.NONCE)
        : undefined,
      deferred_credential_endpoint: deferred_credential_handler
        ? this.appendUrl(credential_issuer, DEFAULT_PATH.DEFERRED_CREDENTIAL)
        : undefined,
      notification_endpoint: notification_handler
        ? this.appendUrl(credential_issuer, DEFAULT_PATH.NOTIFICATION)
        : undefined,
      credential_configurations_supported: {},
      display: config.display,
    };

    return metadata;
  }

  private appendUrl(baseUrl: string, path: string): string {
    return new URL(path, baseUrl).href;
  }

  private setupRoutes(config: Oid4VciConfig) {
    this.router.use(express.json());
    this.router.use(express.urlencoded({ extended: true }));

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
          const status = 'transaction_id' in ret ? 202 : 200;
          res.set('Cache-Control', 'no-store').status(status).json(ret);
        } catch (err) {
          res.status(500).json(err);
        }
      },
    );

    if (config.nonce_handler) {
      const handler = config.nonce_handler;
      this.router.post(
        `/${DEFAULT_PATH.NONCE}`,
        async (req: Request, res: Response) => {
          try {
            const ret = await handler();
            res.set('Cache-Control', 'no-store').status(200).json(ret);
          } catch (err) {
            res.status(500).json(err);
          }
        },
      );
    }

    if (config.deferred_credential_handler) {
      const handler = config.deferred_credential_handler;
      this.router.post(
        `/${DEFAULT_PATH.DEFERRED_CREDENTIAL}`,
        async (req: Request, res: Response) => {
          // TODO: Authorization
          try {
            const ret = await handler(req);
            res.status(200).json(ret);
          } catch (err) {
            res.status(500).json(err);
          }
        },
      );
    }

    if (config.notification_handler) {
      const handler = config.notification_handler;
      this.router.post(
        `/${DEFAULT_PATH.NOTIFICATION}`,
        async (req: Request, res: Response) => {
          // TODO: validate request
          const dto: NotificationRequestDto = req.body;
          try {
            await handler(dto);
            res.sendStatus(204);
          } catch (err) {
            res.status(500).json(err);
          }
        },
      );
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
