import Client from '../database'

export class DashboardQueries {
  // Top 5 most popular products
  async mostPopularProducts(): Promise<{product: string, quantity: string}[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT p.name product, SUM(o.quantity) quantity FROM order_products o INNER JOIN products p ON o.product_id = p.id GROUP BY p.name ORDER BY SUM(o.quantity) DESC LIMIT 5;'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get top 5 most popular products: ${err}`)
    } 
  }

  // Users with order completed
  async usersOrderCompleted(): Promise<{username: string, firstname: string, lastname: string, order_id: number, status: string}[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT u.username, u.firstname, u.lastname, o.id order_id, o.status FROM orders o INNER JOIN users u ON o.user_id = u.id WHERE o.status = \'complete\';'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get users with order completed: ${err}`)
    } 
  }

  // Top 5 most expensive products
  async expensiveProducts(): Promise<{id: number, name: string, price: number}[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT id, name, price FROM products ORDER BY price DESC LIMIT 5'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`)
    } 
  }
}