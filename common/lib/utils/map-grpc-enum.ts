import { Role, Roles } from '@readytomog/contracts';

const grpcRoleObject: Record<Role, Roles> = {
  [Role.unspecified]: Roles.user,
  [Role.user]: Roles.user,
  [Role.participant]: Roles.participant,
  [Role.creator]: Roles.creator,
  [Role.admin]: Roles.admin,
  [Role.UNRECOGNIZED]: Roles.user,
};

const roleObject: Record<Roles, Role> = {
  [Roles.user]: Role.user,
  [Roles.participant]: Role.participant,
  [Roles.creator]: Role.creator,
  [Roles.admin]: Role.admin,
};

export const mapGrpcRolesToRoles = (roles: Role[]): Roles[] => {
  return roles.map((role) => grpcRoleObject[role]);
};

export const mapRolesToGrpcRoles = (roles: Roles[]): Role[] => {
  return roles.map((role) => roleObject[role]);
};
