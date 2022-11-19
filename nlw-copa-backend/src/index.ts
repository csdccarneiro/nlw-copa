import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import guessRoutes from "./routes/guess"
import userRoutes from "./routes/user"
import poolRoutes from "./routes/pool"

const fastify = Fastify({
    logger: true
})

fastify.register(cors, { origin: true });

fastify.register(jwt, { secret: 'nlwcopa' });

fastify.register(guessRoutes, { prefix: "/guesses" })

fastify.register(userRoutes, { prefix: "/users" })

fastify.register(poolRoutes, { prefix: "/pools" })

fastify.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
    if (err) throw err
})