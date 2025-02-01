import express from 'express';
import { Oid4VciMiddleware } from '@oid4vc/oid4vci';

const app = express();

const middleware = new Oid4VciMiddleware({
  credential_issuer: 'http://localhost:3000',
  credential_handler: async (req) => {
    return {
      credential: 'credential',
    };
  },
  nonce_handler: (req) => {
    return {
      c_nonce: 'nonce',
    };
  },
  deferred_credential_handler: async (req) => {
    return {
      deferred_credential: 'deferred_credential',
    };
  },
  notification_handler: async (req) => {
    return {
      notification: 'notification',
    };
  },
});

app.use(middleware.getRouter());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
