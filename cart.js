import {Item} from './item.js';

class Cart{
    constructor(cart_conntainer, items = []){
        this.item_list = [];
        this.container = document.getElementById(cart_conntainer);
        this.cont = 0;
        this.total = 0;
        items.forEach(item => {
          this.addItem(item.name, item.price, item.quantity)
        });
        this.render();
        this.refreshView();
    }

    addItem(item_name, item_price, item_quantity){
        this.item_list.push(new Item(++this.cont, item_name, item_price, item_quantity));
        this.refreshView();
    }

    updatePrice(){
        let price = 0;
        this.item_list.forEach(item => {
            price += item.getPrice();
        });
        this.total = price;
    }

    getItemIndex(id){
        for (let i = 0; i < this.item_list.length; i++) {
            if(this.item_list[i].id == id)
                return i;
        }
        return null;
    }

    modifyItem(id, attr, new_value){
        let item_index = this.getItemIndex(id);
        let item = this.item_list[item_index];
        item[attr] = new_value;
        this.item_list[item_index] = item;
        this.refreshView();
    }

    removeItem(id){
        let item_index = this.getItemIndex(id);
        this.item_list.splice(item_index, 1);
        this.refreshView();
    }

    render(){
        let ticket = document.createElement("div");
        let item_list = document.createElement("div");
        let total = document.createElement("div");
        
        ticket.className = "ticket";
        item_list.className = "ticket__list";
        total.className = "ticket__total";
        ticket.append(item_list);
        ticket.append(total);
        ticket.append(this.addActions());
        this.container.append(ticket);
    }

    addActions(){
        let actions = document.createElement("div");
        actions.className = "ticket__actions";
        let print = document.createElement("button");
        let clean = document.createElement("button");
        print.innerHTML = 'imprimir';
        clean.innerHTML = 'restablecer';
        print.addEventListener("click",()=>{
            this.printTicket();
        })
        clean.addEventListener("click",()=>{
            this.item_list = [];
            this.refreshView();
        })
        actions.append(print);
        actions.append(clean);
        return actions;
    }

    printTicket(){
        let print_view = window.open("", 'PRINT', 'height=600,width=900');
        let items = "";
        this.item_list.forEach((item)=>{
            items += item.toPrint();
        })
        print_view.document.write(`
            <html>
                <head>
                </head>
                <body>
                    <div>${items}</div>
                </body>
            </html>
        `);
        print_view.document.close();
        print_view.print();
        print_view.close();

        return true;
    }

    renderItem(item){
        let item_html = document.createElement("div");
        let remove = document.createElement("button");
        let cont = document.createElement("input");
        item_html.className = "ticket__list__item";
        item_html.innerHTML = `<span>${item.name}</span>`;
        remove.innerHTML = 'borrar';
        cont.type = "number";
        cont.value = item.quantity;
        cont.addEventListener("change",()=>{
            if(cont.value < 0){
                cont.value = 0;
            }
            this.modifyItem(item.id, "quantity", cont.value);
        })
        remove.addEventListener("click",()=>{
            this.removeItem(item.id);
        })
        item_html.append(cont);
        item_html.append(remove);
        return item_html;
    }

    refreshView(){
        this.updatePrice();      
        let ticket__list = this.container.querySelector(".ticket .ticket__list");
        let total = this.container.querySelector(".ticket .ticket__total");
        ticket__list.innerHTML = "";
        total.innerHTML = "";
        total.append(`TOTAL: ${this.total}€`);
        this.item_list.forEach(item => {
            ticket__list.append(this.renderItem(item));
        });
    }
}

var cart = null;

export function loadCart(cart_container, saved_items){
    cart = new Cart(cart_container, saved_items);
}

export function addItem(item){
    cart.addItem(item.name, parseFloat(item.price), parseInt(item.units));
}