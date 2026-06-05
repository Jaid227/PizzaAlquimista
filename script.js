// === Objeto para almacenar cantidades de cada pizza ===
let cantidades = {
    'Hawaiana': 0,
    'Peperoni': 0,
    'Méxicana': 0,
    'Pastor': 0
};

// Precios de cada pizza
const precios = {
    'Hawaiana': 120,
    'Peperoni': 120,
    'Méxicana': 120,
    'Pastor': 120
};

// Elementos DOM
const continuarBtn = document.getElementById('continuarBtn');
const resumenModal = document.getElementById('resumenModal');
const datosEnvioModal = document.getElementById('datosEnvioModal');
const listaResumenPedido = document.getElementById('listaResumenPedido');
const totalResumenSpan = document.getElementById('totalResumen');
const confirmarPedidoBtn = document.getElementById('confirmarPedidoBtn');
const seguirEditandoBtn = document.getElementById('seguirEditandoBtn');
const enviarWhatsappBtn = document.getElementById('enviarWhatsappBtn');
const themeToggle = document.getElementById('themeToggle');

// Campos del formulario (ahora incluye nombre)
const nombreInput = document.getElementById('nombreInput');
const direccionInput = document.getElementById('direccionInput');
const referenciaInput = document.getElementById('referenciaInput');

// === FUNCIÓN: Actualizar visualización de cantidades en la UI ===
function actualizarCantidadUI(pizza, nuevaCantidad) {
    const spanCantidad = document.getElementById(`cant-${pizza}`);
    if (spanCantidad) {
        spanCantidad.textContent = nuevaCantidad;
    }
}

// === FUNCIÓN: Agregar listeners a botones + y - ===
function inicializarBotonesCantidad() {
    // Botones de aumentar (+)
    document.querySelectorAll('.btn-cantidad.mas').forEach(btn => {
        btn.removeEventListener('click', handleMas);
        btn.addEventListener('click', handleMas);
    });
    
    // Botones de disminuir (-)
    document.querySelectorAll('.btn-cantidad.menos').forEach(btn => {
        btn.removeEventListener('click', handleMenos);
        btn.addEventListener('click', handleMenos);
    });
}

function handleMas(e) {
    const pizza = e.currentTarget.getAttribute('data-pizza');
    if (pizza && cantidades.hasOwnProperty(pizza)) {
        cantidades[pizza]++;
        actualizarCantidadUI(pizza, cantidades[pizza]);
    }
}

function handleMenos(e) {
    const pizza = e.currentTarget.getAttribute('data-pizza');
    if (pizza && cantidades.hasOwnProperty(pizza) && cantidades[pizza] > 0) {
        cantidades[pizza]--;
        actualizarCantidadUI(pizza, cantidades[pizza]);
    }
}

// === FUNCIÓN: Obtener pedido actual (filtra pizzas con cantidad > 0) ===
function obtenerPedidoActual() {
    let pedido = [];
    for (let pizza in cantidades) {
        if (cantidades[pizza] > 0) {
            pedido.push({
                nombre: pizza,
                cantidad: cantidades[pizza],
                precio: precios[pizza],
                subtotal: cantidades[pizza] * precios[pizza]
            });
        }
    }
    return pedido;
}

// === FUNCIÓN: Calcular total del pedido ===
function calcularTotalPedido() {
    let total = 0;
    for (let pizza in cantidades) {
        total += cantidades[pizza] * precios[pizza];
    }
    return total;
}

// === FUNCIÓN: Mostrar resumen del pedido en el modal ===
function mostrarResumenPedido() {
    const pedido = obtenerPedidoActual();
    
    if (pedido.length === 0) {
        listaResumenPedido.innerHTML = '<p class="vacio" style="text-align:center;">🍕 No has seleccionado ninguna pizza</p>';
        totalResumenSpan.innerText = '$0';
        return;
    }
    
    let html = '<ul style="list-style:none; padding-left:0;">';
    pedido.forEach(item => {
        html += `<li>
                    <span>🍕 ${item.nombre} x ${item.cantidad}</span>
                    <span>$${item.subtotal}</span>
                 </li>`;
    });
    html += '</ul>';
    listaResumenPedido.innerHTML = html;
    totalResumenSpan.innerText = `$${calcularTotalPedido()}`;
}

// === FUNCIÓN: Validar que todos los campos del cliente estén llenos ===
function validarDatosCliente() {
    const nombre = nombreInput.value.trim();
    const direccion = direccionInput.value.trim();
    const referencia = referenciaInput.value.trim();
    
    if (nombre === "") {
        alert("⚠️ Por favor ingresa tu NOMBRE completo (es obligatorio).");
        nombreInput.focus();
        return false;
    }
    
    if (direccion === "") {
        alert("⚠️ Por favor ingresa tu DIRECCIÓN completa (es obligatorio).");
        direccionInput.focus();
        return false;
    }
    
    if (referencia === "") {
        alert("⚠️ Por favor ingresa una REFERENCIA de tu domicilio (es obligatorio).");
        referenciaInput.focus();
        return false;
    }
    
    return true;
}

// === FUNCIÓN: Enviar pedido por WhatsApp ===
function enviarPedidoWhatsApp() {
    // Validar que todos los datos estén llenos
    if (!validarDatosCliente()) {
        return;
    }
    
    const pedido = obtenerPedidoActual();
    if (pedido.length === 0) {
        alert("⚠️ No has seleccionado ninguna pizza.");
        return;
    }
    
    const nombre = nombreInput.value.trim();
    const direccion = direccionInput.value.trim();
    const referencia = referenciaInput.value.trim();
    
    // Construir mensaje con todos los datos
    let mensaje = "🍕 *PEDIDO PIZZA ALQUIMISTA* 🍕\n\n";
    mensaje += `👤 *Cliente:* ${nombre}\n\n`;
    mensaje += "*Detalle del pedido:*\n";
    
    pedido.forEach((item, idx) => {
        mensaje += `${idx+1}. ${item.nombre} x ${item.cantidad} = $${item.subtotal}\n`;
    });
    
    mensaje += `\n💰 *Total:* $${calcularTotalPedido()}\n`;
    mensaje += `\n📍 *Dirección:* ${direccion}\n`;
    mensaje += `📌 *Referencia:* ${referencia}\n`;
        
    // Codificar y enviar
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = "525662603851"; // 52 (México) + 5662603851
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    
    // Reiniciar cantidades y limpiar campos
    for (let pizza in cantidades) {
        cantidades[pizza] = 0;
        actualizarCantidadUI(pizza, 0);
    }
    
    nombreInput.value = "";
    direccionInput.value = "";
    referenciaInput.value = "";
    datosEnvioModal.style.display = "none";
    resumenModal.style.display = "none";
    
    alert("✅ Pedido enviado por WhatsApp. Serás redirigido para confirmar.");
}

// === EVENTOS ===
continuarBtn.addEventListener('click', () => {
    const pedido = obtenerPedidoActual();
    if (pedido.length === 0) {
        alert("⚠️ Selecciona al menos una pizza antes de continuar.");
        return;
    }
    mostrarResumenPedido();
    resumenModal.style.display = 'flex';
});

confirmarPedidoBtn.addEventListener('click', () => {
    resumenModal.style.display = 'none';
    datosEnvioModal.style.display = 'flex';
});

seguirEditandoBtn.addEventListener('click', () => {
    resumenModal.style.display = 'none';
});

enviarWhatsappBtn.addEventListener('click', enviarPedidoWhatsApp);

// Cerrar modales
document.querySelectorAll('.close-resumen, .close-envio').forEach(btn => {
    btn.addEventListener('click', function() {
        resumenModal.style.display = 'none';
        datosEnvioModal.style.display = 'none';
    });
});

// Clic fuera del modal
window.addEventListener('click', (e) => {
    if (e.target === resumenModal) resumenModal.style.display = 'none';
    if (e.target === datosEnvioModal) datosEnvioModal.style.display = 'none';
});

// === MODO NOCTURNO/CLARO ===
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// === INICIALIZAR ===
inicializarBotonesCantidad();