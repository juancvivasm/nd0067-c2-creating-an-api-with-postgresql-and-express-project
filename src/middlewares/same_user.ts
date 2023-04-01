import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const secret = process.env.TOKEN_SECRET

const verifyUser = (req: Request, res: Response, next: () => void) => {
    //console.log(`MIDDLEWARE USER`)
    try {
        const authorizationHeader = req.headers.authorization
        //console.log(authorizationHeader)
        if(authorizationHeader === undefined){
            throw new Error('Invalid token')
        }
        const token = authorizationHeader!.split(' ')[1]
        //console.log(token)
        jwt.verify(token, secret!)
        const decoded = jwt.decode(token)
        //console.log(decoded)
        const jwtUser = (<any>decoded).user
        //console.log(jwtUser);
        if(req.body.username !== jwtUser.username){
            throw new Error('User username does not match!')
        }
        next()
    } catch (error) {
        res.status(401) 
        res.json(`${error}`) 
        return
    }
}

export default verifyUser
