import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import getClient from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  let objectId: ObjectId
  try {
    objectId = new ObjectId(id as string)
  } catch {
    return res.status(400).json({ erro: 'ID inválido' })
  }

  const client = await getClient()
  const col = client.db('baldashub').collection('posts')

  if (req.method === 'PUT') {
    const { _id, ...update } = req.body
    await col.updateOne({ _id: objectId }, { $set: update })
    return res.json({ ok: true })
  }

  if (req.method === 'DELETE') {
    await col.deleteOne({ _id: objectId })
    return res.json({ ok: true })
  }

  res.status(405).end()
}
