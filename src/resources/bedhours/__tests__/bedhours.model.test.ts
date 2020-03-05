import db from '../../../data/dbConfig'
import { find, findById, insert, update, remove } from '../bedhours.model'
import { buildBedhour } from '../../../utils/test/generate'

beforeEach(() => db.raw('TRUNCATE TABLE "bedhours" RESTART IDENTITY CASCADE'))

describe('bedhours model', () => {
  describe('find', () => {
    it("should return all user's bedhours between 2 dates", async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )
      const bedHour2 = buildBedhour(
        { year: 2020, month: 1, date: 27, hours: 20, minutes: 23, seconds: 7 },
        { hours: 6, minutes: 1, seconds: 46 },
        1
      )
      const bedHour3 = buildBedhour(
        { year: 2020, month: 2, date: 27, hours: 20, minutes: 23, seconds: 7 },
        { hours: 6, minutes: 1, seconds: 46 },
        1
      )

      await insert(bedHour1)
      await insert(bedHour2)
      await insert(bedHour3)

      const startDate = '2-24-2020'.split('-')
      const endDate = '2-28-2020'.split('-')

      expect(
        await find(
          new Date(
            Number(startDate[2]),
            Number(startDate[0]) - 1,
            Number(startDate[1])
          ),
          new Date(
            Number(endDate[2]),
            Number(endDate[0]) - 1,
            Number(endDate[1])
          )
        )
      ).toEqual([
        {
          id: 1,
          waketime: bedHour1.waketime,
          bedtime: bedHour1.bedtime,
          userId: bedHour1.userId,
        },
        {
          id: 2,
          waketime: bedHour2.waketime,
          bedtime: bedHour2.bedtime,
          userId: bedHour2.userId,
        },
      ])
    })
  })

  describe('findById', () => {
    it('should return 1 set of bed and wake times with the matching id', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )
      const bedHour2 = buildBedhour(
        { year: 2020, month: 1, date: 27, hours: 20, minutes: 23, seconds: 7 },
        { hours: 6, minutes: 1, seconds: 46 },
        1
      )
      const bedHour3 = buildBedhour(
        { year: 2020, month: 2, date: 27, hours: 20, minutes: 23, seconds: 7 },
        { hours: 6, minutes: 1, seconds: 46 },
        1
      )

      await insert(bedHour1)
      await insert(bedHour2)
      await insert(bedHour3)

      expect(await findById(2)).toEqual({
        id: 2,
        waketime: bedHour2.waketime,
        bedtime: bedHour2.bedtime,
        userId: bedHour2.userId,
      })
    })
  })

  describe('insert', () => {
    it('should insert a new wake and bed time', async () => {
      const bedHour1 = buildBedhour(
        { year: 2019, month: 2, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      expect(await insert(bedHour1)).toEqual([
        {
          id: 1,
          waketime: bedHour1.waketime,
          bedtime: bedHour1.bedtime,
          userId: bedHour1.userId,
        },
      ])
    })
  })

  describe('update', () => {
    it('should update a set of wake and bed times and return the update', async () => {
      const bedHour1 = buildBedhour(
        { year: 2019, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      expect(await insert(bedHour1)).toEqual([
        {
          id: 1,
          waketime: bedHour1.waketime,
          bedtime: bedHour1.bedtime,
          userId: bedHour1.userId,
        },
      ])

      const bedHourToUpdate = buildBedhour(
        { year: 2019, month: 2, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      expect(await update(1, bedHourToUpdate)).toEqual([
        {
          id: 1,
          waketime: bedHourToUpdate.waketime,
          bedtime: bedHourToUpdate.bedtime,
          userId: bedHourToUpdate.userId,
        },
      ])
    })
  })

  describe('remove', () => {
    it('should delete a bed and wake time from the database', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )
      const bedHour2 = buildBedhour(
        { year: 2020, month: 1, date: 27, hours: 20, minutes: 23, seconds: 7 },
        { hours: 6, minutes: 1, seconds: 46 },
        1
      )
      const bedHour3 = buildBedhour(
        { year: 2020, month: 2, date: 28, hours: 20, minutes: 23, seconds: 7 },
        { hours: 6, minutes: 1, seconds: 46 },
        1
      )

      await insert(bedHour1)
      await insert(bedHour2)
      await insert(bedHour3)

      expect(await remove(2)).toEqual(1)
      expect(await findById(2)).toBeUndefined()
    })
  })
})
