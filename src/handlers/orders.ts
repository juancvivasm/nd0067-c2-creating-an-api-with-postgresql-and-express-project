import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import verifyAuthToken from '../middlewares/authentication'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index()
        res.json(orders)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const show = async (req: Request, res: Response) => {
    const order = await store.show(req.params.id)
    res.json(order)
}

const showByUserId = async (req: Request, res: Response) => {
    const orders = await store.showByUserId(req.params.id)
    res.json(orders)
}

const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id
        }

        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const addProduct = async (req: Request, res: Response) => {
    const orderId: number = Number(req.params.OrderId)
    const productId: number = Number(req.body.productId)
    const quantity: number = parseInt(req.body.quantity)
    try {
        const order = await store.show(orderId.toString())
        console.log(order)
        if(order.status !== 'active'){
            throw new Error('The order is not active')
        }

        const addedProduct = await store.addProduct(quantity, orderId, productId)
        res.json(addedProduct)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const orderComplete = async (req: Request, res: Response) => {
    try {
        const order = await store.orderComplete(req.params.id)
        res.json(order)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const order_routes = (app: express.Application) => {
    app.get('/orders', verifyAuthToken, index)
    app.get('/orders/:id', verifyAuthToken, show)
    app.get('/orders/user/:id', verifyAuthToken, showByUserId)
    app.post('/orders', verifyAuthToken, create)
    app.post('/orders/:OrderId/products', verifyAuthToken, addProduct)
    app.put('/orders/:id', verifyAuthToken, orderComplete)
}

export default order_routes
