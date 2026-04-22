const URL_API = 'http://localhost:3000/producto';

// Elementos del DOM
const tablaProductos = document.getElementById('tablaProductos');
const modal = document.getElementById('modalEditar');

// Inputs del modal
const editNombre = document.getElementById('editNombre');
const editPrecio = document.getElementById('editPrecio');
const editStock = document.getElementById('editStock');

let idSeleccionado = null; // Guardará el ID del producto que se está editando

// --- CARGAR TABLA ---
async function cargarTabla() {
    try {
        const res = await fetch(URL_API);
        const datos = await res.json();
        tablaProductos.innerHTML = '';

        datos.forEach(p => {
            tablaProductos.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>S/. ${p.precio.toFixed(2)}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button class="btn-edit" onclick="abrirModal(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock})">
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
        console.error("Error al cargar datos:", e);
    }
}

// --- GUARDAR NUEVO PRODUCTO ---
document.getElementById('btnGuardar').onclick = async function() {
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;

    if(!nombre || !precio || !stock) return alert("Llena todos los campos");

    const nuevo = { nombre, precio: parseFloat(precio), stock: parseInt(stock) };

    try {
        const res = await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });
        if(res.ok) {
            alert("¡Guardado!");
            location.reload();
        }
    } catch (e) { alert("Error al conectar con el servidor"); }
};

// --- LÓGICA DEL MODAL (EDITAR) ---
function abrirModal(id, nombre, precio, stock) {
    idSeleccionado = id;
    editNombre.value = nombre;
    editPrecio.value = precio;
    editStock.value = stock;
    modal.style.display = 'flex';
}

document.getElementById('btnCancelar').onclick = () => modal.style.display = 'none';

document.getElementById('btnGuardarCambios').onclick = async () => {
    const editado = {
        nombre: editNombre.value,
        precio: parseFloat(editPrecio.value),
        stock: parseInt(editStock.value)
    };

    try {
        const res = await fetch(`${URL_API}/${idSeleccionado}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editado)
        });

        if (res.ok) {
            modal.style.display = 'none';
            cargarTabla();
        }
    } catch (e) { alert("Error al editar"); }
};

// --- ELIMINAR ---
async function eliminar(id) {
    if (confirm("¿Eliminar este producto?")) {
        try {
            const res = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
            if (res.ok) cargarTabla();
        } catch (e) { alert("Error al eliminar"); }
    }
}

// Iniciar aplicación
cargarTabla();