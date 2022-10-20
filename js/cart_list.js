
import {addShopFormAttr, launchErrorFor as showError, removeErrorFor as cleanError} from './utils.js'
import {payMethodSel, printFormPay} from "./pay_manager.js";

var shopping_list = {};

export function cartMenu(){    
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
    let increase_act = document.createElement("div");
    let item_cont = document.createElement("div");
    let item_name = document.createElement("div");
    let units = "1 unidad";

    new_item.className = "cartList__element";
    item_name.className = "cartList__element__name";
    increase_act.className = "cartList__element__actions";
    if(item.units > 1){
        units = `${item.units} unidades`;
    } 
    item_name.innerHTML = `<span>${item.name}</span> <span>${units}</span><span>${item.price}€</span>`;
    item_cont.append(getRemoveBtn(item.name),item_name);
    increase_act.append(getIncreaseBtn(item, 1),getIncreaseBtn(item, -1));
    new_item.append(item_cont, increase_act);

    return new_item;
}

function getIncreaseBtn(item, cant){
    let itemname = item.name;
    let btn = document.createElement("button");

    btn.classList.add("cartList__element__actionbtn")
    if(cant > 0){
        btn.classList.add("cartList__element__actionbtn-increase")
    }else{
        btn.classList.add("cartList__element__actionbtn-decrease")
    }

    btn.addEventListener('click',()=>{
        Object.keys(shopping_list).forEach(item_name=>{
            if(shopping_list[item_name]["name"] == itemname){
                let new_nof_units = shopping_list[item_name]["units"] + cant;
                if(new_nof_units > 0){
                    shopping_list[item_name]["units"] = new_nof_units;
                }
                updateCartList();
                return;
            }
        })
    })
    return btn;
}

function getRemoveBtn(itemname){
    let btn = document.createElement("button");
    btn.classList.add("cartList__element__actionbtn", "cartList__element__actionbtn-remove")
    btn.addEventListener('click',()=>{
        Object.keys(shopping_list).forEach(item_name=>{
            if(shopping_list[item_name]["name"] == itemname){
                delete shopping_list[item_name];
                updateCartList();
                return;
            }
        })
    })
    return btn;
}

export function printTicket(){
    let pay_selected = document.getElementById("pay_method_sel"); 
    let items = "";
    let total_price = 0;
    //Recoger con qué metodo se ha pagado y el total para mostrarlo en el alert.

    if(pay_selected.value == "card"){
        pay_selected = "Tarjeta"; 
    }else{
        pay_selected = "Efectivo";
    }

    Object.keys(shopping_list).forEach(item_name=>{
        items += `${shopping_list[item_name]["name"]} x${shopping_list[item_name]["units"]}  > ${(shopping_list[item_name]["price"]*shopping_list[item_name]["units"]).toFixed(2)}€\n`;
        total_price += shopping_list[item_name].units * shopping_list[item_name].price;
    })
    items += `TOTAL: ${total_price.toFixed(2)}€` + "\r\n" + `Forma de pago: ${pay_selected}`;
    alert(items);
}

export function resetCartList(){
    shopping_list = {};
    updateCartList();
}