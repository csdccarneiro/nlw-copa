import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { prisma } from "../lib/prisma"

const UserController = {

    count: async function () {

        const countUser  = await prisma.user.count()    

        return { count: countUser }

    },

    current: async function (request: FastifyRequest, reply: FastifyReply) {

        return request.user

    },

    create: async function (request: FastifyRequest, reply: FastifyReply) {

        const createUserBody = z.object({ access_token: z.string() })

        const { access_token  } = createUserBody.parse(request.body)    

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        const userData = await userResponse.json()

        const userInfoSchema = z.object({ 
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url() 
        })

        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where: {
                google_id: userInfo.id
            }
        })

        if (!user) {

            user = await prisma.user.create({
                data: {
                    google_id: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatar_url: userInfo.picture
                }
            })

        }
        
        const token = await reply.jwtSign({
            name: user.name,
            avatar_url: user.avatar_url            
        }, {
            sign: {
                sub: user.id, 
                expiresIn: '7 days'
            }
        })

        return { token }

    }

}

export default UserController