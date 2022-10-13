export class Item{
    constructor(id, name, price, quantity){
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    getPrice(){
        return this.quantity*parseFloat(this.price);
    }

    add(quantity = 1){
        this.quantity = this.quantity + quantity;
    }

    toPrint(){
        return `<span>${this.name}</span> | x${this.quantity} | ${this.price}`;
    }
}