import { Oid4VciConfig } from './type';
import { Router, Request, Response, NextFunction } from 'express';

export class Oid4VciMiddleware {
  private readonly config: Oid4VciConfig;

  constructor(config: Oid4VciConfig) {
    this.config = this.validateConfig(config);
  }

  private validateConfig(config: Oid4VciConfig) {
    if (!config.issuerMetadata.credential_issuer) {
      throw new TypeError('config.issuerMetadata.credential_issuer is missing');
    }

    return config;
  }
}
