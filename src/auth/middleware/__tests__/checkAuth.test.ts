import checkAuth from '../checkAuth'

describe('checkAuth', () => {
  it('should call next if the request has a decodedJwt', () => {
    const req = {
      headers: {
        authorization: 'token',
      },
      decodedJwt: {
        subject: 1,
        username: 'Wes',
        iat: 2,
        exp: 4,
      },
    }
    const res = {
      json: jest.fn(() => res),
      status: jest.fn(() => res),
    }
    const next = jest.fn()

    checkAuth(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
