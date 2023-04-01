import { User, UserStore } from "../../models/user"

const store = new UserStore()

describe("User Model", () => {
    it('should have a Create method', () => {
        expect(store.create).toBeDefined()
    })

    it('Create method should return a string (token)', async () => {
        let user: User = {
            firstname: 'Wilmarys',
            lastname: 'Navas',
            username: 'wilmarysnavas',
            password: '12345'
        }
        const result = await store.create(user)
        //console.log(result)
        expect(typeof result).toBe('string')
    })

    it('should have a Show method', () => {
        expect(store.show).toBeDefined();
    })

    it('Show method should return a object of User', async () => {
        const result = await store.show("1")
        //console.log(result)
        result.password = '12345'
        expect(result).toEqual({
            id: 1,
            firstname: 'Wilmarys',
            lastname: 'Navas',
            username: 'wilmarysnavas',
            password: '12345'
        })
    })

    it('should have an Index method', () => {
        expect(store.index).toBeDefined()
    })

    it('Index method should return a list of users', async () => {
        const result = await store.index();
        result[0].password = '12345'
        expect(result).toEqual([{
            id: 1,
            firstname: 'Wilmarys',
            lastname: 'Navas',
            username: 'wilmarysnavas',
            password: '12345'
        }])
    })

    it('should have a authenticate method', () => {
        expect(store.changePassword).toBeDefined();
    })

    it('Authentication method should return invalid username or password if the password is incorrect', async () => {
        let username: string = 'wilmarysnavas'
        let password: string = '1234567'
        const result = await store.authenticate(username, password)
        //console.log(result)
        expect(result).toEqual('Invalid username or password')
    })

    it('should have a changePassword method', () => {
        expect(store.changePassword).toBeDefined();
    })

    it('changePassword method should change a user\'s password', async () => {
        let username: string = 'wilmarysnavas'
        let password: string = '1234567'
        const result = await store.changePassword(username, password);
        //console.log(result)
        expect(typeof result).toBe('string')

        const authenticatedUser = await store.authenticate(username, password)
        //console.log(authenticatedUser)
        expect(typeof authenticatedUser).toBe('string')
    })

})
