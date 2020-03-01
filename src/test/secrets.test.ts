import secrets from '../secrets'

describe('secrets', () => {
  it('should return the JWT_SECRET env variable', () => {
    expect(secrets).toEqual(process.env.JWT_SECRET)
  })
})
