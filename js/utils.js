export function string2html(str){
   let parser = new DOMParser();
   let doc = parser.parseFromString(str, 'text/html');
   return doc.body;
}

//esta función añade elementos de dentro de formulario con su label
export function addShopFormAttr(values){
    let cont = document.createElement("div"); 
    let input = document.createElement("input");
    if(values.label != undefined){
        cont.innerHTML = `<label for="${values.id}">${values.label}</lable>`;
    }    
    cont.className = "shopForm__attr";
    input.id = values.id;
    input.value = values.value;
    input.type = values.type;
    input.setAttribute("name", values.name);
    if(values.disabled != undefined && values.disabled){
        input.disabled = true;
    }
    cont.append(input);
    return cont;
}

function openCloseForm(form_id){
    let form_inputs = document.getElementById(form_id).querySelectorAll('input');
    let disable_submit = false;

    if(document.querySelectorAll(".shopForm__attr-error").length == 0){
        for (let i = 0; i < form_inputs.length; i++) {
            if(form_inputs[i].value == "" || form_inputs[i].value == null){
                disable_submit = true;
                break;
            }       
        }
    }else{
        disable_submit = true;
    }
    
    document.getElementById(form_id).querySelectorAll('*[type="submit"]')[0].disabled = disable_submit;
}

// esta función pone un error sobre el elemento seleccionado y bloquea (o no) el formulario al que corresponde el elemento
export function launchErrorFor(element, message, form_id){
    element.classList.add("shopForm__attr-error");
    showAdvice(message, true, element);
    openCloseForm(form_id);
}

// esta función elimina el error puesto por launchErrorFor y bloquea (o no) el formulario al que corresponde el elemento
export function removeErrorFor(element, form_id){
    element.classList.remove("shopForm__attr-error");
    removeAdvice(element);
    openCloseForm(form_id);
}
//borra el mensaje de error puesto por showAdvice
function removeAdvice(element){
    let exist_error = document.getElementById(`error_for_${element.id}`);
    if(exist_error != null)
        exist_error.remove();
}

//muestra un mensaje de error sobre un elemento
function showAdvice(advice, is_error, element){
    let exist_el = document.getElementById(`error_for_${element.id}`);
    if(exist_el != null){
        exist_el.innerHTML = `<span>${advice}</span>`;
    }else{
        let sev_class = is_error? "appAdvice-error" : "appAdvice-log";
        let cont = document.createElement("div");
        cont.id = `error_for_${element.id}`;
        cont.className = "appAdvice"
        cont.classList.add(sev_class);
        cont.innerHTML = `<span>${advice}</span>`;
        cont.style.left = element.offsetLeft+"px";
        cont.style.top = `${element.offsetTop + element.offsetHeight}px`;
        cont.style.width = `${element.offsetWidth}px`; 
        document.getElementById("app").append(cont);
    }    
}