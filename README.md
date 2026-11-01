# Turno Café

Prototipo independiente del proyecto NutriPeques. Cuaderno digital para trabajos de tostaduría.

## Abrir localmente

Desde esta carpeta, ejecutar `npm run dev` y abrir http://127.0.0.1:4178. No requiere instalar dependencias. `npm run check` valida sintaxis y lógica de estados y exportación.

## Incluye

- Registro manual y dictado por la API de reconocimiento de voz del navegador, con revisión y confirmación obligatoria. El dictado se añade a instrucciones y sugiere servicio; cliente, kilos y retiro se revisan en campos explícitos.
- Número de pedido, kilos recibidos opcionales, instrucciones y fecha/hora de retiro.
- Pendiente → listo para pesar → entregado. Pesaje final, cálculo de precios y cobros se realizan fuera de este prototipo.
- Búsqueda, filtros, edición, historial y exportación CSV de todos los registros.
- Modo televisor adaptable, alertas visuales con la página abierta y actualización entre pestañas del mismo navegador/origen.
- Pedidos de ejemplo separados de los datos reales; el ejemplo no se guarda.

## Límites de la prueba

Los datos se guardan en localStorage. No hay servidor central, usuarios, sincronización entre dispositivos ni conexión a WhatsApp. No usar como único registro de producción: exportar respaldos y mantener el cuaderno durante la prueba. Las notificaciones no se ejecutan con la página cerrada. El reconocimiento de voz requiere navegador compatible, micrófono y posiblemente conexión al servicio de voz del navegador. Probar la precisión en la fábrica antes de escoger dispositivos. Aún no existe integración con botones físicos o auriculares.

La siguiente fase requiere almacenamiento central con acceso por trabajador, identificación de dispositivos, recuperación ante desconexión y pruebas de voz con ruido real.
