import { Response } from 'express'
import faker from 'faker'
import bcrypt from 'bcrypt'

export interface MockResponse extends Response {
  status: jest.Mock
  json: jest.Mock
  headersSent: boolean
}

export const buildUser = (
  passwordLength: number,
  hash: boolean
): {
  username: string
  password: string
  firstName: string
  email: string
} => {
  return {
    username: faker.internet.userName(),
    password: hash
      ? bcrypt.hashSync(faker.internet.password(passwordLength), 10)
      : faker.internet.password(passwordLength),
    firstName: faker.name.firstName(),
    email: faker.internet.email(),
  }
}

export const buildNext: () => jest.Mock = () => jest.fn().mockName('next')
