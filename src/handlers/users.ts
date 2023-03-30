import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index()
        res.json(users)
    } catch (err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const show = async (req: Request, res: Response) => {
    const user = await store.show(req.params.id)
    res.json(user)
}

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password
        }

        const newUser = await store.create(user)
        res.json(newUser)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const changePassword = async (req: Request, res: Response) => {
    try {
        const updatedUser = await store.changePassword(req.body.username, req.body.password)
        res.json(updatedUser)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const authenticate = async (req: Request, res: Response) => {
    try {
        const user = await store.authenticate(req.body.username, req.body.password)
        res.json(user)
    } catch(err) {
        res.status(400)
        res.json(`${err}`)
    }
}

const user_routes = (app: express.Application) => {
    app.get('/users', index)
    app.get('/users/:id', show)
    app.post('/users', create)
    app.put('/users', changePassword)
    app.post('/users/authenticate', authenticate)
}

export default user_routes
