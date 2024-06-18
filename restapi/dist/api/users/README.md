# Users

rest api

## Operations

### postUsersCreate

```http
POST /users/create
```


### deleteUsersDelete

```http
DELETE /users/delete
```


### getUsersGet

```http
GET /users/get
```


### getUsersGetAll

```http
GET /users/getAll
```


### putUsersUpdate

```http
PUT /users/update
```


## Implementation

This is an example of the API implementation to use to update the actual API implementation
when the API structure has changed.

```typescript
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
```
