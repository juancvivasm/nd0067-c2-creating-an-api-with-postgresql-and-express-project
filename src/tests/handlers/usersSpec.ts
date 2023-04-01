import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from "../../models/user"
import Client from "../../database"

const request = supertest(app)
const store = new UserStore()

describe('Tests for user endpoints', () => {
    let user: User = {
        firstname: 'Juan Carlos',
        lastname: 'Vivas Martinez',
        username: 'juancvivasm',
        password: '12345'
    }
    let token: string

    beforeAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
    })

    afterAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
    })

    describe('Add a user', () => {
        it('POST /users', async () => {
            const response = await request.post('/users')
                        .send(user)
                        .set('Accept', 'application/json')
                        //console.log(response)
                        //console.log(response.body)
                token = response.body
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(typeof response.body).toBe('string')
        })
    })

    describe('Get users', () => {
        it('GET /users', async () => {
            const response = await request.get('/users')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
            response.body[0].password = '12345'
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual([{
                id: 1,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username, 
                password: user.password
            }])
        })
    })

    describe('Find a user', () => {
        it('GET /users/:id', async () => {
            const response = await request.get('/users/1')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
            response.body.password = '12345'
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual({
                id: 1,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username, 
                password: user.password
            })
        })
    })

    describe('User cannot authenticate', () => {
        it('POST /users/authenticate', async () => {
            let login = {
                username: 'juancvivasm',
                password: '12345-'
            }
            const response = await request.post('/users/authenticate')
                        .send(login)
                        .set('Accept', 'application/json')
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(response.body).toBe('Invalid username or password')
        })
    })

    describe('Authentication', () => {
        it('POST /users/authenticate', async () => {
            let login = {
                username: 'juancvivasm',
                password: '12345'
            }
            const response = await request.post('/users/authenticate')
                        .send(login)
                        .set('Accept', 'application/json')
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(typeof response.body).toBe('string')
        })
    })

    describe('Change Password', () => {
        it('PUT /users', async () => {
            let login = {
                username: 'juancvivasm',
                password: '12345'
            }
            const response = await request.put('/users')
                        .send(login)
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(typeof response.body).toBe('string')

            const authenticatedUser = await store.authenticate(login.username, login.password)
            expect(typeof authenticatedUser).toBe('string')
            expect(response.body).not.toBe('Invalid username or password')
        })
    })

})