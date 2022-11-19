import { FastifyPluginAsync } from 'fastify'
import GuessController from "../controllers/GuessController"

const guessRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get('/count', GuessController.count)
}

export default guessRoutes