import express from 'express';
import { Oid4VciMiddleware } from '@oid4vc/oid4vci';

const app = express();

const middleware = new Oid4VciMiddleware({
  credential_issuer: 'http://localhost:3000',
  credential_handler: async () => {
    return {
      credentials: [
        {
          credential: 'credential',
        },
      ],
    };
  },
  nonce_handler: () => {
    return {
      c_nonce: 'nonce',
    };
  },
  deferred_credential_handler: async () => {
    return {
      credentials: [
        {
          credential: 'credential',
        },
      ],
    };
  },
  notification_handler: async (dto) => {
    console.log('notification', dto);
  },
});

app.use(middleware.getRouter());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
