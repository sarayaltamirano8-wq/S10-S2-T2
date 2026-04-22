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
                    <td>${p.precio}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button onclick="eliminar(${p.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.log("Error cargando tabla:", e);
    }
}


cargarTabla();