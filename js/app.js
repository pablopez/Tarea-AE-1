import {cartMenu, resetCartList} from './cart_list.js';
import {resetPayForm} from './pay_manager.js';
import {getForm, resetForm as resetItemManager} from './item_manager.js';

document.addEventListener("DOMContentLoaded", ()=>{    
    start(); // inicia todo
    resetItemManager(); //resetea el formulario de añadir producto
    resetCartList(); //resetea la lista de la compra
    resetPayForm(); //resetea el formulario de pago

});

function start(){
    let container = document.getElementById("app");
    container.append(getForm()); // añade el formulario de añadir objeto
    container.append(cartMenu()); // añade la parte de ver la lista y comprar
}