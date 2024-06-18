import { Api } from "../../../dist/models";
import * as t from "../../../dist/api/users/types";
import * as v from "../../../dist/validation";
import { v4 } from "uuid";
import { Kafka, Partitioners } from "kafkajs";
import { nat_server } from "../../admin";
import { kafka_server } from "../../admin";
const kafka = new Kafka({
  clientId: "my-app",
  brokers: [kafka_server],
});
import { connect, ErrorCode, StringCodec, Subscription } from "nats";
import { TextEncoder } from "text-encoding";

export class usersService {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.checkUser = this.checkUser.bind(this);
  }

  /* *
	 ! Todo: Implement pagination for this service
	*/
  async getAll(): Promise<t.GetUsersGetAllResponse> {
    try {
      const nc = await connect({ servers: nat_server });
      const sc = StringCodec();
      const data = {
        type: "getAll",
      };
      const ddata = JSON.stringify(data);
      const encoder = new TextEncoder();
      const enc = encoder.encode(ddata);
      const m = await nc.request("users", enc, { timeout: 1000 });
      console.log({ data: sc.decode(m.data) });
      const natsOutput = JSON.parse(sc.decode(m.data));

      if (natsOutput == 404) {
        await nc.close();
        return {
          status: 404,
          body: { message: `No users found` },
        };
      } else {
        const users: Api.User[] = natsOutput.map((item: any) =>
          v.modelApiUserFromJson("users", item)
        );

        await nc.close();
        return {
          status: 200,
          body: users,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: 404,
        body: { message: `something went wrong` },
      };
    }
  }

  async get(id: string): Promise<t.GetUsersGetResponse> {
    try {
      const nc = await connect({ servers: nat_server });
      const sc = StringCodec();
      const data = {
        type: "get",
        id: id,
      };
      const ddata = JSON.stringify(data);
      const encoder = new TextEncoder();
      const enc = encoder.encode(ddata);
      const m = await nc.request("users", enc, { timeout: 1000 });
      const natsOutput = JSON.parse(sc.decode(m.data));

      if (natsOutput == 404) {
        await nc.close();
        return {
          status: 404,
          body: { message: `No user found` },
        };
      } else {
        await nc.close();
        return {
          status: 200,
          body: natsOutput,
        };
      }
    } catch (error: any) {
      console.error(error);
      if (error.toString().match("no-device-found")) {
        return {
          status: 404,
          body: {
            message: "No device found with given id",
          },
        };
      }
      return {
        status: 404,
        body: { message: `something went wrong` },
      };
    }
  }

  async create(request: Api.User): Promise<t.PostUsersCreateResponse> {
    try {
      if (!request) {
        throw new Error("invalid-inputs");
      }
      request.id = v4();
      const usersRequest = JSON.parse(JSON.stringify(request));
      console.log({ usersRequest });
      try {
        const producer = kafka.producer({
          createPartitioner: Partitioners.DefaultPartitioner,
        });
        await producer.connect();

        const outgoingMessage = {
          key: `create#${request.id.toString()}`,
          value: JSON.stringify({
            ...usersRequest,
            isExist: true,
          }),
        };
        await producer.send({
          topic: "users",
          messages: [outgoingMessage],
        });
        return {
          status: 200,
          body: request,
        };
      } catch (error: any) {
        if (error.toString().match("no-id-found")) {
          throw new Error("no-id-found");
        }
        throw error;
      }
    } catch (error: any) {
      console.error(error);
      if (error.toString().match("invalid-inputs")) {
        return {
          status: 400,
          body: {
            message: "Invalid request",
          },
        };
      }

      if (error.toString().match("no-id-found")) {
        return {
          status: 400,
          body: {
            message: "No id found in request",
          },
        };
      }

      if (error.toString().match("device-id-already-exist")) {
        return {
          status: 400,
          body: {
            message: "device already exists with given date",
          },
        };
      }
      return {
        status: 400,
        body: { message: `something went wrong` },
      };
    }
  }

  async update(request: Api.User): Promise<t.PutUsersUpdateResponse> {
    try {
      if (!request) {
        throw new Error("invalid-inputs");
      }

      if (!request.id) {
        throw new Error("no-id-found");
      }

      const checkuser = await this.checkUser(request.id);
      const producer = kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner,
      });
      await producer.connect();
      const userRequest = JSON.parse(JSON.stringify(request));
      console.log({ userRequest });
      const outgoingMessage = {
        key: `update#${userRequest.id.toString()}`,
        value: JSON.stringify({
          ...userRequest,
        }),
      };
      await producer.send({
        topic: "users",
        messages: [outgoingMessage],
      });
      return {
        status: 200,
        body: {
          ...userRequest,
        },
      };
    } catch (error: any) {
      console.error(error);
      if (error.toString().match("invalid-inputs")) {
        return {
          status: 400,
          body: {
            message: "Invalid request",
          },
        };
      }

      if (error.toString().match("no-id-found")) {
        return {
          status: 400,
          body: {
            message: "No id found in request",
          },
        };
      }
      if (error.toString().match("users-id-already-exist")) {
        return {
          status: 400,
          body: {
            message: "users already exists with given date",
          },
        };
      }
      if (error.toString().match("no-user-found")) {
        return {
          status: 400,
          body: {
            message: "no user found to update",
          },
        };
      }

      return {
        status: 400,
        body: {
          message: "no id found with given info",
        },
      };
    }
  }

  async delete(id: string): Promise<t.DeleteUsersDeleteResponse> {
    try {
      const checkusers = await this.checkUser(id);
      if (checkusers.status === 200) {
        const producer = kafka.producer({
          createPartitioner: Partitioners.DefaultPartitioner,
        });
        await producer.connect();
        var data = checkusers.body;
        data.isExist = false;
        console.log({ data });
        const outgoingMessage = {
          key: `update#${id.toString()}`,
          value: JSON.stringify({
            ...data,
            updatedAt: new Date().toISOString(),
          }),
        };
        await producer.send({
          topic: "users",
          messages: [outgoingMessage],
        });
        return {
          status: 200,
          body: {
            message: `users deleted successfully`,
          },
        };
      }
      throw new Error("something-went-wrong");
    } catch (error: any) {
      console.error(error?.response?.status);
      return {
        status: 400,
        body: {
          message: "users already deleted or no users found",
        },
      };
    }
  }
  async checkUser(id: string) {
    const nc = await connect({ servers: nat_server });
    const sc = StringCodec();
    const data = {
      id: id,
      type: "get",
    };
    const ddata = JSON.stringify(data);
    const encoder = new TextEncoder();
    const enc = encoder.encode(ddata);
    const m = await nc.request("users", enc, { timeout: 1000 });
    const natsOutput = JSON.parse(sc.decode(m.data));

    if (natsOutput != 404) {
      const result: Api.User = v.modelApiUserFromJson("users", natsOutput);
      return {
        status: 200,
        body: result,
      };
    } else {
      throw new Error("no-user-found");
    }
  }
}
