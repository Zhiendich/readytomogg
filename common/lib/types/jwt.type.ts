import { Roles } from '@readytomog/contracts';

export type JwtPayload = {
  id: string;
  roles: Roles[];
};
