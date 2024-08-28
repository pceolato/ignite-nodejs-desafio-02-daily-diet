import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkUserIdExist } from '../middlewares/check-user-id-exist'
import dayjs from 'dayjs'

export async function mealRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserIdExist],
    },
    async (request) => {
      const { userId } = request.cookies

      const meals = await knex('meal')
        .where('user_id', userId)
        .select()
        .orderBy('date', 'desc')

      return {
        meals,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExist],
    },
    async (request) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const { userId } = request.cookies

      const meal = await knex('meal')
        .where({
          id,
          user_id: userId,
        })
        .first()
        .select('*')

      return {
        meal,
      }
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExist],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const { userId } = request.cookies

      const editMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        withinDiet: z.boolean(),
        date: z.string(),
        hour: z.string(),
      })

      const { name, description, withinDiet, date, hour } =
        editMealBodySchema.parse(request.body)

      const timestampDate = dayjs(`${date} ${hour}`).format(
        'YYYY-MM-DD HH:mm:ss',
      )

      await knex('meal')
        .where({
          id,
          user_id: userId,
        })
        .update({
          name,
          description,
          withinDiet,
          date: timestampDate,
          user_id: userId,
        })

      return reply.status(204).send()
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserIdExist],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        withinDiet: z.boolean(),
        date: z.string(),
        hour: z.string(),
      })

      const { name, description, withinDiet, date, hour } =
        createMealBodySchema.parse(request.body)

      const timestampDate = dayjs(`${date} ${hour}`).format(
        'YYYY-MM-DD HH:mm:ss',
      )

      await knex('meal').insert({
        id: randomUUID(),
        name,
        description,
        withinDiet,
        date: timestampDate,
        user_id: userId,
      })

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExist],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)
      const { userId } = request.cookies

      await knex('meal')
        .where({
          id,
          user_id: userId,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
