import * as t from '../api/users/types'
import { Api } from '../models'

async function postUsersCreate(request: Api.User): Promise<t.PostUsersCreateResponse> {
	throw 'Unimplemented'
}

async function deleteUsersDelete(id: string): Promise<t.DeleteUsersDeleteResponse> {
	throw 'Unimplemented'
}

async function getUsersGet(id: string): Promise<t.GetUsersGetResponse> {
	throw 'Unimplemented'
}

async function getUsersGetAll(): Promise<t.GetUsersGetAllResponse> {
	throw 'Unimplemented'
}

async function putUsersUpdate(request: Api.User): Promise<t.PutUsersUpdateResponse> {
	throw 'Unimplemented'
}


const api: t.UsersApi = {
	postUsersCreate,
	deleteUsersDelete,
	getUsersGet,
	getUsersGetAll,
	putUsersUpdate,
}

export default api
