import {getRoutes} from "./route";


const routes = getRoutes();

console.log('routes', routes)

/*
const routes = Object.fromEntries(getRoutes().map(route => [route.path, route.controller]));

console.log("routes", routes)
const pingResponse = routes["/ping"].call()
const userByIdResponse = routes["/users/[id]"].call(this, 1)
const appsResponse = routes["/users/[id]/applications"].call()
const appByIdByUserIdResponse = routes["/users/[id]/applications/[id]"].call(this, 5)

console.log("ping response: ", pingResponse);
console.log("user by id response: ", userByIdResponse);

console.log("apps response", appsResponse);
console.log("app by id and user id response", appByIdByUserIdResponse);
 */
