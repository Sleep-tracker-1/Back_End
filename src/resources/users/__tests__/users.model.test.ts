import db from '../../../data/dbConfig'
import { findBy, findById, insert, remove, update } from '../users.model'
import { buildUser } from '../../../utils/test/generate'

beforeEach(() => db.raw('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE'))

describe('users model', () => {
  describe('findBy', () => {
    it('should return all users matching the provided filter', async () => {
      const user1 = buildUser(6, true)
      const user2 = buildUser(6, true)

      await insert(user1)
      await insert(user2)

      expect(await findBy({ username: user1.username })).toEqual([
        {
          id: 1,
          username: user1.username,
          password: user1.password,
          first_name: user1.firstName,
          email: user1.email,
        },
      ])
    })
  })

  describe('findById', () => {
    it('should return 1 user with the matching id', async () => {
      const user1 = buildUser(6, true)
      const user2 = buildUser(6, true)

      await insert(user1)
      await insert(user2)

      expect(await findById(1)).toEqual({
        id: 1,
        username: user1.username,
        password: user1.password,
        first_name: user1.firstName,
        email: user1.email,
      })
    })
  })

  describe('insert', () => {
    it("should add a user to the database and return the user's info minus the password", async () => {
      const user = buildUser(6, true)

      expect(await insert(user)).toEqual([
        {
          id: 1,
          username: user.username,
          firstName: user.firstName,
          email: user.email,
        },
      ])
    })
  })

  describe('update', () => {
    it("should update a user and return the user's info minus the password", async () => {
      const user = buildUser(6, true)
      const insertedUser = await insert(user)
      expect(insertedUser).toEqual([
        {
          id: 1,
          username: user.username,
          firstName: user.firstName,
          email: user.email,
        },
      ])

      const userToUpdate = buildUser(6, true)

      expect(await update(1, userToUpdate)).toEqual([
        {
          id: 1,
          username: userToUpdate.username,
          firstName: userToUpdate.firstName,
          email: userToUpdate.email,
        },
      ])
    })
  })

  describe('remove', () => {
    it('should delete a user from the database', async () => {
      const user1 = buildUser(6, true)
      const user2 = buildUser(6, true)

      await insert(user1)
      await insert(user2)

      expect(await remove(1)).toEqual(1)
      expect(await findById(1)).toBeUndefined()
    })
  })
})
