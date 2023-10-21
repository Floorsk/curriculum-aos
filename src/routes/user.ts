import { FastifyInstance, RouteShorthandOptions, FastifyRequest } from "fastify";
type Router = (fastify: FastifyInstance, opts: RouteShorthandOptions, done: () => void) => void;
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient()

const router: Router = (fastify, opts, done) => {

    fastify.get('/', async (request, reply) => {
        const users = prisma.user.findMany()
        return users
    });

    fastify.post('/', async (request, reply) => {

        const userSchema = z.object({
            name: z.string(),
            email: z.string()
        })

        const { name, email } = userSchema.parse(request.body)

        const isResgistered = await prisma.user.findMany({ where: { email: email } })

        if (isResgistered.length === 0) {
            await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                }
            })
            reply.status(200)
        } else {
            reply.status(400)
        }
    })

    fastify.get('/curriculum/:userId', async (request, reply) => {
        const paramsSchema = z.object({
            userId: z.string(),
        })
        const { userId } = paramsSchema.parse(request.params)

        const curriculum = prisma.curriculum.findUnique({where: {userId: userId}})
        return curriculum
    })

    fastify.post('/curriculum', async (request, reply) => {

        const bodySchema = z.object({
            userId: z.string(),
            description: z.string(),
            title: z.string()
        })
        const { userId, title, description } = bodySchema.parse(request.body)

        await prisma.curriculum.create({
            data: {
                userId: userId,
                description: description,
                title: title,
            }
        })

        reply.send("Foi")
    })

    fastify.put('/curriculum', async (request, reply) => {

        const bodySchema = z.object({
            userId: z.string(),
            description: z.string()
        })

        const { userId, description } = bodySchema.parse(request.body)

        await prisma.curriculum.update({where: {userId: userId}, data: {
            description: description
        }})

        reply.send("Foi")
    })


    done();
};

export default router