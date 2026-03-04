const content = document.getElementById("content");

function loadModule(module) {

    if (module === "home") {
        content.innerHTML = `
        <div class="dashboard">
            <div class="bubble-container">

                <div class="bubble big" onclick="loadModule('pedidos')">
                    🎂 Pedidos
                </div>

                <div class="bubble small top" onclick="loadModule('clientes')">
                    👥 Clientes
                </div>

                <div class="bubble small left" onclick="loadModule('productos')">
                    🥚 Productos
                </div>

                <div class="bubble small right" onclick="loadModule('recetas')">
                    📖 Recetas
                </div>

                <div class="bubble small bottom" onclick="loadModule('calendario')">
                    📅 Calendario
                </div>

            </div>
        </div>
        `;
        return;
    }

    content.innerHTML = `
        <h1>${module.toUpperCase()}</h1>
        <p>Módulo de ${module}. Contenido en desarrollo.</p>
    `;
}

// Cargar dashboard al iniciar
window.onload = () => loadModule("home");
