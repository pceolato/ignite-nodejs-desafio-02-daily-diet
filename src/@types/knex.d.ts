import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    user: {
      id: string
      name: string
      email: string
    }

    meal: {
      id: string
      name: string
      description: string
      withinDiet: boolean
      date: string
      user_id: string
    }
  }
}
