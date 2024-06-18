import { UsersApi } from "../../dist/api/users/types";
import { ApiImplementation } from "../../dist/types";
import { usersServiceImpl } from "./users/index";

export class ServiceImplementation implements ApiImplementation {
  users: UsersApi = usersServiceImpl;
}
