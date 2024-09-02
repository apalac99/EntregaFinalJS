// Final

class Producto {
  constructor(nombre, referencia, precio, imagen) {
    this.nombre = nombre;
    this.referencia = referencia;
    this.precio = precio;
    this.imagen = imagen;
  }
}

const productos = [];

// Cargar productos desde el archivo JSON
fetch('productos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON');
    }
    return response.json();
  })
  .then(data => {
    data.forEach(item => {
      const producto = new Producto(item.nombre, item.referencia, item.precio, item.imagen);
      productos.push(producto);
    });
    mostrarProductos();
  })
  .catch(error => console.error('Error:', error));

// Mostrar productos en el HTML
function mostrarProductos() {
  const contenedorProductos = document.getElementById('productos');

  if (!contenedorProductos) {
    console.error('Contenedor de productos no encontrado.');
    return;
  }

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const productElement = document.createElement('div');
    productElement.classList.add('producto-columna');
    productElement.innerHTML = `
      <h2>${producto.nombre}</h2>
      <img src="images/${producto.imagen}" width="100" height="100">
      <br> ${producto.referencia} <br>
      <strong>$${producto.precio}</strong> <br><br>
      <button class="button button2" onclick="agregarAlCarrito(${producto.precio}, productos[${i}])">Agregar al carrito</button>
      <div id="total${producto.referencia}" class="totalUnidades">0</div>
    `;
    contenedorProductos.appendChild(productElement);
  }
}

const botonVaciar = document.getElementById("vaciarCarritoBtn");
if (botonVaciar) {
  botonVaciar.addEventListener("click", vaciarCarrito);
}

// Función para agregar al carrito
function agregarAlCarrito(precio, producto) {
  let carrito = localStorage.getItem('carrito') ? parseInt(localStorage.getItem('carrito')) : 0;
  carrito += precio;
  localStorage.setItem('carrito', carrito);
  document.getElementById('totalCarrito').innerHTML = `Total: $${carrito}`;

  // Realizar seguimiento del número de veces que se agrega el producto
  let cantidadProducto = localStorage.getItem(`${producto.referencia}`) ? parseInt(localStorage.getItem(`${producto.referencia}`)) : 0;
  cantidadProducto++;
  localStorage.setItem(`${producto.referencia}`, cantidadProducto);
  document.getElementById(`total${producto.referencia}`).innerHTML = `${cantidadProducto}`; // cuántas se han elegido en el cuadro de producto
}

// Actualizar el total del carrito y las unidades de cada producto desde localStorage
function actualizarTotalCarrito() {
  let carrito = localStorage.getItem('carrito') ? parseInt(localStorage.getItem('carrito')) : 0;
  document.getElementById('totalCarrito').innerHTML = `Total: $${carrito}`;
  document.getElementById(`pagoCompletado`) ? document.getElementById(`pagoCompletado`).innerHTML = `` : null;

  // Actualizar las unidades de cada producto leyendo desde localStorage
  for (let i = 0; i < productos.length; i++) {
    let referencia = productos[i].referencia;
    let cantidadProducto = localStorage.getItem(referencia) ? parseInt(localStorage.getItem(referencia)) : 0;
    document.getElementById(`total${referencia}`).innerHTML = `${cantidadProducto}`;
  }
}

// Función para vaciar el carrito
function vaciarCarrito() {
  localStorage.setItem('carrito', '0');
  for (let i = 0; i < productos.length; i++) {
    let referencia = productos[i].referencia;
    localStorage.setItem(referencia, '0'); // Reiniciar contador de cada producto 
  }
  actualizarTotalCarrito(); // Actualizar el total del carrito y las unidades de cada producto
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let numeroConfirmacion = getRandomInt(99999);


const compraCompleta = document.getElementById("pagar");
  if (compraCompleta) {
    compraCompleta.addEventListener("click", confirmarCompra);
  }
  
  const compraCompleta2 = document.getElementById("Enviar");
  if (compraCompleta2) {
    compraCompleta2.addEventListener("click", validarFormulario);
  }

  // Función para validar el formulario
  function validarFormulario(event) {
    event.preventDefault();
  
    const numero = document.getElementById('numero').value;
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    let errores = false;
  
    // Validar número (que sean 7 dígitos)
    if (!/^\d{7}$/.test(numero)) {
      swal({
        text: "El campo de número de la tarjeta debe contener exactamente 7 dígitos.",
        icon: "error",
      });
      errores = true;
    }
  
    // Validar nombre
    if (nombre.trim() === '') {
      swal({
        text: "El campo de nombre no puede estar vacío.",
        icon: "error",
      });
      errores = true;
    }
  
    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      swal({
        text: "Por favor, ingresa un correo electrónico válido.",
        icon: "error",
      });
      errores = true;
    }
  
    let valorenCarro = localStorage.getItem('carrito') ? parseInt(localStorage.getItem('carrito')) : 0;
  
    if (valorenCarro > 0 && !errores) {
      swal({
        title: "Gracias por su compra",
        text: "Pagado $" + valorenCarro + " - Número de confirmación " + numeroConfirmacion,
        icon: "success",
      });
      vaciarCarrito();
    } else if (valorenCarro === 0) {
      swal({
        text: "No hay nada en el carrito de compras",
        icon: "error",
      });
    }
  
    return !errores; // Solo permitir el envío si no hay errores
  }
  


// Función para confirmar compra
function confirmarCompra() {
  let valorenCarro = localStorage.getItem('carrito') ? parseInt(localStorage.getItem('carrito')) : 0;

  if (valorenCarro > 0) {
    swal({
      title: "Gracias por su compra",
      text: "Pagado $" + valorenCarro + " - Número de confirmación " + numeroConfirmacion,
      icon: "success",
    });
    vaciarCarrito();
  } else {
    swal({
      text: "No hay nada en el carrito de compras",
      icon: "error",
    });
  }
}


window.onload = function() {
  actualizarTotalCarrito();
};
