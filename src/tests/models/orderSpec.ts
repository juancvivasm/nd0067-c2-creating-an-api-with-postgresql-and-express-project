import Client from "../../database"
import { User, UserStore } from "../../models/user"
import { Product, ProductStore } from "../../models/product"
import { Order, OrderStore } from "../../models/order"

const userStore = new UserStore()
const productStore = new ProductStore()

const store = new OrderStore()

describe("Order Model", () => {
    let user01: User = {
        firstname: 'Juan David',
        lastname: 'Vivas Navas',
        username: 'juandvivasn',
        password: '12345'
    }
    //let user: User
    let users: User[]
    let product01: Product = {
        name: 'Test Product 01',
        price: 10,
        category: 'Category 01'
    }
    let product02: Product = {
        name: 'Test Product 02',
        price: 10,
        category: 'Category 01'
    }
    let products: Product[]

    beforeAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
       
        await userStore.create(user01)
        users = await userStore.index()
        //console.log(users)

        await productStore.create(product01)
        await productStore.create(product02)
        products = await productStore.index()
        //console.log(products)
    })

    afterAll(async function() {
        const conn = await Client.connect()
        const sql = 'TRUNCATE users, products RESTART IDENTITY CASCADE'
        await conn.query(sql)
        conn.release()
    })
    
    it('should have a Create method', () => {
        expect(store.create).toBeDefined()
    })

    it('Create method should return a new object of Order', async () => {
        let order: Order = {
            status: 'active',
            user_id: String(users[0].id)
        }
        const result = await store.create(order)
        //console.log(result)
        expect(result).toEqual({
            id: 1,
            status: order.status,
            user_id: order.user_id
        })
    })
    
    it('should have a Show method', () => {
        expect(store.show).toBeDefined()
    })

    it('Show method should return a object of Order', async () => {
        const result = await store.show("1")
        //console.log(result)
        expect(result).toEqual({
            id: 1,
            status: 'active',
            user_id: String(users[0].id)
        })
    })

    it('should have an Index method', () => {
        expect(store.index).toBeDefined()
    })

    it('Index method should return a list of orders', async () => {
        const result = await store.index()
        expect(result).toEqual([{
            id: 1,
            status: 'active',
            user_id: String(users[0].id)
        }])
    })

    it('should have an showByUserId method', () => {
        expect(store.showByUserId).toBeDefined()
    })

    it('showByUserId method should return a list of orders by user id', async () => {
        const result = await store.showByUserId(String(users[0].id))
        expect(result).toEqual([{
            id: 1,
            status: 'active',
            user_id: String(users[0].id)
        }])
    })

    it('should have a addProduct method', () => {
        expect(store.addProduct).toBeDefined()
    })

    it('addProduct method should return aggregate product', async () => {
        const quantity: number = 3
        const orderId: number = 1
        const productId: number = 1
        const result = await store.addProduct(quantity, orderId, productId)
        //console.log(result)
        expect(result).toEqual({
            id: 1,
            quantity: quantity,
            order_id: String(orderId),
            product_id: String(productId)
        })
    })

    it('should have a orderComplete method', () => {
        expect(store.orderComplete).toBeDefined();
    })

    it('Update method should return a updated object of Product', async () => {
        const result = await store.orderComplete(String(products[0].id));
        //console.log(result)
        expect(result).toEqual({
            id: 1,
            status: 'complete',
            user_id: String(users[0].id)
        })
    })

})
