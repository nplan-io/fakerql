import * as jwt from 'jsonwebtoken';

export const generateAuthToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, {
    expiresIn
  });

export const getUserId = ctx => {
  const Authorization = ctx.request.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return userId;
  }

  throw new Error('Not Authorized');
};

// Generate a uniform probability histogram
export const probabilityHistogram = bins => {
  const independent = []
  let total = 0
  for (let i = 0; i < bins; i++) {
    const weight = Math.random()
    total += weight
    independent.push(weight)
  }
  return independent.map(weight => weight / total)
}