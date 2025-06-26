# 🍰 Proyecto de Gestión de Repostería

---

## 🎯 Objetivo

Este proyecto nace con la intención de cubrir las necesidades de una repostera que gestiona manualmente sus pedidos, ingredientes y stock. El objetivo es automatizar sus tareas repetitivas, ofrecer un sistema claro y cómodo, y evolucionar hasta un producto profesional con base de datos e interfaz gráfica.

---

## 🏗️ Estructura del Proyecto

### 📁 Paquetes

- `modelo`: Clases de dominio (Cliente, Pedido, Producto, Ingrediente, Stock, etc.)
- `utilidades`: Funciones auxiliares (gestión de fechas, ficheros)
- `principal`: Clase `Main` y punto de entrada del programa

---

## 🔍 Descripción de Clases

### 👤 Cliente
- `id`, `nombre`, `telefono`, `email`
- `List<Pedido> pedidos`

### 📦 Producto
- `id`, `nombre`, `descripcion`, `tipo` (Tarta, Salado, etc.)
- `int cantidadPersonas`
- `List<Ingrediente> ingredientes`

### 🧂 Ingrediente
- `nombre`, `cantidad` (ej. "200g")

### 📝 Pedido
- `id`, `Cliente cliente`
- `LocalDateTime fechaEntrega`
- `List<ProductoPedido> productos`
- `String estado` (Pendiente, En Proceso, Entregado)

### 🍰 ProductoPedido
- Asocia un producto con una cantidad determinada

### 📆 Calendario
- Organiza los pedidos por fechas de entrega

---

## 📊 Gestión de Stock

### 🧩 StockItem (abstracta)
- `nombre`, `cantidad`, `unidad`
- Base común para stock comestible y no comestible

### 📦 StockGeneral
- Hereda de `StockItem`
- Ej: cajas, platos, toppers, velas

### 🧁 StockIngrediente
- Hereda de `StockItem`
- Ej: harina, azúcar, huevos, frutas

### 🧮 GestorStock
- `List<StockGeneral>`, `List<StockIngrediente>`
- Métodos: añadir, eliminar, consultar, actualizar

---

## 🔧 Utilidades

### 💾 GestorFicheros
- Guarda y carga datos desde archivos planos

### 🕒 UtilidadesFecha
- Formateo y parsing de fechas con `LocalDateTime`

---

## 🔄 Relaciones Principales

- `Cliente` → muchos `Pedido`
- `Pedido` → varios `ProductoPedido`
- `ProductoPedido` → `Producto`
- `Producto` → varios `Ingrediente`
- `GestorStock` → gestiona stock general e ingredientes
- `Calendario` → organiza los `Pedido` por fecha

---

## 🧱 Ventajas del Diseño

- Basado en clases y herencia para evitar duplicación
- Fácilmente ampliable a base de datos y GUI
- Lógica de negocio limpia y modular
- Uso de `LocalDateTime` para gestionar pedidos y calendario

---

## 🔮 Futuros Desarrollos

- Conexión con base de datos (SQL o NoSQL)
- Interfaz gráfica de usuario (JavaFX, web o app)
- Sistema de notificaciones y alertas
- Gestión avanzada del stock (previsión, pedidos automáticos)
- Multiusuario y control de acceso

---

## 📄 Diagrama UML

Incluido en el directorio del proyecto como imagen:  
`/doc/uml_diagrama_clases.png`

---

## ✅ Estado Actual

- ✔️ Modelo de clases completo
- ✔️ Diagrama UML creado
- ✔️ Planificación a futuro
- 🔜 Comienzo de implementación del código
