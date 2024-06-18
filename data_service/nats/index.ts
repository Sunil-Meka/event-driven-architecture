import { NatsConnection, StringCodec, Subscription } from "nats";
import { usersStore } from "../kafka/index";

export class UsersNats {
  async usersNatsSubscriber(nc: NatsConnection) {
    const sc = StringCodec();
    const sub = nc.subscribe("users");
    (async (sub: Subscription) => {
      console.log(`listening for ${sub.getSubject()} requests...`);
      for await (const m of sub) {
        const decoder = new TextDecoder("utf-8");
        const payload = JSON.parse(decoder.decode(m.data));
        if (payload.type == "get") {
          const finalres = usersStore[payload.id];
          if (finalres && finalres.isExist == true) {
            if (m.respond(sc.encode(JSON.stringify(finalres)))) {
              console.info(`[users] handled #${sub.getProcessed()}`);
            } else {
              console.log(
                `[users] #${sub.getProcessed()} ignored - no reply subject`
              );
            }
          } else {
            console.log("not found");
            if (m.respond(sc.encode("404"))) {
              console.info(`[users] handled #${sub.getProcessed()}`);
            } else {
              console.log(
                `[users] #${sub.getProcessed()} ignored - no reply subject`
              );
            }
          }
        } else if (payload.type == "getAll") {
          const allusers: any = usersStore;
          const finalRes = Object.values(allusers).filter((item: any) => {
            return item.isExist;
          });

          if (m.respond(sc.encode(JSON.stringify(finalRes)))) {
            console.info(`[users] handled #${sub.getProcessed()}`);
          } else {
            console.log(
              `[users] #${sub.getProcessed()} ignored - no reply subject`
            );
          }
        }
      }
      console.log(`subscription ${sub.getSubject()} drained.`);
    })(sub);
  }
}
