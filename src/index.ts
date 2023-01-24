import { createSchema, createYoga } from 'graphql-yoga'
import * as fs from 'fs'
import * as path from 'path'
import { formatError } from 'apollo-errors'
import * as jwt from 'express-jwt'
import * as faker from 'faker/locale/en'
import * as compression from 'compression'

import resolvers from './resolvers'
import defaultPlaygroundQuery from './initQuery'
import { createServer } from 'http'

const { JWT_SECRET } = process.env

export const schema = createSchema({
  typeDefs: fs.readFileSync(
    path.join(path.join(__dirname, 'schema.graphql')),
    'utf-8',
  ),
  resolvers,
})

const yoga = createYoga({
  schema,
  context: {
    jwtSecret: JWT_SECRET,
    faker,
  },
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})

// server.express.disable('x-powered-by')

// server.express.use(
//   '/graphql',
//   jwt({
//     secret: JWT_SECRET,
//     credentialsRequired: false,
//   }),
// )

// server.express.use(compression())

// const options = {
//   formatError,
//   endpoint: '/graphql',
//   subscriptions: '/subscriptions',
//   playground: '/',
//   defaultPlaygroundQuery,
// }

// server.start(options, ({ port }) =>
//   console.log(`Server is running on PORT: ${port}`),
// )
