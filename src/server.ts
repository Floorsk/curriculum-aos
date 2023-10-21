import { PrismaClient } from "@prisma/client";
import { fastify } from "fastify";
import routes from "./routes";

const app = fastify()
const prisma = new PrismaClient()

app.register(routes.user, { prefix: '/user' })
 
app.listen({
    host: '0.0.0.0',
    port: 3333,
}).then(() => {
    console.log('http listening to 3333')
})