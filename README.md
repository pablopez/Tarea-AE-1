# Tarea-AE-1
Tarea AE-1. Carrito de la compra

Un template de HTML 5 sencillo con un único div sobre el que se carga toda la renderización delos elementos que provienen del módulo app.js

La motivación para trabajar con módulos en js es para tener claros los dominios de cada parte del código. 

app.js :  se encarga de iniciar toda la lógica cuando carga la página
item_manager.js: se encarga de pintar y gestionar todos los eventos del formulario que añade items a la lista de la compra
cart_list.js: se encarga de gestionar toda la lista de la compra. Añade unidades, quita unidades, quita productos.... Elige el modo de pago...
pay_manager.js: gestiona los formularios de pago, o efectivo o tarjeta. Acaba llamando al print de la lista de la compra para acabar la ejecución en última instancia. 

No se ha usado poo. Nos hemos valido de un object para almacenar todos los items añadidos a modo de mapa. No usamos ids porque entendemos que cada nombre de cada producto es único y si se vuelve a añadir un producto con el mismo nombre, este se suma siempre y cuando sea igual en precio y nombre.

En cuanto al HTML se ha optado por la creación dinámica del código mediante javascript para tener mayor control sobre los eventos y el DOM de tal manera que el index html solo contiene un div y la llamada a los estilos css y al módulo js principal.

En cuanto al diseño se ha intentado seguir un patrón BEM para CSS. Es más comprensible y orientado un poco a mejorar la modularidad y reusabilidad de los bloques. 