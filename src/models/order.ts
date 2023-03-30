import Client from '../database'

export type Order = {
    id?: Number;
    status: string;
    user_id: number;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'

            const result = await conn.query(sql)
            //console.log(result.rows[0])

            conn.release()
            return result.rows
        } catch (error) {
            throw new Error(`Cannot get orders ${error}`)
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()

            const result = await conn.query(sql, [id])
            //console.log(result.rows[0])

            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find Order ID: ${id}. Error: ${err}`)
        }
    }

    async showByUserId(userId: string): Promise<Order[]> {
        try {
            const sql = 'SELECT * FROM orders WHERE user_id=($1)'
            const conn = await Client.connect()

            const result = await conn.query(sql, [userId])
            //console.log(result.rows[0])

            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Could not find orders for user id: ${userId}. Error: ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'

            const conn = await Client.connect()

            const result = await conn
                .query(sql, [o.status, o.user_id])

            const order = result.rows[0]

            conn.release()
            return order
        } catch (err) {
            throw new Error(`Could not add new Order. Error: ${err}`)
        }
    }

    async addProduct(quantity: number, OrderId: number, productId: number): Promise<Order> {
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *'

            const conn = await Client.connect()

            const result = await conn
                .query(sql, [quantity, OrderId, productId])

            const order = result.rows[0]

            conn.release()
            return order
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${OrderId}: ${err}`)
        }
    }

    async orderComplete(id: string): Promise<Order> {
        try {
            const sql = 'UPDATE orders SET status = \'complete\'  WHERE id = $1 RETURNING *'

            const conn = await Client.connect()

            const result = await conn
                .query(sql, [id])

            const order = result.rows[0]

            conn.release()
            return order
        } catch (err) {
            throw new Error(`The order (ID: ${id}) could not be completed. Error: ${err}`)
        }
    }

}
