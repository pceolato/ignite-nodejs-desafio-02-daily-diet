import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('Meals routes', () => {
    it('should be able to create a new meal', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'Pedro Ceolato',
        email: 'pedrol.ceolato@gmail.com',
      })

      const cookies = createUserResponse.get('Set-Cookie')! // ! indica que a variavél deve existir, se não existir gera erro
      expect(cookies)

      await request(app.server)
        .post('/meal')
        .set('Cookie', cookies)
        .send({
          name: 'x-tudo',
          description: 'Hambuger da lanchonete do bairro',
          withinDiet: false,
          date: '2024-08-28',
          hour: '21:45:00',
        })
        .expect(201)
    })

    it('shoukd be able to list all meals', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'Pedro Ceolato',
        email: 'pedrol.ceolato@gmail.com',
      })

      const cookies = createUserResponse.get('Set-Cookie')! // ! indica que a variavél deve existir, se não existir gera erro
      expect(cookies)

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'x-tudo',
        description: 'Hambuger da lanchonete do bairro',
        withinDiet: false,
        date: '2024-08-28',
        hour: '21:45:00',
      })

      const listMealResponse = await request(app.server)
        .get('/meal')
        .set('Cookie', cookies)
        .expect(200)

      expect(listMealResponse.body.meals).toEqual([
        expect.objectContaining({
          name: 'x-tudo',
          description: 'Hambuger da lanchonete do bairro',
          withinDiet: 0,
        }),
      ])
    })

    it('shoukd be able to get the meal by id', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'Pedro Ceolato',
        email: 'pedrol.ceolato@gmail.com',
      })

      const cookies = createUserResponse.get('Set-Cookie')! // ! indica que a variavél deve existir, se não existir gera erro
      expect(cookies)

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'x-tudo',
        description: 'Hambuger da lanchonete do bairro',
        withinDiet: false,
        date: '2024-08-28',
        hour: '21:45:00',
      })

      const listMealResponse = await request(app.server)
        .get('/meal')
        .set('Cookie', cookies)
        .expect(200)

      const mealId = listMealResponse.body.meals[0].id

      const mealResponse = await request(app.server)
        .get(`/meal/${mealId}`)
        .set('Cookie', cookies)
        .expect(200)

      expect(mealResponse.body.meal).contain({
        name: 'x-tudo',
        description: 'Hambuger da lanchonete do bairro',
        withinDiet: 0,
      })
    })

    it('shoukd be able to update the meal by id', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'Pedro Ceolato',
        email: 'pedrol.ceolato@gmail.com',
      })

      const cookies = createUserResponse.get('Set-Cookie')! // ! indica que a variavél deve existir, se não existir gera erro
      expect(cookies)

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'x-tudo',
        description: 'Hambuger da lanchonete do bairro',
        withinDiet: false,
        date: '2024-08-28',
        hour: '21:45:00',
      })

      const listMealResponse = await request(app.server)
        .get('/meal')
        .set('Cookie', cookies)
        .expect(200)

      const mealId = listMealResponse.body.meals[0].id

      await request(app.server)
        .put(`/meal/${mealId}`)
        .set('Cookie', cookies)
        .send({
          name: 'x-tudo duplo',
          description: 'Hambuger da lanchonete do bairro e uma coca',
          withinDiet: false,
          date: '2024-08-28',
          hour: '21:45:00',
        })
        .expect(204)
    })

    it('shoukd be able to delete the meal by id', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'Pedro Ceolato',
        email: 'pedrol.ceolato@gmail.com',
      })

      const cookies = createUserResponse.get('Set-Cookie')! // ! indica que a variavél deve existir, se não existir gera erro
      expect(cookies)

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'x-tudo',
        description: 'Hambuger da lanchonete do bairro',
        withinDiet: false,
        date: '2024-08-28',
        hour: '21:45:00',
      })

      const listMealResponse = await request(app.server)
        .get('/meal')
        .set('Cookie', cookies)
        .expect(200)

      const mealId = listMealResponse.body.meals[0].id

      await request(app.server)
        .delete(`/meal/${mealId}`)
        .set('Cookie', cookies)
        .expect(204)
    })
  })

  describe('Users routes', () => {
    it('should be able to create a new user', async () => {
      await request(app.server)
        .post('/users')
        .send({
          name: 'Pedro Ceolato',
          email: 'pedrol.ceolato@gmail.com',
        })
        .expect(201)
    })

    it('shoukd be able to get the metrics user', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'Pedro Ceolato',
        email: 'pedrol.ceolato@gmail.com',
      })

      const cookies = createUserResponse.get('Set-Cookie')! // ! indica que a variavél deve existir, se não existir gera erro
      expect(cookies)

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'x-tudo',
        description: 'Hambuger da lanchonete do bairro',
        withinDiet: false,
        date: '2024-08-28',
        hour: '21:45:00',
      })

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'Café da manha',
        description: 'Café da manha com frutas, ovos e pão',
        withinDiet: true,
        date: '2024-08-29',
        hour: '07:45:00',
      })

      await request(app.server).post('/meal').set('Cookie', cookies).send({
        name: 'Almoço',
        description: '200g de frango e 200 de arroz',
        withinDiet: true,
        date: '2024-08-29',
        hour: '13:00:00',
      })

      const metricsResponse = await request(app.server)
        .get('/users/metrics')
        .set('Cookie', cookies)
        .expect(200)

      expect(metricsResponse.body).toEqual({
        totalMeal: 3,
        totalMealDiet: 2,
        totalMealOutDiet: 1,
        bestDietSequence: 2,
      })
    })
  })
})
