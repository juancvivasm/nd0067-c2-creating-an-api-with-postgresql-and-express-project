import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    ENV
} = process.env

let client: Pool = new Pool()
console.log(ENV)

if (ENV?.toString().trim() === 'test') {
    console.log('Inicio con credenciales de TEST')
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_TEST_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: Number(POSTGRES_PORT)
    })
}

if (ENV?.toString().trim() === 'dev') {
    console.log('Inicio con credenciales de DEV')
    client = new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: Number(POSTGRES_PORT)
    })
}

export default client
