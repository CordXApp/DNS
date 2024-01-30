import { V1DnsRouter } from "./dns/router";
import { V1AuthRouter } from "./oauth/router";

export const V1Router = [...V1AuthRouter, ...V1DnsRouter];