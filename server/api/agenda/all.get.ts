import { allQuery } from '../../database/db'

export default defineEventHandler(async () => {
  try {
    const sql = `
      SELECT a.id, a.title, a.start_date
      FROM agendas a
      ORDER BY a.start_date DESC
      LIMIT 500
    `
    const agendas = await allQuery(sql)
    return (agendas as any[]).map((a) => ({
      id: a.id,
      title: a.title,
      start_date: a.start_date
    }))
  } catch (error) {
    console.error('Error fetching all agendas:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
