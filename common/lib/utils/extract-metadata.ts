import { Metadata } from '@grpc/grpc-js';
import { Roles } from '@readytomog/contracts';

import { validateEnumValues } from './valid-enum';

export const extractMetadata = (metadata: Metadata) => {
  const id = metadata.get('x-user-id')[0].toString();

  const rolesRaw = metadata.get('x-user-roles').toString();
  return {
    id,
    roles: rolesRaw ? validateEnumValues(Roles, rolesRaw.split(',')) : [],
  };
};
