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

  /**
   * The URL of the Credential Issuer's Credential Endpoint
   * If not provided, use default endpoint: /credential
   * @example "/credential"
   * @optional
   */
  credential_endpoint?: string;

  /**
   * The URL of the Credential Issuer's Nonce Endpoint
   * If not provided, the nonce endpoint is not included
   * If true, the default nonce endpoint is used: /nonce
   * @example "/nonce"
   * @optional
   */
  nonce_endpoint?: string | true;

  /**
   * The URL of the Credential Issuer's Deferred Credential Endpoint
   * If not provided, the deferred credential endpoint is not included
   * If true, the default deferred credential endpoint is used: /deferred-credential
   * @example "/deferred-credential"
   * @optional
   */
  deferred_credential_endpoint?: string | true;

  /**
   * The URL of the Credential Issuer's Notification Endpoint
   * If not provided, the notification endpoint is not included
   * If true, the default notification endpoint is used: /notification
   * @example "/notification"
   * @optional
   */
  notification_endpoint?: string | true;

  /**
   * TODO: implement
   */
  credential_response_encryption?: never;

  /**
   * The maximum number of credentials that can be issued in a batch
   * If not provided, batch issuance is not supported
   * If 0 or less, batch issuance is disabled
   * @example 5
   * @optional
   */
  batch_credential_issuance?: number;

  /**
   * The key used to sign the metadata
   * If not provided, the metadata is not signed
   * @example {"alg": "HS256", "secret": "secret"}
   * @optional
   */
  signed_metadata_key?:
    | {
        alg: 'HS256';
        secret: string;
      }
    | {
        alg: 'ES256' | 'ES384' | 'ES512';
        key: JsonWebKey;
      };

  display?: {
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  };

  credential_configurations_supported?: never;
};

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
    [key: string]: CredentialConfiguration;
  };
};
