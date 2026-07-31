import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function getEncryptionSecret() {
  const secret = process.env.TOTP_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('TOTP_ENCRYPTION_KEY is not set');
  }
  return Buffer.from(secret, 'hex');
}

export const encryptSecret = (url: string) => {
  const secret = getEncryptionSecret();
  const iv = randomBytes(12);

  const cipher = createCipheriv('aes-256-gcm', secret, iv);
  const encrypted = Buffer.concat([cipher.update(url, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

export function decryptSecret(encryptedData: string): string {
  const secret = getEncryptionSecret();
  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted secret format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = createDecipheriv('aes-256-gcm', secret, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
