import { Product, ProductStore } from "../../models/product"

const store = new ProductStore()

describe("Product Model", () => {
    it('should have a Create method', () => {
        expect(store.create).toBeDefined()
    })

    it('Create method should return a new object of Product', async () => {
        let product: Product = {
            name: 'Test Product 01',
            price: 10,
            category: 'Category 01'
        }
        const result = await store.create(product)
        expect(result).toEqual({
            id: 1,
            name: product.name,
            price: product.price,
            category: product.category
        })
    })

    it('should have a Update method', () => {
        expect(store.update).toBeDefined();
    })

    it('Update method should return a updated object of Product', async () => {
        let product: Product = {
            id: 1,
            name: 'Test Product 01',
            price: 11,
            category: 'Category 02'
        }
        const result = await store.update(product);
        //console.log(result)
        expect(result).toEqual({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category
        })
    })

    it('should have an Index method', () => {
        expect(store.index).toBeDefined()
    })

    it('Index method should return a list of products', async () => {
        const result = await store.index()
        expect(result).toEqual([{
            id: 1,
            name: 'Test Product 01',
            price: 11,
            category: 'Category 02'
        }])
    })

    it('should have a Show method', () => {
        expect(store.show).toBeDefined();
    })

    it('Show method should return a object of Product', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            name: 'Test Product 01',
            price: 11,
            category: 'Category 02'
        })
    })

    it('should have an showProductsByCategory method', () => {
        expect(store.showProductsByCategory).toBeDefined();
    })

    it('showProductsByCategory method should return a list of products by category', async () => {
        const result = await store.showProductsByCategory('Category 02');
        expect(result).toEqual([{
            id: 1,
            name: 'Test Product 01',
            price: 11,
            category: 'Category 02'
        }]);
    })

    it('should have a Delete method', () => {
        expect(store.delete).toBeDefined();
    })

    it('Delete method should remove a product', async () => {
        let product_id = "1";
        store.delete(product_id);
        const result = await store.show(product_id)
        expect(result).toBeNull;
    })

})
