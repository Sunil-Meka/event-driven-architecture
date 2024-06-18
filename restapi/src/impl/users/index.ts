import { usersService } from "./impl";
import * as t from "../../../dist/api/users/types";

const service = new usersService();

export const usersServiceImpl: t.UsersApi = {
  postUsersCreate: service.create,
  deleteUsersDelete: service.delete,
  getUsersGet: service.get,
  getUsersGetAll: service.getAll,
  putUsersUpdate: service.update,
};
