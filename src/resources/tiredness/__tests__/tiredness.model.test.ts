import { add } from 'date-fns'
import { buildBedhour, buildTired } from '../../../utils/test/generate'
import db from '../../../data/dbConfig'
import { insert as insertBedhours } from '../../bedhours/bedhours.model'
import { insert, find, findById, update, remove } from '../tiredness.model'

beforeEach(() =>
  db.raw('TRUNCATE TABLE "bedhours", "tiredness" RESTART IDENTITY CASCADE')
)

describe('tired model', () => {
  describe('find', () => {
    it('should return all tired ratings in a date range', async () => {
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

      await insertBedhours(bedHour1)
      await insertBedhours(bedHour2)
      await insertBedhours(bedHour3)

      const tired1 = buildTired(2, null, null, 1)
      const tired2 = buildTired(null, 1, null, 1)
      const tired3 = buildTired(null, null, 4, 1)
      const tired4 = buildTired(2, null, null, 2)
      const tired5 = buildTired(null, null, 3, 2)
      const tired6 = buildTired(null, null, 3, 3)
      const tired7 = buildTired(1, null, null, 3)

      await insert(tired1)
      await insert(tired2)
      await insert(tired3)
      await insert(tired4)
      await insert(tired5)
      await insert(tired6)
      await insert(tired7)

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
          wakeTired: tired1.wakeTired,
          middayTired: tired1.middayTired,
          nightTired: tired1.nightTired,
          nightId: tired1.nightId,
        },
        {
          id: 2,
          wakeTired: tired2.wakeTired,
          middayTired: tired2.middayTired,
          nightTired: tired2.nightTired,
          nightId: tired2.nightId,
        },
        {
          id: 3,
          wakeTired: tired3.wakeTired,
          middayTired: tired3.middayTired,
          nightTired: tired3.nightTired,
          nightId: tired3.nightId,
        },
        {
          id: 4,
          wakeTired: tired4.wakeTired,
          middayTired: tired4.middayTired,
          nightTired: tired4.nightTired,
          nightId: tired4.nightId,
        },
        {
          id: 5,
          wakeTired: tired5.wakeTired,
          middayTired: tired5.middayTired,
          nightTired: tired5.nightTired,
          nightId: tired5.nightId,
        },
      ])
    })
  })

  describe('findById', () => {
    it('should return 1 set of tiredness ratings with the matching id', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      await insertBedhours(bedHour1)

      await insert(buildTired(2, null, null, 1))
      await insert(buildTired(null, 1, null, 1))

      expect(await findById(2)).toEqual({
        id: 2,
        wakeTired: null,
        middayTired: 1,
        nightTired: null,
        nightId: 1,
      })
    })
  })

  describe('insert', () => {
    it('should insert a new tiredness rating', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      await insertBedhours(bedHour1)

      const tired1 = buildTired(2, null, null, 1)

      expect(await insert(tired1)).toEqual([
        {
          id: 1,
          wakeTired: 2,
          middayTired: null,
          nightTired: null,
          nightId: 1,
        },
      ])
    })
  })

  describe('update', () => {
    it('should update a tiredness record and return the update', async () => {
      const bedHour = buildBedhour(
        { year: 2019, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      expect(await insertBedhours(bedHour)).toEqual([
        {
          id: 1,
          bedtime: bedHour.bedtime,
          waketime: bedHour.waketime,
          userId: bedHour.userId,
        },
      ])

      await insert(buildTired(2, null, null, 1))

      const tiredToUpdate = buildTired(3, null, null, 1)

      expect(await update(tiredToUpdate)).toEqual([
        {
          id: 1,
          wakeTired: tiredToUpdate.wakeTired,
          middayTired: tiredToUpdate.middayTired,
          nightTired: tiredToUpdate.nightTired,
          nightId: tiredToUpdate.nightId,
        },
      ])
    })
  })

  describe('remove', () => {
    it('should delete a tiredness record from the database', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      await insertBedhours(bedHour1)

      const tired1 = buildTired(2, null, null, 1)
      const tired2 = buildTired(null, 1, null, 1)
      const tired3 = buildTired(null, null, 4, 1)

      await insert(tired1)
      await insert(tired2)
      await insert(tired3)

      expect(await remove(2)).toEqual(1)
      expect(await findById(2)).toBeUndefined()
    })
  })
})
