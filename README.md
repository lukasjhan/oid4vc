# OID4VC 🔐

Simple, batteries-included Typescript implementation of OpenID4VCI and OpenID4VP standards.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Axios](https://img.shields.io/badge/Axios-000000?style=flat-square&logo=axios&logoColor=white)](https://axios.dev/)

## ⭐️ Features

- 🔋 **Batteries Included**: Everything you need to implement OpenID4VCI and OpenID4VP standards
- 🚀 **Zero Protocol Knowledge Required**: Focus on your business logic, we handle the protocol details
- 💪 **Type-Safe**: Written in TypeScript with comprehensive type definitions
- 🛡️ **Secure by Design**: Implements all security best practices out of the box
- 🎯 **Wide Framework Support**: Express.js, NestJS and etc
- 📦 **Modern Stack**: Built with TypeScript, Express, NestJS, and Axios

## 📦 Packages

| Package                   | Description                          | Version                                                                                                                                 |
| ------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `@oid4vc/core`            | Core implementations and types       | [![npm](https://img.shields.io/npm/v/@oid4vc/core?style=flat-square)](https://www.npmjs.com/package/@oid4vc/core)                       |
| `@oid4vc/express-oid4vci` | Express.js middleware for OpenID4VCI | [![npm](https://img.shields.io/npm/v/@oid4vc/express-oid4vci?style=flat-square)](https://www.npmjs.com/package/@oid4vc/express-oid4vci) |
| `@oid4vc/nestjs-oid4vci`  | NestJS module for OpenID4VCI         | [![npm](https://img.shields.io/npm/v/@oid4vc/nestjs-oid4vci?style=flat-square)](https://www.npmjs.com/package/@oid4vc/nestjs-oid4vci)   |
| `@oid4vc/client`          | Client implementation using Axios    | [![npm](https://img.shields.io/npm/v/@oid4vc/client?style=flat-square)](https://www.npmjs.com/package/@oid4vc/client)                   |

## 🚀 Quick Start

### Express Middleware

```typescript
import { Oid4VciMiddleware } from '@oid4vc/express-oid4vci';

const middleware = new Oid4VciMiddleware({
  credential_issuer: 'https://issuer.example.com',
  credential_handler: async (request) => {
    // Your credential issuance logic here
    return {
      /* credential response */
    };
  },
});

app.use(middleware.getRouter());
```

### NestJS Module

```typescript
// Define your service
@Injectable()
export class CustomOid4VciService extends Oid4VciService {
  async handleCredentialRequest(request: CredentialRequestDto) {
    // Your credential issuance logic here
    return {
      /* credential response */
    };
  }
}

// Use in your module
@Module({
  imports: [
    Oid4VciModule.register(
      {
        credential_issuer: 'https://issuer.example.com',
      },
      CustomOid4VciService,
    ),
  ],
})
export class AppModule {}
```

### Client Usage

```typescript
import { Oid4vciClient } from '@oid4vc/client';

const client = new Oid4vciClient();
const credential = await client.getCredential({
  credential_issuer: 'https://issuer.example.com',
  // ...other options
});
```

## Security Considerations

### OpenID4VCI Security

- [x] Trust establishment between Wallet and Issuer
  - [x] Key attestation support for validating key management policies
  - [x] Client authentication support using standard OAuth methods
  - [x] Wallet attestation support for client authenticity verification
- [x] Credential Offer Security
  - [x] Parameter validation and trust verification
  - [x] Protection against phishing and injection attacks
  - [x] Legal compliance for privacy-sensitive data
- [x] Pre-Authorized Code Flow Protection
  - [x] Transaction code implementation for replay prevention
  - [x] Protection against transaction code phishing
  - [x] Trusted issuer validation
- [x] Credential Management
  - [x] Proper credential lifecycle management
  - [x] Fraud detection and invalidation mechanisms
  - [x] Device integrity checks
- [x] Proof Security
  - [x] Nonce-based replay attack prevention
  - [x] Key proof lifetime management
  - [x] Private key protection verification
- [x] Access Token Protection
  - [x] Proper token lifetime management
  - [x] Sender-constrained access tokens for long-lived tokens
  - [x] Secure token storage implementation

### OpenID4VP Security

- [x] VP Token Replay Prevention
  - [x] Cryptographic proof of possession
  - [x] Audience binding (client_id)
  - [x] Transaction binding (nonce)
  - [x] Multi-presentation validation
- [x] Session Security
  - [x] Protection against session fixation attacks
  - [x] Response mode security considerations
  - [x] Cross-device security measures
- [x] Response URI Protection
  - [x] URI validation and verification
  - [x] State parameter validation
  - [x] Response data access control
- [x] Authentication Security
  - [x] Stable and unique identifier validation
  - [x] Global uniqueness verification
  - [x] Credential issuer binding
- [x] Response Encryption
  - [x] Integrity protection for encrypted responses
  - [x] Protection against tampering
- [x] Presentation Exchange Security
  - [x] Trusted source validation for definitions
  - [x] JSONPath security measures
  - [x] Filter property bounds checking

## 📈 Project Goals

- **Simplicity First**: Make it easy to implement OpenID4VCI/VP without deep protocol knowledge
- **Developer Experience**: Focus on making the API intuitive and well-documented
- **Production Ready**: Built for real-world usage with security and scalability in mind
- **Framework Flexibility**: Support multiple frameworks while maintaining consistent API
- **Type Safety**: Leverage TypeScript for better development experience and error prevention
- **Test Coverage**: Ensure code quality and robustness

## 📚 Documentation

For detailed documentation, please visit our documentation site.

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
