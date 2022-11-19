import {  FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { prisma } from "../lib/prisma"

const PoolController = {

    index: async function (request: FastifyRequest, reply: FastifyReply) {

        const pools = await prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        user_id: request.user.sub
                    }
                }
            },
            include: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatar_url: true
                            }
                        }
                    },
                    take: 4
                },
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return pools

    },

    show: async function (request: FastifyRequest, reply: FastifyReply) {

        const getPoolParams = z.object({
            id: z.string()
        })

        const { id } = getPoolParams.parse(request.params)

        const pool = await prisma.pool.findUnique({
            where: {
                id
            },
            include: {
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatar_url: true
                            }
                        }
                    },
                    take: 4
                },
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return pool

    },

    count: async function () {

        const countPool  = await prisma.pool.count()    

        return { count: countPool }

    },

    create: async function (request: FastifyRequest, reply: FastifyReply) {

        const bodyPool = z.object({ title: z.string() })

        const body = bodyPool.parse(request.body)

        let pool_created = null

        try {

            await request.jwtVerify()

            pool_created = await prisma.pool.create({
                data: {
                    title: body.title,
                    code: Math.random().toString(36).slice(-6).toUpperCase(), //CRIANDO CÓDIGO ALEATÓRIA
                    owner_id: request.user.sub,
                    participants: {
                        create: {
                            user_id: request.user.sub
                        }
                    }
                }   
            })

        }
        catch { 

            pool_created = await prisma.pool.create({
                data: {
                    title: body.title,
                    code: Math.random().toString(36).slice(-6).toUpperCase(), //CRIANDO CÓDIGO ALEATÓRIA
                }   
            })

        }

        return reply.status(201).send(pool_created)

    },


    join: async function (request: FastifyRequest, reply: FastifyReply) {

        const joinPoolBody = z.object({ code: z.string() })

        const { code } = joinPoolBody.parse(request.body)

        const pool = await prisma.pool.findUnique({
            where: {
                code
            },
            include: {
                participants: {
                    where: {
                        user_id: request.user.sub
                    }
                }
            }
        })

        if (!pool) {

            return reply.status(400).send({
                messsage: "Pool not found"
            })

        }

        if (pool.participants.length > 0) {

            return reply.status(400).send({
                messsage: "You already joined this pool"
            })

        }   

        if (!pool.owner_id) {

            await prisma.pool.update({
                where: {
                    id: pool.id
                },
                data: {
                    owner_id: request.user.sub
                }
            })

        }   

        await prisma.participant.create({
            data: {
                pool_id: pool.id,
                user_id: request.user.sub
            }
        })

        return reply.status(201).send()

    }   

}

export default PoolController