import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

const DB   = 'baldashub'
const COLL = 'condominios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise
  const col    = client.db(DB).collection(COLL)

  // GET — retorna a lista
  if (req.method === 'GET') {
    const docs = await col.find({}, { projection: { _id: 0 } }).toArray()
    return res.status(200).json(docs)
  }

  // POST — substitui a lista completa
  if (req.method === 'POST') {
    const lista = req.body
    if (!Array.isArray(lista)) {
      return res.status(400).json({ erro: 'Body deve ser um array' })
    }
    await col.deleteMany({})
    if (lista.length > 0) {
      await col.insertMany(lista)
    }
    return res.status(200).json({ ok: true, total: lista.length })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Method Not Allowed')
}
