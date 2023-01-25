import { createSchema, createYoga } from 'graphql-yoga'
import * as fs from 'fs'
import * as path from 'path'
import * as faker from 'faker/locale/en'

import resolvers from './resolvers'
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
