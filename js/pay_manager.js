import {addShopFormAttr, launchErrorFor as showError, removeErrorFor as cleanError} from './utils.js'
import {printTicket} from "./cart_list.js";
import {reset as resetApp} from './app.js';

export function payMethodSel(){
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

export function printFormPay(with_card = true){
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
    reset_form.addEventListener("click", ()=>{resetApp()})

    form_actions.append(submit_btn);
    form_actions.append(reset_form);    

    form.classList.add("shopForm");
    form.classList.add("shopForm-payItems");

    form.append(form_actions);

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        printTicket();
    });

    return form;
}

function switchPayMethod(){
    let pay_form_cont = document.getElementById("pay_form_cont");
    let pay_method_sel = document.getElementById("pay_method_sel").value;
    pay_form_cont.innerHTML = "";
    pay_form_cont.append(printFormPay(pay_method_sel == "card"));
}

var checkCardName = function(element){
    //regex que matchea todos los caracteres ASCII que detecta como letras, aunque puede haber caracteres que no lo sean
    let name = new RegExp('[A-Za-z\\u0080-\\uFFFF -]{2,}');
    let value = element.value;

    //si el nombre no concuerda con la regex, da error
    if(name.test(value) == false){
        showError(element, "debe de introducir un titular válido", "add_item_form");
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
        showError(element, "debe introducir tres números", "pay_form");
        return;
    }else{
        for (let i = 0; i < value.length; i++) {
            if(isNaN(value.charAt(i))){
                showError(element, "debe introducir tres números", "pay_form");
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

export function resetPayForm(){    
    let pay_form_cont = document.getElementById("pay_form_cont");
    pay_form_cont.innerHTML = "";
    document.getElementById("pay_method_sel").value = "card";
    pay_form_cont.append(printFormPay(true));
}