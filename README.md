# 🍰 Proyecto de Gestión de Repostería

---

## 🎯 Objetivo

Aplicación pensada para facilitar la organización de una tienda de repostería. Automatiza el registro de pedidos, la gestión de clientes, productos y control de stock, sustituyendo el uso manual de calendarios y hojas de cálculo.

---

## 🏗️ Estructura del Proyecto

### 📁 Paquetes

- `modelo`: Clases del dominio (Cliente, Pedido, Producto, Stock, etc.)
- `utilidades`: Funciones de apoyo (fechas, ficheros)
- `principal`: Punto de entrada del programa (`Main.java`)

---

## 🔍 Clases Principales

- **Cliente**: Guarda los datos del cliente y sus pedidos.
- **Producto**: Representa tartas o salados con sus ingredientes.
- **Pedido**: Contiene productos, estado y fecha de entrega.
- **Ingrediente**: Define nombre y cantidad usada en cada producto.
- **ProductoPedido**: Relación entre producto y cantidad pedida.
- **Calendario**: Organiza pedidos por día.
- **GestorStock**: Controla stock de ingredientes y materiales.
- **StockItem / StockGeneral / StockIngrediente**: Abstracción del stock disponible.

---

## 🔧 Utilidades

- **GestorFicheros**: Lectura/escritura de datos en archivos planos.
- **UtilidadesFecha**: Manejo de fechas con `LocalDateTime`.

---

## 🔄 Relaciones Básicas

- Un cliente puede tener varios pedidos.
- Un pedido incluye varios productos.
- Cada producto contiene ingredientes.
- El stock está dividido entre ingredientes y elementos de presentación.

---

## 🧱 Diseño Modular

- Código organizado en capas y paquetes claros.
- Preparado para ampliarse a base de datos o interfaz gráfica.
- Lógica desacoplada del sistema de almacenamiento.

---

## 🔮 Futuro

- Persistencia con base de datos.
- Interfaz gráfica (desktop o web).
- Mejora de flujo de pedidos y gestión de alertas.
- Panel de administración multiusuario.

---

## 📄 Diagrama UML

Disponible como imagen en:  
`./doc/diagrama_uml.pdf`

---

## ✅ Estado Actual

- Estructura de clases modelada
- Diagrama UML preparado
- En fase de inicio de implementación
