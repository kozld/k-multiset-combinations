import { createHash } from 'crypto';

export function sha256Hash(obj: object): string {
  const json = JSON.stringify(obj);
  return createHash('sha256').update(json).digest('hex');
}
