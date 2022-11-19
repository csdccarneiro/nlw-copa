import { FastifyPluginAsync } from 'fastify'
import GameController from '../controllers/GameController'
import GuessController from '../controllers/GuessController'
import PoolController from "../controllers/PoolController"
import { authenticate } from '../plugins/authenticate'

const poolRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
    
    fastify.post('/', PoolController.create)
    fastify.post('/join', { onRequest: [authenticate] }, PoolController.join)
    fastify.post('/:poolId/games/:gameId/guesses', { onRequest: [authenticate] },  GuessController.create)


    fastify.get('/', { onRequest: [authenticate] }, PoolController.index)
    fastify.get('/:id', { onRequest: [authenticate] }, PoolController.show)
    fastify.get('/:id/games', { onRequest: [authenticate] }, GameController.index)
    fastify.get('/count', PoolController.count)

    
}

export default poolRoutes