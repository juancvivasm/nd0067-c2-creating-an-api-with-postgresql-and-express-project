import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from "../../models/user"
import { Product } from "../../models/product"
import Client from "../../database"

const request = supertest(app)
const userStore = new UserStore()

describe('Tests for product endpoints', () => {
    let user: User = {
        firstname: 'Juan Carlos',
        lastname: 'Vivas Martinez',
        username: 'juancvivasm',
        password: '12345'
    }
    let token: string

    let product01: Product = {
        name: 'Test Product 01',
        price: 10,
        category: 'Category 01'
    }

    beforeAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        const result = await conn.query(sql)
        //console.log(result)
        token = await userStore.create(user)
        //console.log(token)
    })

    afterAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        const result = await conn.query(sql)
        //console.log(result)
    })

    describe('Add a product', () => {
        it('POST /products', async () => {
            const response = await request.post('/products')
                        .send(product01)
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(response.body).toEqual({
                    id: 1,
                    name: product01.name,
                    price: product01.price,
                    category: product01.category
                })
        })
    })

    describe('Get products', () => {
        it('GET /products', async () => {
            const response = await request.get('/products')
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual([{
                id: 1,
                name: product01.name,
                price: product01.price,
                category: product01.category
            }])
        })
    })

    describe('Find a product', () => {
        it('GET /products/:id', async () => {
            const response = await request.get('/products/1')
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual({
                id: 1,
                name: product01.name,
                price: product01.price,
                category: product01.category
            })
        })
    })

    describe('Get products by category', () => {
        it('GET /products/category/:category', async () => {
            const response = await request.get('/products/category/Category 01')
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual([{
                id: 1,
                name: product01.name,
                price: product01.price,
                category: product01.category
            }])
        })
    })

    describe('Update a product', () => {
        it('PUT /products', async () => {
            let product: Product = {
                id: 1,
                name: 'Test Product 02',
                price: 20,
                category: 'Category 02'
            }

            const response = await request.put('/products')
                        .send(product)
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(response.body).toEqual({
                    id: 1,
                    name: product.name,
                    price: product.price,
                    category: product.category
                })
        })
    })

    describe('Delete a product', () => {
        it('DELETE /products/:id', async () => {
            const response = await request.delete('/products/1')
                                .set('Accept', 'application/json')
                                .set('Authorization', `Bearer ${token}`)
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toBeNull
        })
    })

})
