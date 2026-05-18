import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Conexão lazy — só conecta quando getClient() é chamado (em runtime, não no build)
export function getClient(): Promise<MongoClient> {
  if (!uri) return Promise.reject(new Error('MONGODB_URI não definida'))

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect()
    }
    return global._mongoClientPromise
  }

  // Em produção, cria um novo cliente por módulo
  // (Vercel isola cada invocação serverless)
  return new MongoClient(uri).connect()
}

export default getClient
