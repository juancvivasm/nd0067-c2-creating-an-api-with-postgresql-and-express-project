import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index()
        res.json(products)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const show = async (req: Request, res: Response) => {
    const product = await store.show(req.params.id)
    res.json(product)
}

const showProductsByCategory = async (req: Request, res: Response) => {
    try {
        const products = await store.showProductsByCategory(req.params.category)
        res.json(products)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        }

        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        }

        const updatedProduct = await store.update(product)
        res.json(updatedProduct)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    res.json(deleted)
}

const product_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.get('/products/category/:category', showProductsByCategory)
    app.post('/products', create)
    app.put('/products', update)
    app.delete('/products/:id', destroy)
}

export default product_routes
