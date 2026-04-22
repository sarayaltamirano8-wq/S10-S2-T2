const URL_API = 'http://localhost:3000/producto';

// --- FUNCIÓN PARA LEER PRODUCTOS (GET) ---
async function cargarProductos() {
    try {
        const respuesta = await fetch(URL_API);
        const productos = await respuesta.json();
        
        const tabla = document.getElementById('tablaProductos');
        tabla.innerHTML = ''; // Limpiamos la tabla

        productos.forEach(prod => {
            tabla.innerHTML += `
                <tr>
                    <td>${prod.id}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.precio.toFixed(2)}</td>
                    <td>${prod.stock}</td>
                    <td>
                        <button class="btn-edit" onclick="editar(${prod.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="eliminar(${prod.id})"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

// --- FUNCIÓN PARA GUARDAR PRODUCTO (POST) ---
document.getElementById('btnGuardar').addEventListener('click', async () => {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    const nuevoProducto = { nombre, precio, stock };

    try {
        const respuesta = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });

        if (respuesta.ok) {
            alert("Producto guardado con éxito");
            cargarProductos(); // Recargamos la tabla
            // Limpiar inputs
            document.getElementById('nombre').value = '';
            document.getElementById('precio').value = '';
            document.getElementById('stock').value = '';
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// --- FUNCIÓN PARA ELIMINAR (DELETE) ---
async function eliminar(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
        await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
        cargarProductos();
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// Cargar la tabla apenas abra la página
cargarProductos();