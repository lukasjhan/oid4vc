import { DynamicModule, Module } from '@nestjs/common';
import { Oid4VciMiddleware, Oid4VciConfig } from '@oid4vc/oid4vci';
import { Oid4VciService } from './oid4vci.service';
import { Type } from '@nestjs/common';

export interface Oid4VciModuleOptions
  extends Omit<
    Oid4VciConfig,
    | 'credential_handler'
    | 'nonce_handler'
    | 'deferred_credential_handler'
    | 'notification_handler'
    | 'credential_offer_handler'
    | 'token_handler'
  > {}

@Module({})
export class Oid4VciModule {
  static register(
    options: Oid4VciModuleOptions,
    serviceClass: Type<Oid4VciService>,
  ): DynamicModule {
    return {
      module: Oid4VciModule,
      providers: [
        {
          provide: Oid4VciService,
          useClass: serviceClass,
        },
        {
          provide: Oid4VciMiddleware,
          useFactory: (service: Oid4VciService) => {
            const config: Oid4VciConfig = {
              ...options,
              credential_handler: (dto) => service.handleCredentialRequest(dto),
              nonce_handler: service.handleNonceRequest?.bind(service),
              deferred_credential_handler:
                service.handleDeferredCredentialRequest?.bind(service),
              notification_handler:
                service.handleNotificationRequest?.bind(service),
              credential_offer_handler:
                service.handleCredentialOffer?.bind(service),
              token_handler: service.handleTokenRequest?.bind(service),
            };
            return new Oid4VciMiddleware(config);
          },
          inject: [Oid4VciService],
        },
      ],
      exports: [Oid4VciService],
    };
  }
}
