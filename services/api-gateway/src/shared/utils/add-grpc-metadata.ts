import { Metadata } from '@grpc/grpc-js';
import { JwtPayload } from '@readytomog/common';

export function buildUserMetadata(user: JwtPayload): Metadata {
  const metadata = new Metadata();
  metadata.add('x-user-id', String(user.id));
  metadata.add('x-user-role', user.roles.join(','));
  return metadata;
}
