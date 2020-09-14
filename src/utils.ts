import * as scuid from 'scuid'
import * as jwt from 'jsonwebtoken'
import * as faker from 'faker/locale/en'

export const generateAuthToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, {
    expiresIn,
  })

export const getUserId = (ctx) => {
  const Authorization = ctx.request.get('Authorization')

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  }

  throw new Error('Not Authorized')
}

// Ten randomly-chosen but consistent topic nouns.
export const topicWords = [
  'wedding',
  'sport',
  'fishing',
  'shopping',
  'security',
  'management',
  'community',
  'celebrity',
  'birthday',
  'potato',
]

export const likelyTopics = (user, title, body) => {
  // create a custom order over the topics, based on letters as they appear in
  // the user's name, post title, and post body, for variability
  const alphabet = `${title} ${user} ${body}`
  const topicLabels = topicWords.sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const aValue = alphabet.indexOf(a[i])
      const bValue = alphabet.indexOf(b[i])
      if (aValue !== bValue) {
        return bValue - aValue
      }
    }
    return b.length - a.length
  })
  // compute a biased probability distribution
  const likelihoods = []
  let total = 0
  for (let i = 0; i < topicLabels.length; i++) {
    const weight = Math.random() * Math.log(i + 2)
    total += weight
    likelihoods.push(weight)
  }
  likelihoods.reverse()
  // and associate each likelihood with a probability
  return likelihoods
    .map((weight, i) => {
      return {
        likelihood: weight / total,
        label: topicLabels[i],
      }
    })
    .sort((a, b) => b.likelihood - a.likelihood)
}

export const createFullUser = () => ({
  id: scuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
})

export const predefinedUsers = new Array(1000)
  .fill(null)
  .map((_) => createFullUser())
