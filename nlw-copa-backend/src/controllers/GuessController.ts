import {  FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from "../lib/prisma"

const GuessController = {

    count: async function () {

        const countGuesses  = await prisma.guess.count()    

        return { count: countGuesses }

    },

    create: async function(request: FastifyRequest, reply: FastifyReply) {

        const createGuessesParams = z.object({
            poolId: z.string(),
            gameId: z.string()
        })

        const createGuessesBody = z.object({
            first_team_points: z.number(),
            second_team_points: z.number()
        })

        const { poolId, gameId } = createGuessesParams.parse(request.params)

        const { first_team_points, second_team_points } = createGuessesBody.parse(request.body)

        const participant = await prisma.participant.findUnique({
            where: {
                user_id_pool_id: {
                    pool_id: poolId, 
                    user_id: request.user.sub
                }
            }
        })

        if (!participant) {
            
            return reply.status(400).send({
                message: "You're not allowed to create a guess inside this pool"
            })            

        }

        const guess = await prisma.guess.findUnique({
            where: {
                participant_id_game_id: {
                    participant_id: participant.id,
                    game_id: gameId
                }
            }
        })

        if (guess) {

            return reply.status(400).send({
                message: "You already sent a guess to this game on this pool"
            })

        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }
        })

        if (!game) {

            return reply.status(400).send({
                message: "Game not found"
            })

        }


        if (game.date < new Date()) {
            
            return reply.status(400).send({
                message: "You cannot send guesses after the game date"
            })
            
        }

        await prisma.guess.create({
            data: {
                game_id: gameId,
                participant_id: participant.id,
                first_team_points: first_team_points,
                second_team_points: second_team_points
            }
        })

        return reply.status(201).send()

    }

}

export default GuessController