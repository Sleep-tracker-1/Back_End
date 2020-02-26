import Validation from 'folktale/validation'

const { Success, Failure } = Validation

export const validator = <T>(
  errorString: string,
  predicate: (o: T) => boolean
): ((o: T) => T) => (o: T): T =>
  predicate(o) ? Success(o) : Failure([errorString])

export type Matcher = {
  matchWith: (cases: {
    Success: () => boolean
    Failure: () => boolean
  }) => boolean
  value: string[]
}

export const didItValidate = (validationErrors: Matcher): boolean =>
  validationErrors.matchWith({
    Success: () => true,
    Failure: () => false,
  })

export class ValidationError extends Error {
  invalidations: string[]

  constructor(message: string, invalidations: string[]) {
    super()
    this.name = 'ValidationError'
    this.message = message
    this.invalidations = invalidations
    Error.call(this, message)
    Error.captureStackTrace(this, this.constructor)
  }
}
