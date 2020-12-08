import { SecurityService } from '../security/security.service';
import * as crypto from 'crypto';

describe('Security Service Tests', async () => {
  const rawKeys = await SecurityService.generateKeyPair();
  const exportedPrivateKey = await SecurityService.exportKey(rawKeys.privateKey);
  const exportedPublicKey = await SecurityService.exportKey(rawKeys.publicKey);

  const invalidKeys = await SecurityService.generateKeyPair();
  const invalidExportedPrivateKey = await SecurityService.exportKey(invalidKeys.privateKey);
  const invalidExportedPublicKey = await SecurityService.exportKey(invalidKeys.publicKey);

  const data = Buffer.from(new TextEncoder().encode('Original data'));
  const invalidData = Buffer.from(new TextEncoder().encode('Invalid data'));

  const signature = await SecurityService.sign(data, exportedPrivateKey);
  const invalidSignature = await SecurityService.sign(data, invalidExportedPrivateKey);

  test('Generate keys', () => {
    expect(rawKeys).toBeInstanceOf(CryptoKeyPair);
  });

  test('Sign data', () => {
    expect(Buffer.isBuffer(signature)).toBe(true);
  });

  test('Verify correct signature', () => {
    expect(SecurityService.verifySignature(data, exportedPublicKey, signature)).toBe(true);
  });

  test('Verify invalid signature', () => {
    expect(SecurityService.verifySignature(data, exportedPublicKey, invalidSignature)).toBe(false);
  });

  test('Verify invalid data', () => {
    expect(SecurityService.verifySignature(invalidData, exportedPublicKey, signature)).toBe(false);
  });
});
