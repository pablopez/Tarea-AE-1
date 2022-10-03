import {loadCart, addItem} from './cart.js';

export function load(saved_items = []){
    let container = document.getElementById("app");
    container.append(renderAddItem());
    console.log("loaded");
    loadCart("app", saved_items);
}

function renderAddItem(){
    let form = document.createElement("form");
    form.className = "addItem";
    form.append(addName());
    form.append(addPrice());
    form.append(addUnits());
    form.append(addItemToCart());
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        let new_item = {"name": null, "price":0, "units":0};
        Object.keys(new_item).forEach(key=>{
            new_item[key] = form.querySelector(`input[name='${key}']`).value
        })
        addItem(new_item);
    });
    return form;
}

function addItemToCart(){
    let button = document.createElement("input");
    button.innerHTML = `añadir artículo`;
    button.type = "submit";
    return button;
}

function addName(){
    let cont = document.createElement("div"); 
    let input = document.createElement("input"); 
    cont.className = "additem__name";
    input.setAttribute("name", "name");
    cont.innerHTML = `<span>nombre artículo</span>`;
    cont.append(input);
    return cont;
}

function addPrice(){
    let cont = document.createElement("div"); 
    let input = document.createElement("input"); 
    cont.className = "additem__price";
    input.setAttribute("name", "price");
    cont.innerHTML = `<span>precio del artículo</span>`;
    cont.append(input);
    return cont;
}

function addUnits(){
    let cont = document.createElement("div"); 
    let input = document.createElement("input");
    input.type = "number";
    input.setAttribute("name", "units");
    cont.className = "additem__units";    
    cont.innerHTML = `<span>unidades</span>`;
    cont.append(input);
    return cont;
}

function renderCart(){

}