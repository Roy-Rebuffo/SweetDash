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

export const stockMaterialesApi = {
  getAll: () => request("/stock-materiales"),
  getById: (id) => request(`/stock-materiales/${id}`),
  create: (data) => request("/stock-materiales", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/stock-materiales/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/stock-materiales/${id}`, { method: "DELETE" }).then(async r => {
    if (r.ok) return {};
    const msg = await r.text();
    throw new Error(`${r.status}: ${msg}`);
  }),
};

export const materiasPrimasApi = {
  getAll: () => request("/materias-primas"),
  getById: (id) => request(`/materias-primas/${id}`),
  create: (data) => request("/materias-primas", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/materias-primas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/materias-primas/${id}`, { method: "DELETE" }).then(async r => {
    if (r.ok) return {};
    const msg = await r.text();
    throw new Error(`${r.status}: ${msg}`);
  }),
};

export const productosApi = {
  getAll: () => request("/productos"),
  getById: (id) => request(`/productos/${id}`),
  create: (data) => request("/productos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/productos/${id}`, { method: "DELETE" }).then(r => r.ok ? {} : Promise.reject(new Error(r.statusText))),
  subirImagen: (id, archivo) => {
    const form = new FormData();
    form.append("archivo", archivo);
    return fetch(`${BASE_URL}/productos/${id}/imagen`, { method: "POST", body: form }).then(r => r.text());
  },
  vincularProducto: (idProducto, idPlantilla) =>
    fetch(`${BASE_URL}/productos/${idProducto}/plantilla/${idPlantilla}`, { method: "PUT" }).then(r => r.ok ? {} : Promise.reject(new Error(r.statusText))),
};

export const recetasApi = {
  getAll: () => request("/recetas"),
  getById: (id) => request(`/recetas/${id}`),
  getByProducto: (id) => request(`/recetas/producto/${id}`),
  create: (data) => request("/recetas", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/recetas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/recetas/${id}`, { method: "DELETE" }).then(r => r.ok ? {} : Promise.reject(new Error(r.statusText))),
};

export const clientesApi = {
  getAll: () => request("/clientes"),
  getById: (id) => request(`/clientes/${id}`),
  create: (data) => request("/clientes", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/clientes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/clientes/${id}`, { method: "DELETE" }).then(async r => {
    if (r.ok) return {};
    const msg = await r.text();
    throw new Error(`${r.status}: ${msg}`);
  }),
};

export const pedidosApi = {
  getAll: () => request("/pedidos"),
  getById: (id) => request(`/pedidos/${id}`),
  create: (data) => request("/pedidos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/pedidos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/pedidos/${id}`, { method: "DELETE" }).then(async r => {
    if (r.ok) return {};
    const msg = await r.text();
    throw new Error(`${r.status}: ${msg}`);
  }),
  getDetalles: (id) => request(`/pedidos/${id}/detalles`),
  addDetalle: (id, data) => request(`/pedidos/${id}/detalles`, { method: "POST", body: JSON.stringify(data) }),
};

export const plantillasApi = {
  getAll: () => request("/plantillas"),
  getById: (id) => request(`/plantillas/${id}`),
  create: (data) => request("/plantillas", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/plantillas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/plantillas/${id}`, { method: "DELETE" }).then(r => r.ok ? {} : Promise.reject(new Error(r.statusText))),
};

export const procesosApi = {
  getAll: () => request("/procesos"),
  getByPlantilla: (id) => request(`/procesos/plantilla/${id}`),
  create: (data) => request("/procesos", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => fetch(`${BASE_URL}/procesos/${id}`, { method: "DELETE" }).then(r => r.ok ? {} : Promise.reject(new Error(r.statusText))),
  vincularProducto: (idProducto, idPlantilla) =>
    fetch(`${BASE_URL}/productos/${idProducto}/plantilla/${idPlantilla}`, { method: "PUT" }).then(r => r.ok ? {} : Promise.reject(new Error(r.statusText))),
};

export const tareasApi = {
  getAll:           ()          => request("/tareas"),
  getByPedido:      (id)        => request(`/tareas/pedido/${id}`),
  actualizarEstado: (id, data)  => request(`/tareas/${id}/estado`, { method: "PUT", body: JSON.stringify(data) }),
  actualizarFecha:  (id, data)  => request(`/tareas/${id}/fecha`,  { method: "PUT", body: JSON.stringify(data) }),
};