// ── Configuración central de la API ──────────────────────────────────────────
// Cambia BASE_URL cuando despliegues a producción
const BASE_URL = "http://localhost:8080/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Stock de materiales (packaging, decoración...) ───────────────────────────
export const stockMaterialesApi = {
  getAll: () => request("/stock-materiales"),
};

// ── Materias primas (harina, huevos...) ──────────────────────────────────────
export const materiasPrimasApi = {
  getAll: () => request("/materias-primas"),
};

// ── Productos ─────────────────────────────────────────────────────────────────
export const productosApi = {
  getAll:  ()    => request("/productos"),
  getById: (id)  => request(`/productos/${id}`),
};

// ── Procesos (pasos de elaboración por plantilla) ─────────────────────────────
export const procesosApi = {
  getAll: () => request("/procesos"),
};


export const clientesApi = {
  getAll:    ()          => request("/clientes"),
  getById:   (id)        => request(`/clientes/${id}`),
  create:    (data)      => request("/clientes", { method: "POST", body: JSON.stringify(data) }),
  update:    (id, data)  => request(`/clientes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete:    (id)        => request(`/clientes/${id}`, { method: "DELETE" }),
};

// ── Pedidos ───────────────────────────────────────────────────────────────────
export const pedidosApi = {
  getAll:    ()    => request("/pedidos"),
  getById:   (id)  => request(`/pedidos/${id}`),
};

// ── Detalle de pedidos ────────────────────────────────────────────────────────
export const detallesApi = {
  getAll:      ()    => request("/detalles-pedidos"),
  getByPedido: (id)  => request(`/detalles-pedidos/pedido/${id}`),
};