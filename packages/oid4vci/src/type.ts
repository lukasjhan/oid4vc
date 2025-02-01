import { JsonWebKey } from 'crypto';

export type Oid4VciConfig = {
  /**
   * The Credential Issuer's identifier, typically a URL
   * @example "https://issuer.example.com"
   */
  credential_issuer: string;

  /**
   * List of OAuth 2.0 authorization server URLs
   * If not provided, the credential_issuer also serves as the authorization server
   * @example ["https://auth.example.com", "https://auth2.example.com"]
   * @optional
   */
  authorization_servers?: string[];

  credential_handler: (req: any) => Promise<any>;

  nonce_handler?: (req: any) => Promise<any>;

  deferred_credential_handler?: (req: any) => Promise<any>;

  notification_handler?: (req: any) => Promise<any>;

  credential_response_encryption?: never;

  batch_credential_issuance?: number;

  // TODO: implement
  signed_metadata_key?:
    | {
        alg: 'HS256';
        secret: string;
      }
    | {
        alg: 'ES256' | 'ES384' | 'ES512';
        key: JsonWebKey;
      };

  display?: Array<{
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  }>;

  credential_configurations_supported?: never;
};

// TODO: fix
export type CredentialConfiguration = {
  format: string;
  scope?: string;
  cryptographic_binding_methods_supported?: string[];
  credential_signing_alg_values_supported?: string[];
  credential_definition?: {
    type: string[];
    '@context'?: string[];
  };
  doctype?: string;
  claims?: Array<{
    path: (string | null | number)[];
    mandatory?: boolean;
    display?: Array<{
      name: string;
      locale?: string;
    }>;
  }>;
};

export type IssuerMetadata = {
  credential_issuer: string;
  authorization_servers?: string[];
  credential_endpoint: string;
  nonce_endpoint?: string;
  deferred_credential_endpoint?: string;
  notification_endpoint?: string;
  credential_response_encryption?: {
    alg_values_supported: string[];
    enc_values_supported: string[];
    encryption_required?: boolean;
  };
  batch_credential_issuance?: {
    batch_size: number;
  };
  signed_metadata?: string;
  display?: Array<{
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  }>;
  credential_configurations_supported: {
    [key: string]: any;
  };
};

export const DEFAULT_PATH = {
  CREDENTIAL: 'credential',
  NONCE: 'nonce',
  DEFERRED_CREDENTIAL: 'deferred_credential',
  NOTIFICATION: 'notification',
};
