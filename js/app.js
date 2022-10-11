import {addShopFormAttr, launchErrorFor as showError, removeErrorFor as cleanError} from './utils.js'
import {shopMenu, addItem as addNewItem, resetPayForm} from './pay_form.js';

document.addEventListener("DOMContentLoaded", ()=>{    
    start(); // inicia todo
    resetShop(true); //resetea los formularios
});

function start(){
    let container = document.getElementById("app");
    container.append(getForm()); // añade el formulario de añadir objeto
    container.append(shopMenu()); // añade la parte de ver la lisa y comprar
}

export function getForm(){
    let form = document.createElement("form");
    // añade los elementos del formulario
    let item_name = addShopFormAttr({"name": "item_name", "id": "item_name", "type":"text", "label": "Nombre del Artículo:", "value":""});
    let item_price = addShopFormAttr({"name": "item_price", "id": "item_price", "type":"text", "label": "Precio del Artículo:", "value":""});
    let item_units = addShopFormAttr({"name": "item_units", "id": "item_units", "type":"number", "label": "Unidades:", "value":1});
    let submit_btn = addShopFormAttr({"name": "item_units", "id": "item_units", "type":"submit", "value":"Añadir al carrito", "disabled":true});

    form.id = "add_item_form";
    // añade las acciones cuando cambia el campo del formulario
    item_name.addEventListener("change", ()=>{ checkName(document.getElementById("item_name")); })
    item_price.addEventListener("change", ()=>{ checkPrice(document.getElementById("item_price")); })
    item_units.addEventListener("change", ()=>{ checkUnits(document.getElementById("item_units")); })

    form.classList.add("shopForm");
    form.classList.add("shopForm-addItem");
    
    form.append(item_name, item_price, item_units, submit_btn);

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        let new_item = {"name": null, "price":0, "units":0};
        new_item.name = document.getElementById("item_name").value;
        new_item.price = document.getElementById("item_price").value;
        new_item.price = parseFloat(new_item.price.replace("€", ""));
        new_item.units = parseInt(document.getElementById("item_units").value);
        addNewItem(new_item); //añade el elemento y ya pasa a depender del control de la parte de pay_forms.js
        resetShop(); //resetea solo el formulario de añadir un objeto nuevo a la cesta de la compra 
    });

    return form;
}

var checkName = function(element){
    let value = element.value;
        //si no tiene nombre da error
    if(value == ""){
        showError(element, "debe de introducir el artículo", "add_item_form")
    }else{
        cleanError(element, "add_item_form");
    }
}

var checkPrice = function(element){
    let value = element.value;
    // reemplazamos coma por punto por si acaso el usuario mete coma para los decimales
    value = value.replace(",", ".");
    value = value.replace("€", "");
    //si es no numerico lanzamos un error y bloqueamos la posibilidad de añadir
    if(isNaN(value)){
        showError(element, "introduzca un precio válido", "add_item_form")
    }else{
        element.value = `${value}€`;
        cleanError(element, "add_item_form");
    }
}

var checkUnits = function(element){
    let value = element.value;
        //si no tiene nombre da error
    if(parseInt(value) < 1){
        showError(element, "debe de ser mayor que cero", "add_item_form")
    }else{
        cleanError(element, "add_item_form");
    }
}

export function resetShop(all = false){
    if(all){
        resetPayForm();
    }
    document.getElementById("item_price").value = "";
    document.getElementById("item_units").value = 1;
    document.getElementById("item_name").value = "";
    document.getElementById("item_name").focus();
}

