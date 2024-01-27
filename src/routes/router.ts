import { BaseRoutes } from "./base/router";
import { V1Router } from "./v1/router";

const routes = [...BaseRoutes, ...V1Router]

export default routes;