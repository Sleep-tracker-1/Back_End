import knex from 'knex'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../knexfile')

const dbEnv = process.env.NODE_ENV || 'development'

export default knex(config[dbEnv])
