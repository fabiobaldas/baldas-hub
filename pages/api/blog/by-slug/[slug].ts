import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const { slug } = req.query
  const client = await clientPromise
  const post = await client
    .db('baldashub')
    .collection('posts')
    .findOne({ slug, publicado: true })

  if (!post) return res.status(404).json({ erro: 'Post não encontrado' })
  res.json({ ...post, _id: post._id.toString() })
}
