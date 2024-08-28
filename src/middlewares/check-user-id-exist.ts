import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkUserIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.userId

  if (!userId) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }

  const user = await knex('user').where('id', userId).first()
  if (!user) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
