import supertest from 'supertest'
import app from '../../server'
import { User, UserStore } from "../../models/user"
import { Product, ProductStore } from '../../models/product'
import { Order, OrderStore } from '../../models/order'
import Client from "../../database"

const userStore = new UserStore()
const productStore = new ProductStore()
const orderStore = new OrderStore()

const request = supertest(app)

describe('Tests for Dashboard endpoints', () => {
    let user01: User = {
        firstname: 'Juan David',
        lastname: 'Vivas Navas',
        username: 'juandvivasn',
        password: '12345'
    }
    let token: string
    let users: User[]

    let product01: Product = {
        name: 'Test Product 01',
        price: 40,
        category: 'Category 01'
    }
    let product02: Product = {
        name: 'Test Product 02',
        price: 20,
        category: 'Category 01'
    }
    let product03: Product = {
        name: 'Test Product 03',
        price: 30,
        category: 'Category 02'
    }
    let products: Product[]

    let order01: Order = {
        status: 'active',
        user_id: '1'
    }

    let order02: Order = {
        status: 'active',
        user_id: '1'
    }
    let orders: Order[]

    beforeAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
       
        token = await userStore.create(user01)
        users = await userStore.index()
        //console.log(users)

        const newProduct01 = await productStore.create(product01)
        const newProduct02 = await productStore.create(product02)
        const newProduct03 = await productStore.create(product03)
        products = await productStore.index()
        //console.log(products)

        const newOrder01 = await orderStore.create(order01)
        await orderStore.addProduct(1, Number(newOrder01.id), Number(newProduct01.id))
        await orderStore.addProduct(2, Number(newOrder01.id), Number(newProduct02.id))
        await orderStore.orderComplete(String(newOrder01.id))

        const newOrder02 = await orderStore.create(order02)
        await orderStore.addProduct(3, Number(newOrder02.id), Number(newProduct03.id))

        orders = await orderStore.index()
        //console.log(orders)
    })

    afterAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
    })

    describe('Get Top 05 most popular products', () => {
        it('GET /five_most_popular_products', async () => {
            const response = await request.get('/five_most_popular_products')
                        .set('Accept', 'application/json')
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body.length).toBe(3)
            expect(response.body[0]).toEqual({
                product: product03.name,
                quantity: '3'
            })
        })
    })

    describe('Users with order completed', () => {
        it('GET /users_order_completed', async () => {
            const response = await request.get('/users_order_completed')
                        .set('Accept', 'application/json')
                        .set('Authorization', `Bearer ${token}`)
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body.length).toBe(1)
            expect(response.body[0]).toEqual({
                username: users[0].username,
                firstname: users[0].firstname,
                lastname: users[0].lastname,
                order_id: Number(orders[0].id),
                status: orders[0].status
            })
        })
    })

    describe('Top 05 most expensive products', () => {
        it('GET /five_most_expensive_products', async () => {
            const response = await request.get('/five_most_expensive_products')
                        .set('Accept', 'application/json')
            //console.log(response.body)
            expect(response.status).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body.length).toBe(3)
            expect(response.body[0]).toEqual({
                id: 1,
                name: product01.name,
                price: product01.price
            })
        })
    })

})
