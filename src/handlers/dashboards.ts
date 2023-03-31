import express, { Request, Response } from 'express'

import { DashboardQueries } from '../services/dashboard'
import verifyAuthToken from '../middlewares/authentication'

const dashboardRoutes = (app: express.Application) => {
    app.get('/five_most_popular_products', mostPopularProducts)
    app.get('/users_order_completed', verifyAuthToken, usersOrderCompleted)
    app.get('/five_most_expensive_products', expensiveProducts)
}
//users with completed orders
const dashboard = new DashboardQueries()

const mostPopularProducts = async (_req: Request, res: Response) => {
    try {
        const products = await dashboard.mostPopularProducts()
        res.json(products)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const usersOrderCompleted = async (_req: Request, res: Response) => {
    try {
        const users = await dashboard.usersOrderCompleted()
        res.json(users)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const expensiveProducts = async (_req: Request, res: Response) => {
    try {
        const users = await dashboard.expensiveProducts()
        res.json(users)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

export default dashboardRoutes
