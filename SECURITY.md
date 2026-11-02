# Seguridad de Turno Café

## Alcance actual

Este es un prototipo privado con una capa de servidor que solo sirve archivos. Los pedidos se guardan exclusivamente en el navegador. El servidor rechaza métodos distintos de GET y HEAD con 405 y solo permite rutas explícitas. No hay API de pedidos, base de datos de servidor, formularios de contacto públicos, cuentas propias, contraseñas propias ni cookies creadas por la aplicación. La autenticación y sus cookies pertenecen al proveedor de alojamiento y se mantienen bajo su control. Un repositorio público no vuelve público el sitio privado ni los pedidos guardados en un navegador.

## Controles aplicados

- Los datos variables se muestran mediante elementos DOM y `textContent`. No se interpretan nombres, instrucciones, dictados o registros guardados como HTML.
- La política CSP en el documento limita scripts y estilos al mismo origen, bloquea código en línea, evaluación dinámica, objetos incrustados, conexiones de JavaScript y envíos de formularios de red. Las fuentes son locales al sistema: no se descargan recursos de terceros.
- `dist/_headers` define CSP, protección contra incrustación en marcos, HSTS, `nosniff`, política de referente y restricciones de funciones. El servidor los añade explícitamente a las respuestas de archivos, errores y métodos rechazados; su presencia se comprueba también tras publicar. La CSP del documento funciona como protección adicional.
- Los registros se validan antes de cargar, guardar o recibir cambios de otra pestaña: tipos, tamaños, servicios permitidos, identificadores únicos, fechas, estados, peso y gramajes. Se rechazan claves de prototipo, registros duplicados y almacenamiento malformado o excesivo. Capacidad local: 2000 pedidos y 3 MB de JSON.
- La confirmación impide guardados reentrantes; una edición abierta no sobrescribe silenciosamente un cambio recibido desde otra pestaña. El almacenamiento local no proporciona transacciones entre dispositivos.
- Las exportaciones CSV neutralizan celdas que comienzan con operadores de fórmulas, incluso precedidos de espacios o saltos.
- No se incluyen claves de API en el cliente. Archivos de entorno, claves privadas y configuración local del alojamiento están excluidos del repositorio público. El control automatizado revisa formatos de secretos conocidos en archivos y en el historial Git; no detecta todos los formatos posibles.
- No hay paquetes de aplicación de terceros. El lockfile hace reproducible la instalación. CI usa Node.js 24 LTS, acciones fijadas por SHA, permisos de solo lectura, pruebas, búsqueda de secretos y auditoría npm. Dependabot propone revisiones de paquetes y acciones semanalmente.

## Comprobaciones locales

```sh
npm ci --ignore-scripts
npm run check
npm run security
npm audit --audit-level=low
```

Las pruebas no constituyen una certificación de ausencia de vulnerabilidades. Antes de un lanzamiento de producción con varios usuarios debe hacerse una revisión independiente del sistema completo.

## HTTPS, contraseñas y sesiones

El dominio publicado usa HTTPS y un certificado cuya cadena se verificó con la biblioteca TLS del sistema. La renovación del certificado es responsabilidad del alojamiento. La aplicación no gestiona certificados, contraseñas ni cookies de autenticación propias, por lo que no puede auditar internamente cómo el proveedor guarda contraseñas. La cookie de protección del proveedor observada tenía `Secure`, `HttpOnly` y `SameSite`; esto no equivale a una auditoría de todas sus cookies de sesión.

Si en el futuro se incorporan contraseñas propias, se debe usar un proveedor de identidad adecuado o un hash adaptativo con sal, como Argon2id; no cifrado reversible ni claves incorporadas en el navegador. Las sesiones deben validarse y revocarse en servidor, con expiración, rotación y cookies `Secure`, `HttpOnly` y `SameSite` acordes al flujo. Evitar tokens de sesión en localStorage.

## Antes de conectar dispositivos o abrir una API

La versión actual no tiene un punto de envío público al que hacer spam. Las validaciones del navegador y el bloqueo de doble confirmación no sustituyen controles de servidor. Antes de añadir escritura remota se requieren:

- Autenticación y autorización en cada operación, roles por trabajador y aislamiento de datos.
- Validación de esquema y límites de cuerpo en servidor, consultas parametrizadas, control de frecuencia por cuenta y dispositivo e idempotencia de pedidos. Activar desafíos antiautomatización si el riesgo lo justifica.
- Protección CSRF y comprobación del origen si se usan cookies, CORS restringido y rutas con métodos explícitos.
- Secretos en el entorno del servidor, nunca en JavaScript público. Registro de auditoría sin contraseñas, tokens ni datos sensibles innecesarios.
- Respaldos, recuperación, política de conservación y revisión de amenazas, incluidas pruebas de concurrencia y abuso.

## Datos y dispositivos compartidos

localStorage no cifra los pedidos ni protege frente a personas con acceso al mismo perfil del navegador o al equipo. No almacenar contraseñas, documentos de identidad ni información sensible en este cuaderno. Conservar el cuaderno de papel y respaldos exportados durante la prueba. La voz puede procesarse en el servicio de reconocimiento del navegador y requiere permiso explícito del usuario.

## Referencias

- [OWASP: prevención de XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP: almacenamiento de contraseñas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cloudflare: encabezados de recursos estáticos](https://developers.cloudflare.com/workers/static-assets/headers/)
