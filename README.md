# Turno Café

Cuaderno digital para organizar trabajos de tostaduría: recepción del café, instrucciones de cada cliente, servicios, empaque y retiro.

Prototipo en desarrollo. [Abrir Turno Café](https://turno-cafe-tostaduria.weedyyew.chatgpt.site). El sitio mantiene acceso privado y requiere una cuenta autorizada; el código de este repositorio es público.

## Abrir localmente

Requisitos: Node.js 18 o superior para las pruebas y Python 3 para el servidor local.

```sh
git clone https://github.com/jokasta934/turnocafe.git
cd turnocafe
npm run dev
```

Desde esta carpeta, ejecutar `npm run dev` y abrir http://127.0.0.1:4178. No requiere instalar dependencias. `npm run check` valida sintaxis y lógica de estados y exportación.

## Incluye

- Registro manual y dictado por la API de reconocimiento de voz del navegador, con revisión y confirmación obligatoria. El dictado se añade a instrucciones; cliente, peso, servicios, empaque y retiro se revisan en campos explícitos.
- Número de pedido, peso total recibido obligatorio, selección de varios servicios, tipo de tueste, molienda, catálogo de fundas y gramos por funda (200, 250, 400 y 1000 g, o un peso personalizado), instrucciones y fecha/hora de retiro.
- Pendiente → listo para retirar → entregado. Pesaje final, cálculo de precios y cobros se realizan fuera de este prototipo.
- Búsqueda, filtros, edición, historial y exportación CSV de todos los registros.
- Modo televisor adaptable, alertas visuales con la página abierta y actualización entre pestañas del mismo navegador/origen.
- Pedidos de ejemplo separados de los datos reales; el ejemplo no se guarda.

## Límites de la prueba

Los datos se guardan en localStorage. No hay servidor central, usuarios, sincronización entre dispositivos ni conexión a WhatsApp. No usar como único registro de producción: exportar respaldos y mantener el cuaderno durante la prueba. Las notificaciones no se ejecutan con la página cerrada. El reconocimiento de voz requiere navegador compatible, micrófono y posiblemente conexión al servicio de voz del navegador. Probar la precisión en la fábrica antes de escoger dispositivos. Aún no existe integración con botones físicos o auriculares.

La siguiente fase requiere almacenamiento central con acceso por trabajador, identificación de dispositivos, recuperación ante desconexión y pruebas de voz con ruido real.

## Estructura

- `dist/index.html`: pantallas y formulario de pedidos.
- `dist/style.css`: diseño adaptable y modo televisor.
- `dist/app.js`: interacción, dictado, guardado y flujo de trabajo.
- `dist/domain.js`: validación, estados y exportación CSV.
- `tests/domain.test.js`: pruebas de datos y reglas del cuaderno.

Los registros que se introducen en el navegador no forman parte del repositorio. Los pedidos incluidos en el modo de ejemplo son ficticios.
