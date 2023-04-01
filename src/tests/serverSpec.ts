import supertest from 'supertest'
import app from '../server'

const request = supertest(app)

describe('Main endpoint test', () => {
    describe('Endpoint tests', () => {
        it('GET /', async () => {
            const response = await request.get('/')
            expect(response.status).toBe(200)
            expect(response.text).toEqual('Main API route! it\'s @JC!')
        })
    })
})