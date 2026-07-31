import { Roles } from "../../types";

export interface CreateUserEvent {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  roles: Roles[];
}
