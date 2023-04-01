import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from "../../models/user"
import { Product, ProductStore } from '../../models/product'
import { Order } from '../../models/order'
import Client from "../../database"

const userStore = new UserStore()
const productStore = new ProductStore()

const request = supertest(app)

describe('Tests for order endpoints', () => {
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
    let product: Product

    let order: Order = {
        status: 'active',
        user_id: '1'
    }

    beforeAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()

        token = await userStore.create(user)
        //console.log(token)

        product = await productStore.create(product01)
        //console.log(product)
    })

    afterAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
    })

    describe('Add Order', () => {
        it('POST /orders', async () => {
            const response = await request.post('/orders')
                        .send(order)
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(response.body).toEqual({
                    id: 1,
                    status: order.status,
                    user_id: order.user_id
                })
        })
    })

    describe('Get orders', () => {
        it('GET /orders', async () => {
            const response = await request.get('/orders')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual([{
                id: 1,
                status: order.status,
                user_id: order.user_id
            }])
        })
    })

    describe('Get order by id', () => {
        it('GET /orders/:id', async () => {
            const response = await request.get('/orders/1')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual({
                id: 1,
                status: order.status,
                user_id: order.user_id
            })
        })
    })

    describe('Get orders by user id', () => {
        it('GET /orders/user/:id', async () => {
            const response = await request.get('/orders/user/1')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body).toEqual([{
                id: 1,
                status: order.status,
                user_id: order.user_id
            }])
        })
    })

    describe('Add product to order', () => {
        it('POST /orders/:OrderId/products', async () => {
            let orderId = 1
            let addProduct = {
                productId: 1,
                quantity: 1
            }

            const response = await request.post(`/orders/${orderId}/products`)
                        .send(addProduct)
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(response.body).toEqual({
                    id: 1,
                    quantity: addProduct.quantity,
                    order_id: String(orderId),
                    product_id: String(addProduct.productId)
                })
        })
    })

    describe('Order complete', () => {
        it('PUT /orders/:OrderId/products', async () => {
            let orderId = 1
            const response = await request.put(`/orders/${orderId}`)
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
                        //console.log(response)
                        //console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.type).toBe('application/json')
                expect(response.body).toEqual({
                    id: 1,
                    status: 'complete',
                    user_id: '1'
                })
        })
    })

})
