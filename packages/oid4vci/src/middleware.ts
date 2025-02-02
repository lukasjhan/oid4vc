import {
  CredentialOfferByRef,
  CredentialOfferByValue,
  CredentialRequestDto,
  DEFAULT_PATH,
  DeferredCredentialRequestDto,
  IssuerMetadata,
  NotificationRequestDto,
  Oid4VciConfig,
  TokenDto,
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
          // TODO: Authorization
          // TODO: Validation
          const dto: CredentialRequestDto = req.body;
          const ret = await config.credential_handler(dto);
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
          const dto: DeferredCredentialRequestDto = req.body;
          try {
            const ret = await handler(dto);
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

    if (config.credential_offer_handler) {
      const handler = config.credential_offer_handler;
      this.router.get(
        `/${DEFAULT_PATH.CREDENTIAL_OFFER}/:offerId`,
        async (req: Request, res: Response) => {
          const offerId = req.params.offerId;
          try {
            const ret = await handler(offerId);
            res.set('Cache-Control', 'no-store').status(200).json(ret);
          } catch (err) {
            res.status(500).json(err);
          }
        },
      );
    }

    if (config.token_handler) {
      const handler = config.token_handler;
      this.router.post(
        `/${DEFAULT_PATH.TOKEN}`,
        async (req: Request, res: Response) => {
          // TODO: validate request
          const dto: TokenDto = req.body;
          try {
            const ret = await handler(dto);
            res.set('Cache-Control', 'no-store').status(200).json(ret);
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

export class CredentialOfferUri {
  constructor(
    private readonly protocolName: string = 'openid-credential-offer',
  ) {}

  public byRef(data: CredentialOfferByRef) {
    const params = new URLSearchParams({
      credential_offer_uri: data.credential_offer_uri,
    });
    return `${this.protocolName}://?${params.toString()}`;
  }

  public byValue(data: CredentialOfferByValue) {
    const params = new URLSearchParams({
      credential_offer: JSON.stringify(data),
    });
    return `${this.protocolName}://?${params.toString()}`;
  }
}
