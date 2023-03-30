import Client from '../database'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const pepper = process.env.BCRYPT_PASSWORD
const saltRounds = process.env.SALT_ROUNDS
const secret = process.env.TOKEN_SECRET

export type User = {
    id?: Number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users'

            const result = await conn.query(sql)
            //console.log(result.rows[0])

            conn.release()
            return result.rows
        } catch (error) {
            throw new Error(`Cannot get users ${error}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)'
            const conn = await Client.connect()

            const result = await conn.query(sql, [id])
            //console.log(result.rows[0])

            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find User ID: ${id}. Error: ${err}`)
        }
    }

    async create(u: User): Promise<string> {
        try {
            // @ts-ignore
            const conn = await Client.connect()

            // Check if username exists
            const usersql = 'SELECT * FROM users WHERE username = $1'

            const userresult = await conn.query(usersql, [u.username])

            const user = userresult.rows[0]

            console.log(user)
            
            if (user) {
                throw new Error(`because it already exists`)
            }

            // If not add the user
            const sql = 'INSERT INTO users (username, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *'

            const hash = bcrypt.hashSync(
                u.password + pepper,
                parseInt(saltRounds!)
            );

            const result = await conn.query(sql, [u.username, u.firstname, u.lastname, hash])
            const newUser = result.rows[0]
            console.log(newUser)
            var token = jwt.sign({ user: newUser }, secret!);

            conn.release()

            return token
        } catch (err) {
            throw new Error(`unable create user (${u.username}): ${err}`)
        }
    }

    async changePassword(username: string, password: string): Promise<string> {
        try {
            // @ts-ignore
            const conn = await Client.connect()
            const sql = 'UPDATE users SET password = $2 WHERE username = $1 RETURNING *'

            const hash = bcrypt.hashSync(
                password + pepper,
                parseInt(saltRounds!)
            );

            const result = await conn.query(sql, [username, hash])
            const updatedUser = result.rows[0]
            console.log(updatedUser)
            var token = jwt.sign({ user: updatedUser }, secret!);

            conn.release()

            return token
        } catch (err) {
            throw new Error(`cannot update user (${username}): ${err}`)
        }
    }

    async authenticate(username: string, password: string): Promise<string | null> {
        const conn = await Client.connect()
        const sql = 'SELECT * FROM users WHERE username=($1)'

        const result = await conn.query(sql, [username])

        console.log(password + pepper)

        if (result.rows.length) {

            const aUser = result.rows[0]

            console.log(aUser)

            if (bcrypt.compareSync(password + pepper, aUser.password)) {
                return jwt.sign({ user: aUser }, secret!);
            }
        }

        return "Invalid username or password"
    }
}
