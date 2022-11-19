import {  FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from "../lib/prisma"

const GameController = {

    index: async function (request: FastifyRequest, reply: FastifyReply) {  

        const getPoolParams = z.object({
            id: z.string()
        })

        const { id } = getPoolParams.parse(request.params)

        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc'
            },
            include: {
                guesses: {
                    where: {
                        participant: {
                            user_id: request.user.sub,
                            pool_id: id
                        }
                    }
                }
            }
        })

        return games.map(game => ({
            ...game, 
            guess: (game.guesses.length > 0 ? game.guesses[0] : null),
            guesses: undefined
        }))

    }


}

export default GameController