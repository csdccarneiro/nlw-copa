import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

    const user = await prisma.user.create({
        data: {
            name: 'Fulano de Tal',
            email: 'fulanodetal@gmail.com',
            avatar_url: 'https://github.com/csdccarneiro.png'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Bolão do Fulano de Tal',
            code: 'FULA12',
            owner_id: user.id,
            participants: {
                create: {
                    user_id: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: new Date().toISOString(),
            first_team_country_code: 'DE',
            second_team_country_code: 'BR'
        }
    })

    await prisma.game.create({
        data: {
            date: new Date().toISOString(),
            first_team_country_code: 'BR',
            second_team_country_code: 'AR',
            guesses: {
                create: {
                    first_team_points: 2,
                    second_team_points: 1,
                    participant: {
                        connect: {
                            user_id_pool_id: {
                                user_id: user.id,
                                pool_id: pool.id
                            }
                        }
                    }
                }
            }
        }
    })

}

main()