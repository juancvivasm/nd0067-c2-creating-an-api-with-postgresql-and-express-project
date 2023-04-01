import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const secret = process.env.TOKEN_SECRET

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
    //console.log(`MIDDLEWARE AUTH`)
    try {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader!.split(' ')[1]
        //console.log(token)
        jwt.verify(token, secret!)
        next()
    } catch (error) {
        res.status(401)
        res.json(`Invalid token ${error}`)
    }
}

export default verifyAuthToken
