import * as scuid from 'scuid'
import { series } from '../seriesData'

import {
  generateAuthToken,
  getUserId,
  likelyTopics,
  predefinedUsers,
} from '../utils'

const DEFAULT_COUNT = 25

export default {
  Query: {
    me: (parent, args, ctx) => {
      const userId = getUserId(ctx)
      const { faker } = ctx

      return {
        id: userId,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      }
    },

    allUsers: (parent, { count = DEFAULT_COUNT }, { faker }) =>
      predefinedUsers.slice(0, count),

    Series: () => series,

    User: (parent, { id }, { faker }) =>
      predefinedUsers.filter((user) => user.id === id)[0] || {
        id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      },

    allProducts: (parent, { count = DEFAULT_COUNT }, { faker }) => {
      return new Array(count).fill(0).map((_) => ({
        id: scuid(),
        price: faker.commerce.price(),
        name: faker.commerce.productName(),
      }))
    },

    Product: (parent, { id }, { faker }) => ({
      id,
      price: faker.commerce.price(),
      name: faker.commerce.productName(),
    }),

    Todo: (parent, { id }, { faker }) => ({
      id,
      title: faker.random.words(),
      completed: faker.random.boolean(),
    }),

    allTodos: (parent, { count = DEFAULT_COUNT }, { faker }) => {
      return new Array(count).fill(0).map((_) => ({
        id: scuid(),
        title: faker.random.words(),
        completed: faker.random.boolean(),
      }))
    },

    // refactor user relation into Class
    Post: (parent, { id }, { faker }) => {
      const title = faker.random.words()
      const body = faker.lorem.paragraphs()
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      return {
        id,
        title,
        body,
        published: faker.random.boolean(),
        createdAt: faker.date.between(
          new Date('2019-01-01'),
          new Date('2019-12-31'),
        ),
        author: {
          id: scuid(),
          firstName,
          lastName,
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
        },
        likelyTopics: likelyTopics(`${firstName} ${lastName}`, title, body),
      }
    },

    // refactor user relation into Class
    allPosts: (parent, { count }, { faker }) => {
      const usersToUse = predefinedUsers.slice(
        0,
        count > 200 ? Math.ceil(count / 50) : Math.ceil(count / 20),
      )
      return new Array(count).fill(0).map((_) => {
        const title = faker.random.words()
        const body = faker.lorem.paragraphs()
        const user = usersToUse[Math.floor(Math.random() * usersToUse.length)]
        const firstName = user.firstName
        const lastName = user.lastName
        return {
          id: scuid(),
          title,
          body,
          published: faker.random.boolean(),
          createdAt: faker.date.between(
            new Date('2019-01-01'),
            new Date('2019-12-31'),
          ),
          author: user,
          likelyTopics: likelyTopics(`${firstName} ${lastName}`, title, body),
        }
      })
    },
  },

  Mutation: {
    register: async (
      parent,
      { email, password, expiresIn = '2d' },
      { jwtSecret },
      info,
    ) => ({
      token: await generateAuthToken(
        { userId: scuid(), email },
        jwtSecret,
        expiresIn,
      ),
    }),

    login: async (
      parent,
      { email, password, expiresIn = '2d' },
      { jwtSecret },
      info,
    ) => ({
      token: await generateAuthToken(
        { email, userId: scuid() },
        jwtSecret,
        expiresIn,
      ),
    }),

    updateUser: (parent, { id, firstName, lastName, email, avatar }, ctx) => {
      const userId = getUserId(ctx)
      const { faker } = ctx

      return {
        id: userId,
        firstName: firstName === undefined ? faker.name.firstName() : firstName,
        lastName: lastName === undefined ? faker.name.lastName() : lastName,
        email: email === undefined ? faker.internet.email() : email,
        avatar: avatar === undefined ? faker.image.avatar() : avatar,
      }
    },

    savePeriods: (parent, { periods }) =>
      periods.map((period) => ({ id: scuid(), ...period })),

    // No authentication for demo purposes
    createTodo: (parent, { title, completed }, { faker }) => {
      const id = scuid()

      // pubsub.publish('todoAdded', {
      //   todoAdded: {
      //     id,
      //     title,
      //     completed
      //   }
      // });

      return {
        id,
        title,
        completed: completed === undefined ? faker.random.boolean() : completed,
      }
    },
  },

  // Subscription: {
  //   todoAdded: {
  //     subscribe: (parent, args, { pubsub }) => {
  //       // setInterval(
  //       //   () => pubsub.publish(channel, { counter: { count: count++ } }),
  //       //   2000
  //       // );
  //       //
  //       // return pubsub.asyncIterator({
  //       //   id: 'abc',
  //       //   title: 'Hello',
  //       //   completed: true
  //       // });
  //     }
  //   }
  // }
}
