import "dotenv/config";
import { DNSServer } from "./server";

(async () => {
  await new DNSServer().start()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
})();