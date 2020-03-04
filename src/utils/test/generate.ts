import { Response } from 'express'
import faker from 'faker'
import bcrypt from 'bcrypt'
import { add } from 'date-fns'
import { Id } from '../crud'

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

export const buildBedhour = (
  startDateTime: {
    year: number
    month: number
    date: number
    hours: number
    minutes: number
    seconds: number
  },
  timeToAdd: { hours: number; minutes: number; seconds: number },
  userId: number
): { bedtime: Date; waketime: Date; user_id: number } => {
  const bedtime = new Date(
    startDateTime.year,
    startDateTime.month,
    startDateTime.date,
    startDateTime.hours,
    startDateTime.minutes,
    startDateTime.seconds
  )
  const waketime = add(bedtime, {
    hours: timeToAdd.hours,
    minutes: timeToAdd.minutes,
    seconds: timeToAdd.seconds,
  })

  return {
    bedtime,
    waketime,
    user_id: userId,
  }
}

export const buildNext: () => jest.Mock = () => jest.fn().mockName('next')
