import { Kafka } from "kafkajs";
import { kafka_server } from "../admin";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [kafka_server],
});

export var usersStore = {};

export class UsersTopicsListening {
  async notesTopicsListening() {
    const consumer = kafka.consumer({
      groupId: `user-group`,
    });
    await consumer.connect();
    await consumer.subscribe({ topic: "users", fromBeginning: true });
    await consumer.run({
      eachMessage: async (data) => {
        const { topic, partition, message } = data;
        const operation = message.key.toString().split("#")[0];
        const key = message.key.toString().split("#")[1];
        if (operation == "create" && message.value) {
          const obj = JSON.parse(message.value.toString("utf8"));
          usersStore[key] = obj;
          console.log("data sent to local");
        } else if (operation == "update" && message.value) {
          const obj = JSON.parse(message.value.toString("utf8"));
          let result = usersStore[key];
          usersStore[key] = {
            ...result,
            ...obj,
          };
          console.log("data updated in store");
        } else if (operation == "delete" && message.value) {
          const obj = JSON.parse(message.value.toString("utf8"));
          usersStore[key] = obj;
          let result = usersStore[key];
          usersStore[key] = {
            ...result,
            ...obj,
          };
        }
      },
    });
    consumer.seek({
      topic: "users",
      partition: 0,
      offset: "0",
    });
  }
}
