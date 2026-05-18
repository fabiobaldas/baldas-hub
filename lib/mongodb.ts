import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!uri) {
  // Durante o build estático, retorna uma promise que nunca resolve
  // Os getServerSideProps têm try/catch, então isso é seguro
  clientPromise = new Promise(() => {})
} else if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = new MongoClient(uri).connect()
}

export default clientPromise
