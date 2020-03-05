import { add } from 'date-fns'
import { buildBedhour, buildMood } from '../../../utils/test/generate'
import db from '../../../data/dbConfig'
import { find, insert, update, findById, remove } from '../moods.model'
import { insert as insertBedhours } from '../../bedhours/bedhours.model'

beforeEach(() =>
  db.raw('TRUNCATE TABLE "bedhours", "mood" RESTART IDENTITY CASCADE')
)

describe('moods model', () => {
  describe('find', () => {
    it('should return all moods in a date range', async () => {
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

      const mood1 = buildMood(2, null, null, 1)
      const mood2 = buildMood(null, 1, null, 1)
      const mood3 = buildMood(null, null, 4, 1)
      const mood4 = buildMood(2, null, null, 2)
      const mood5 = buildMood(null, null, 3, 2)
      const mood6 = buildMood(null, null, 3, 3)
      const mood7 = buildMood(1, null, null, 3)

      await insert(mood1)
      await insert(mood2)
      await insert(mood3)
      await insert(mood4)
      await insert(mood5)
      await insert(mood6)
      await insert(mood7)

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
          wakeMood: mood1.wakeMood,
          middayMood: mood1.middayMood,
          nightMood: mood1.nightMood,
          nightId: mood1.nightId,
        },
        {
          id: 2,
          wakeMood: mood2.wakeMood,
          middayMood: mood2.middayMood,
          nightMood: mood2.nightMood,
          nightId: mood2.nightId,
        },
        {
          id: 3,
          wakeMood: mood3.wakeMood,
          middayMood: mood3.middayMood,
          nightMood: mood3.nightMood,
          nightId: mood3.nightId,
        },
        {
          id: 4,
          wakeMood: mood4.wakeMood,
          middayMood: mood4.middayMood,
          nightMood: mood4.nightMood,
          nightId: mood4.nightId,
        },
        {
          id: 5,
          wakeMood: mood5.wakeMood,
          middayMood: mood5.middayMood,
          nightMood: mood5.nightMood,
          nightId: mood5.nightId,
        },
      ])
    })
  })

  describe('findById', () => {
    it('should return 1 set of moods with the matching id', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      await insertBedhours(bedHour1)

      await insert(buildMood(2, null, null, 1))
      await insert(buildMood(null, 1, null, 1))

      expect(await findById(2)).toEqual({
        id: 2,
        wakeMood: null,
        middayMood: 1,
        nightMood: null,
        nightId: 1,
      })
    })
  })

  describe('insert', () => {
    it('should insert a new mood', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      await insertBedhours(bedHour1)

      const mood1 = buildMood(2, null, null, 1)

      expect(await insert(mood1)).toEqual([
        {
          id: 1,
          wakeMood: 2,
          middayMood: null,
          nightMood: null,
          nightId: 1,
        },
      ])
    })
  })

  describe('update', () => {
    it('should update a mood record and return the update', async () => {
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
          wakeDate: add(new Date(bedHour.wakeDate), { hours: 8 }),
          userId: bedHour.userId,
        },
      ])

      await insert(buildMood(2, null, null, 1))

      const moodToUpdate = buildMood(3, null, null, 1)

      expect(await update(moodToUpdate)).toEqual([
        {
          id: 1,
          wakeMood: moodToUpdate.wakeMood,
          middayMood: moodToUpdate.middayMood,
          nightMood: moodToUpdate.nightMood,
          nightId: moodToUpdate.nightId,
        },
      ])
    })
  })

  describe('remove', () => {
    it('should delete a mood from the database', async () => {
      const bedHour1 = buildBedhour(
        { year: 2020, month: 1, date: 26, hours: 21, minutes: 18, seconds: 27 },
        { hours: 7, minutes: 12, seconds: 38 },
        1
      )

      await insertBedhours(bedHour1)

      const mood1 = buildMood(2, null, null, 1)
      const mood2 = buildMood(null, 1, null, 1)
      const mood3 = buildMood(null, null, 4, 1)

      await insert(mood1)
      await insert(mood2)
      await insert(mood3)

      expect(await remove(2)).toEqual(1)
      expect(await findById(2)).toBeUndefined()
    })
  })
})
