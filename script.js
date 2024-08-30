

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
botonVaciar.addEventListener("click", vaciarCarrito);

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
  document.getElementById(`total${producto.referencia}`).innerHTML = `${cantidadProducto}`;    // cuantas se han elegido en el cuadro de producto
}

function actualizarTotalCarrito() {
  let carrito = localStorage.getItem('carrito') ? parseInt(localStorage.getItem('carrito')) : 0;
  document.getElementById('totalCarrito').innerHTML = `Total: $${carrito}`;
  document.getElementById(`pagoCompletado`).innerHTML = ``;

  // actualizar las unidades de cada producto
  for (let i = 0; i < productos.length; i++) {
      let referencia = productos[i].referencia;
      document.getElementById(`total${referencia}`).innerHTML = `0`;
  }
}

function vaciarCarrito() {
  localStorage.setItem('carrito', '0');
  for (let i = 0; i < productos.length; i++) {
      let referencia = productos[i].referencia;
      localStorage.setItem(referencia, '0'); // Reiniciar contador de cada prducto 
  }
  actualizarTotalCarrito(); // Actualizar el total del carrito y las unidades de cada producto
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let numeroConfirmacion = getRandomInt(99999);

const compraCompleta = document.getElementById("pagar");
compraCompleta.addEventListener("click", confirmarCompra);

function confirmarCompra() {

     let valorenCarro = localStorage.getItem('carrito') ? parseInt(localStorage.getItem('carrito')) : 0;

     if (valorenCarro > 0) {

        swal({
              title: "Gracias por su compra ",
  
              text: "Pagado $"+valorenCarro+" - Número de confirmación " +numeroConfirmacion,

              icon: "success",
             });

             vaciarCarrito()

      } else {

        swal({

              text: "No hay nada en el carrito de compras",

              icon: "error",
            });
  
      }  

  
}



window.onload = actualizarTotalCarrito();

