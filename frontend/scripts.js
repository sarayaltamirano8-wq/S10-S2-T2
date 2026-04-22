console.log("Script cargado correctamente");

const URL_API = 'http://localhost:3000/producto';


document.getElementById('btnGuardar').onclick = async function() {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;


    if(!nombre || !precio || !stock) {
        return alert("Por favor, llena todos los campos");
    }

    const nuevoProducto = { nombre, precio, stock };

    try {
        const respuesta = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });

        if (respuesta.ok) {
            alert("¡Producto guardado!");
            location.reload();
        } else {
            alert("Error al guardar en el servidor");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor. ¿Está encendido?");
    }
};

async function eliminar(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        try {
            const res = await fetch(`${URL_API}/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert("Producto eliminado correctamente");
                cargarTabla();
            } else {
                alert("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor");
        }
    }
}

async function editar(id) {

    const nuevoNombre = prompt("Nuevo nombre del producto:");
    const nuevoPrecio = prompt("Nuevo precio:");
    const nuevoStock = prompt("Nuevo stock:");

    if (!nuevoNombre || !nuevoPrecio || !nuevoStock) return;

    const datosEditados = {
        nombre: nuevoNombre,
        precio: parseFloat(nuevoPrecio),
        stock: parseInt(nuevoStock)
    };

    try {
        const res = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEditados)
        });

        if (res.ok) {
            alert("Producto actualizado correctamente");
            cargarTabla();
        }
    } catch (error) {
        alert("Error al intentar editar");
    }
}

async function cargarTabla() {
    try {
        const res = await fetch(URL_API);
        const datos = await res.json();
        const tabla = document.getElementById('tablaProductos');
        tabla.innerHTML = '';

        datos.forEach(p => {
            tabla.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.precio.toFixed(2)}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button class="btn-edit" onclick="editar(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="eliminar(${p.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.log("Error cargando tabla:", e);
    }
}


cargarTabla();