import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

let clientPromise: Promise<MongoClient>

declare global {
  // evita criar múltiplas conexões em dev (hot reload)
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!uri) throw new Error('MONGODB_URI não definida')

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = new MongoClient(uri).connect()
}

export default clientPromise
