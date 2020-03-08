declare module 'folktale/validation'
declare module 'knex-cleaner'

declare namespace Express {
  export interface Request {
    decodedJwt?: {
      subject: number
      username: string
      iat: number
      exp: number
    }
  }
}
