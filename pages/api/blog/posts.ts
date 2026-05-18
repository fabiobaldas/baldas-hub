import type { NextApiRequest, NextApiResponse } from 'next'
import getClient from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await getClient()
  const db = client.db('baldashub')
  const col = db.collection('posts')

  if (req.method === 'GET') {
    const { publicado } = req.query
    const filtro = publicado === 'true' ? { publicado: true } : {}
    const posts = await col.find(filtro).sort({ data: -1 }).toArray()
    return res.json(posts.map(p => ({ ...p, _id: p._id.toString() })))
  }

  if (req.method === 'POST') {
    const post = { ...req.body, criadoEm: new Date() }
    const result = await col.insertOne(post)
    return res.status(201).json({ ...post, _id: result.insertedId.toString() })
  }

  res.status(405).end()
}
