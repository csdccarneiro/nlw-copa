import { FastifyPluginAsync } from 'fastify'
import UserController from "../controllers/UserController"
import { authenticate } from '../plugins/authenticate'

const userRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post('/', UserController.create)
    fastify.get('/me', { onRequest: [authenticate] }, UserController.current)
    fastify.get('/count', UserController.count)
}

export default userRoutes