
import {addShopFormAttr, launchErrorFor as showError, removeErrorFor as cleanError} from './utils.js'
import {resetShop} from "./app.js";

var shopping_list = {};

export function shopMenu(){    
    let cart_section = document.createElement("div");
// crea una sección de lista de la compra
    let shop_list = document.createElement("div");
    //crea el area del formulario de pago
    let pay_form_cont = document.createElement("div");
    let total_price = addShopFormAttr({"name": "total_price", "id": "total_price", "type":"text", "label": "Precio total del carrito: ", "value":"0", disabled : true});
    shop_list.className = "cartList";
    shop_list.id = "cart_list";
    pay_form_cont.id = "pay_form_cont";
    cart_section.className = "cart_section";
    // añade el formulario de pago por defecto (es el de tarjeta)
    pay_form_cont.append(printFormPay(true))
    cart_section.append(shop_list, total_price,payMethodSel(), pay_form_cont);
    return cart_section;
}

export function addItem(item){
    if(shopping_list[item.name] != undefined){
        if(shopping_list[item.name].price == item.price){
            shopping_list[item.name].units = (item.units + shopping_list[item.name].units);
        }else{
            console.error("hay un error con el precio. El articulo ya está añadido")
        }       
    }else{
        shopping_list[item.name] = {"name": item.name, "units": item.units, "price": item.price};
    }
    updateCartList();
}

function updateCartList(){
    let shop_resume = document.getElementById("cart_list");
    let total_price = 0;
    shop_resume.innerHTML = "";

    Object.keys(shopping_list).forEach(item_name=>{
        shop_resume.append(getItemForCartList(shopping_list[item_name]));
        total_price += shopping_list[item_name].units * shopping_list[item_name].price;
    })

    document.getElementById("total_price").value = total_price.toFixed(2)+"€";
}

function getItemForCartList(item){
    let new_item = document.createElement("div");
    let quant =  item.units > 1? `x${item.units}` : "";
    new_item.className = "cartList__element";
    new_item.innerHTML = `<div class="cartList__element"><span>${item.name} ${quant}</span><span> | ${(item.price*item.units).toFixed(2)}€</span></div>`;
    return new_item;
}

function payMethodSel(){
    // añade la selección del método de pago con un onchange para que varie el formulario según con lo que se quiera pagar
    let method_sel = document.createElement("div");
    method_sel.className = "shopForm__attr";
    method_sel.innerHTML = `
    <label for="item_list_total">Forma de pago: </label>
    <select name="" id="pay_method_sel">
        <option name = "Tarjeta" value="card" default>tarjeta</option>
        <option name = "Efectivo" value="cash">efectivo</option>
    </select>`;
    method_sel.querySelector("#pay_method_sel").addEventListener("change",()=>{
        document.getElementById("pay_form_cont").innerHTML = "";
        switchPayMethod();
    })
    return method_sel;
}

function switchPayMethod(){
    let pay_form_cont = document.getElementById("pay_form_cont");
    let pay_method_sel = document.getElementById("pay_method_sel").value;
    pay_form_cont.innerHTML = "";
    pay_form_cont.append(printFormPay(pay_method_sel == "card"));
}

function printFormPay(with_card = true){
    // añade el formulario de pago en función de lo que se quiera pagar con las funciones respectivas de comprobación al cambio.
    let form = document.createElement("form");
    let form_actions = document.createElement("div");
    let reset_form = document.createElement("button");
    let submit_btn = document.createElement("button");

    form_actions.className = "shopForm__actions";
    form.id = "pay_form";

    if(with_card){
        let card_ccv = addShopFormAttr({"name": "card_ccv", "id": "card_ccv", "type":"text", "label": "CCV: ", "value":""});
        let card_number = addShopFormAttr({"name": "card_number", "id": "card_number", "type":"text", "label": "Número de la tarjeta: ", "value":""});
        let card_owner = addShopFormAttr({"name": "card_owner", "id": "card_owner", "type":"text", "label": "Titular de la tarjeta: ", "value":""});
        card_owner.addEventListener("change", ()=>{ checkCardName(document.getElementById("card_owner")); })
        card_number.addEventListener("change", ()=>{ checkCardNumber(document.getElementById("card_number")); })
        card_ccv.addEventListener("change", ()=>{ checkCCV(document.getElementById("card_ccv")); })

        form.append(card_owner, card_number, card_ccv);
    }else{
        let to_pay = document.getElementById("total_price").value;
        let price_in_cash = addShopFormAttr({"name": "price_in_cash", "id": "price_in_cash", "type":"text", "label": "Importe efectivo: ", "value":to_pay, "disabled":true});
        form.append(price_in_cash);
    }
    
    let conditions_accept = addShopFormAttr({"name": "conditions_accept", "id": "conditions_accept", "type":"checkbox", "label": "Acepto las condiciones de compra", "value":"true"});
    conditions_accept.addEventListener("change", ()=>{conditionAccepted()});
    form.append(conditions_accept);
    
    submit_btn.type = "submit";
    submit_btn.innerHTML = "Imprimir";
    submit_btn.disabled = true;

    reset_form.innerHTML = "Restablecer";
    reset_form.type = "button";
    reset_form.addEventListener("click", ()=>{resetShop(true);})

    form_actions.append(submit_btn);
    form_actions.append(reset_form);    

    form.classList.add("shopForm");
    form.classList.add("shopForm-addItem");

    
    form.append(form_actions);

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        printTicket();
    });

    return form;
}

var checkCardName = function(element){
    let value = element.value;

    //si no tiene nombre da error
    if(value == ""){
        showError(element, "debe de introducir el nombre", "add_item_form");
        return;
    }else{
        cleanError(element, "add_item_form");
    }
    conditionAccepted();    
}

var checkCCV = function(element){    
    let value = element.value;
    //si no son exactamente 3 números, da error  
    if(value.length != 3){            
        showError(element, "debe introducir tres numeros", "pay_form");
        return;
    }else{
        for (let i = 0; i < value.length; i++) {
            if(isNaN(value.charAt(i))){
                showError(element, "debe introducir tres numeros", "pay_form");
                return;
            }
        }
        cleanError(element, "pay_form");             
    }
    conditionAccepted();
}

var checkCardNumber = function(element){    
    let value = element.value;
    //Validaciones del número de la tarjeta
    
    if(isNaN(value) || value.length != 16){
        showError(element, "debe introducir 16 dígitos", "pay_form")
        return;
    }else{
        for (let i = 0; i < value.length; i++) {
            if(isNaN(value.charAt(i))){
                showError(element, "debe introducir un dato válido", "pay_form");
                return;
            }
        }
        cleanError(element, "pay_form");
    }
    conditionAccepted();
}

var conditionAccepted = function(){
    let checkbox = document.getElementById("conditions_accept");

    if(checkbox.checked){
        cleanError(checkbox, "pay_form");
    }else{
        showError(checkbox, "debe aceptar las condiciones de compra", "pay_form");        
    }
}

function printTicket(){
    let pay_selected = document.getElementById("pay_method_sel"); 
    let items = "";
    let total_price = 0;

    if(pay_selected.value == "card"){
        pay_selected = "Tarjeta"; 
    }else{
        pay_selected = "Efectivo";
    }

    Object.keys(shopping_list).forEach(item_name=>{
        items += `${shopping_list[item_name]["name"]} x${shopping_list[item_name]["units"]}  > ${(shopping_list[item_name]["price"]*shopping_list[item_name]["units"]).toFixed(2)}\n`;
        total_price += shopping_list[item_name].units * shopping_list[item_name].price;
    })
    items += `TOTAL: ${total_price.toFixed(2)}€` + "\r\n" + `Forma de pago: ${pay_selected}`;
    alert(items);
}

export function resetPayForm(){
    shopping_list = {};
    updateCartList();
    let pay_form_cont = document.getElementById("pay_form_cont");
    pay_form_cont.innerHTML = "";
    document.getElementById("pay_method_sel").value = "card";
    pay_form_cont.append(printFormPay(true));
}