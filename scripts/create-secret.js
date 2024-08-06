const crypto = require('node:crypto');

function createSecret() {
  // Use this value to generate a JWT secret
  // Store this value in the env variable JWT_SECRET
  const secret = crypto.randomBytes(64).toString('hex');
  // eslint-disable-next-line no-console
  console.info(secret);
  return secret;
}

createSecret();
