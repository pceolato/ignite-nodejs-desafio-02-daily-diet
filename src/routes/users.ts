import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkUserIdExist } from '../middlewares/check-user-id-exist'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/metrics',
    {
      preHandler: [checkUserIdExist],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const { totalMeal } = (await knex('meal')
        .where('user_id', userId)
        .count('id', { as: 'totalMeal' })
        .first()) as { totalMeal: number }

      const { totalMealDiet } = (await knex('meal')
        .where({ user_id: userId, withinDiet: true })
        .count('id', { as: 'totalMealDiet' })
        .first()) as { totalMealDiet: number }

      const totalMealOutDiet = Number(totalMeal) - Number(totalMealDiet)

      // Recupera todas as refeições do usuário, ordenadas pela data
      const meals = await knex('meal')
        .where('user_id', userId)
        .orderBy('date', 'asc')
        .select('withinDiet')

      // Calcula a maior sequência de refeições dentro da dieta
      let maxSequence = 0
      let currentSequence = 0

      meals.forEach((meal) => {
        if (meal.withinDiet) {
          currentSequence += 1
          maxSequence = Math.max(maxSequence, currentSequence)
        } else {
          currentSequence = 0
        }
      })

      return reply.status(200).send({
        totalMeal,
        totalMealDiet,
        totalMealOutDiet,
        bestDietSequence: maxSequence,
      })
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const userId = await knex('user')
      .insert({
        id: randomUUID(),
        name,
        email,
      })
      .returning('id')

    reply.cookie('userId', userId[0].id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send({
      userId: userId[0].id,
    })
  })
}
