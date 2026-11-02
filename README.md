# Actividad: de Hardhat a un cliente web con MetaMask

La semana pasada desplegaste `MiContrato` y lo usaste desde scripts de Hardhat. Ahora vas a usar ese mismo contrato desde una página web: consultarás datos, autorizarás transacciones con MetaMask y comprobarás qué puede hacer cada cuenta.

Al terminar tendrás una blockchain local, un contrato desplegado y un cliente que modifica su estado desde el navegador. **Seguí los pasos en orden y comprobá cada resultado antes de avanzar.**

## 1. Prepará las herramientas

Necesitás una computadora con Git, Node.js 22, npm, un editor de texto y un navegador con MetaMask. Usá el navegador y las terminales en la misma computadora; este recorrido no usa MetaMask móvil.

1. Abrí una terminal.
2. Ejecutá estos comandos, uno por vez:

   ```bash
   git --version
   node --version
   npm --version
   ```

3. Comprobá que los tres respondan con una versión y que Node muestre `v22...`. Si alguno responde «comando no encontrado», instalá la herramienta desde [Git](https://git-scm.com/downloads) o [Node.js](https://nodejs.org/en/download). Para este repositorio elegí Node.js 22. Si ya usás nvm, ejecutá `nvm install 22` y luego `nvm use 22`.
4. Instalá MetaMask desde [su sitio oficial](https://metamask.io/download/) y abrí la extensión.
5. Si todavía no tenés una billetera de prácticas, completá la creación que propone MetaMask. Guardá su frase de recuperación fuera del repositorio; no la pegues en el cliente ni la incluyas en capturas.

**Usá una billetera exclusiva para esta práctica.** Las claves que muestra Hardhat son conocidas y solo sirven para esta red local. Nunca les envíes fondos reales ni las uses en Amoy. Para completar el recorrido local no necesitás comprar ETH, usar un faucet ni crear un archivo `.env`.

## 2. Descargá el proyecto e instalá sus dependencias

En la misma terminal, ejecutá una línea por vez:

```bash
git clone https://github.com/utn-blockchain-5k3/client_ethereum_solidity.git
cd client_ethereum_solidity
npm ci
```

- `git clone` descarga el proyecto y crea la carpeta `client_ethereum_solidity` dentro de tu carpeta actual.
- `cd` entra en esa carpeta.
- `npm ci` instala las versiones guardadas en `package-lock.json`.

Si ya tenés el repositorio descargado, entrá en su carpeta y ejecutá `npm ci`; no lo clones dentro de sí mismo. Si tenés cambios propios, conservalos antes de actualizarlo.

**Comprobación:** abrí esa carpeta en tu editor. En su raíz deben aparecer `package.json`, `hardhat.config.js`, `index.html` y las carpetas `contracts`, `scripts`, `src` y `test`.

## 3. Probá el contrato antes de abrir el cliente

En la terminal anterior, ejecutá:

```bash
npm test
```

El comando compila Solidity y ejecuta las pruebas en una blockchain temporal. En la primera ejecución puede descargar el compilador: necesitás conexión a Internet.

**Resultado esperado:** `16 passing`. Si aparece un error o una prueba falla, resolvelo con la sección de problemas antes de continuar.

Esta red temporal termina al finalizar las pruebas. Todavía no hay un nodo al que MetaMask pueda conectarse.

## 4. Organizá tres terminales

Vas a mantener dos procesos activos y usar una terminal libre para desplegar:

| Terminal | Para qué la usarás | ¿Queda ejecutándose? |
| --- | --- | --- |
| A | Blockchain local de Hardhat | Sí |
| B | Despliegue y otros comandos | No, vuelve al prompt |
| C | Servidor del cliente web | Sí |

La terminal que ya usaste será la **A**. Abrí otras dos terminales o pestañas, **B** y **C**.

En B y C, entrá en la misma carpeta del proyecto. Podés copiar su ruta absoluta desde el editor y ejecutar `cd` con esa ruta entre comillas. Por ejemplo, si lo descargaste en Documentos:

```bash
cd "RUTA_COMPLETA_A_TU_CARPETA/client_ethereum_solidity"
```

Reemplazá `RUTA_COMPLETA_A_TU_CARPETA` por tu ruta real; no pegues ese texto como si fuera una ruta existente. Si tu terminal tiene la opción «Abrir terminal aquí», usala desde la carpeta del proyecto.

**Comprobación en B y C:** ejecutá `node -p "require('./package.json').name"`. Ambas deben responder `client-ethereum-solidity`. Si no, estás en otra carpeta.

## 5. Iniciá la blockchain — terminal A

En A, ejecutá:

```bash
npm run node
```

**Resultado esperado:** Hardhat informa que el servidor RPC está disponible en el puerto `8545` y muestra cuentas numeradas `Account #0`, `Account #1`, etc. Cada cuenta tiene una dirección y una línea `Private Key`.

Dejá A abierta. No escribas otros comandos ahí ni detengas el proceso durante la actividad.

Identificá estas dos cuentas; las vas a importar después:

| Cuenta de Hardhat | Uso en la actividad | Dirección predeterminada |
| --- | --- | --- |
| `Account #0` | Owner: despliega y puede incrementar el contador | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| `Account #1` | Segundo usuario | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` |

Usá las direcciones que muestre tu terminal. **Dirección y clave privada son datos distintos:** la dirección identifica una cuenta; la clave permite firmar como ella. Para importar una cuenta usarás su línea `Private Key`, no su dirección.

## 6. Desplegá MiContrato — terminal B

En B, ejecutá:

```bash
npm run deploy:local
```

El script usa `Account #0` para desplegar el contrato en el nodo de A. Esa cuenta queda registrada como `owner`.

**Resultado esperado:**

```text
Contrato desplegado: 0x... Red: 31337
ABI y dirección exportadas a public/deployment.json
```

1. Abrí `public/deployment.json` en el editor.
2. Comprobá que `address` contenga una dirección, `chainId` sea `31337` y `abi` contenga un array con funciones y eventos.
3. No cambies ese archivo. El script lo genera y el navegador lo lee automáticamente.

La **ABI** describe cómo llamar a las funciones del contrato. La dirección indica dónde está desplegado y el chain ID identifica la red. Necesitás los tres datos para que el cliente use el despliegue correcto.

## 7. Abrí la página — terminal C

En C, ejecutá:

```bash
npm run dev
```

**Resultado esperado:** Vite muestra una dirección local, normalmente `http://127.0.0.1:5173/`.

1. Abrí esa dirección en el navegador donde instalaste MetaMask.
2. Si Vite informa otro puerto, usá exactamente el que indique.
3. Comprobá que aparezca el título **De Solidity al navegador** y el botón **Conectar MetaMask**.

Dejá C abierta. Mantené la misma dirección del sitio durante toda la actividad: cambiar entre `localhost` y `127.0.0.1` puede requerir autorizar de nuevo la conexión.

## 8. Agregá la red local en MetaMask

1. Abrí la extensión MetaMask y desbloqueala.
2. Abrí el selector de redes.
3. Elegí la opción para agregar una red y luego agregarla manualmente. Los nombres pueden variar según el idioma y la versión; si no encontrás la opción, seguí la [guía oficial para agregar redes](https://support.metamask.io/configure/networks/how-to-add-a-custom-network-rpc).
4. Completá:

   | Campo | Valor |
   | --- | --- |
   | Nombre de la red | `Hardhat local UTN` |
   | URL de RPC | `http://127.0.0.1:8545` |
   | ID de cadena / Chain ID | `31337` |
   | Símbolo | `ETH` |
   | Explorador de bloques | Dejar vacío |

5. Guardá y seleccioná esa red.
6. Si MetaMask informa que ya existe una red con ese chain ID, revisá que use el RPC anterior y seleccionala; no crees otra.

**Comprobación:** la red seleccionada debe ser la local, no Ethereum Mainnet ni Amoy. El RPC de este paso es el nodo de A; no es la dirección del sitio web de C.

## 9. Importá la cuenta owner en MetaMask

1. Volvé a A y buscá `Account #0`.
2. Copiá únicamente el valor de la línea `Private Key` de esa cuenta, sin la etiqueta ni espacios adicionales.
3. En MetaMask, abrí el selector de cuentas y la opción para agregar una cuenta o billetera.
4. Elegí importar una cuenta mediante **clave privada**. No elijas importar mediante frase de recuperación. Consultá la [guía oficial de importación](https://support.metamask.io/start/use-an-existing-wallet) si tu versión presenta otro menú.
5. Pegá la clave de `Account #0` y confirmá la importación.
6. Si MetaMask permite cambiar el nombre de la cuenta, llamala `Hardhat owner`.
7. Seleccioná esa cuenta y la red local.

**Comprobación:** su dirección debe coincidir con `Account #0` y debe tener ETH de prueba provisto por Hardhat. No hace falta transferirle fondos. Si importaste otra cuenta, corregí la selección antes de seguir.

## 10. Conectá el cliente y comprobá el estado inicial

1. Volvé a la página web.
2. Presioná **Conectar MetaMask**.
3. Si MetaMask solicita permiso para conectar el sitio, seleccioná la cuenta owner y autorizá la conexión. Abrí la extensión si la solicitud no aparece delante del navegador.
4. Esperá el mensaje **Conectado...** en Actividad.
5. Compará los datos:

   | Dato | Resultado inicial esperado |
   | --- | --- |
   | Cuenta conectada | Dirección de `Account #0` |
   | Red | `31337` |
   | Contrato | `address` de `public/deployment.json` |
   | Saludo global | `Hola Polygon` |
   | Owner | Dirección de `Account #0` |
   | Contador | `0` |
   | Tu mensaje | `Sin mensaje` |
   | Tus interacciones | `0` |

El saludo conserva el texto del contrato de la clase anterior; la red de esta práctica sigue siendo Hardhat local.

**No avances si esos datos no coinciden.** Si ya hiciste escrituras en este despliegue, el estado no será inicial: seguí el procedimiento para reiniciar que figura al final.

Consultar el estado no envía una transacción ni consume gas. El permiso inicial para conectar MetaMask tampoco modifica el contrato.

## 11. Cambiá el saludo global

1. En **Nuevo saludo global**, escribí `Hola desde mi cliente`.
2. Presioná **Guardar saludo** una sola vez.
3. Revisá la transacción que propone MetaMask: debe usar la red local y la cuenta owner.
4. Confirmala. Si MetaMask advierte que no reconoce el contrato local, comprobá su dirección contra `deployment.json` antes de decidir.
5. Esperá que Actividad indique **Transacción confirmada** y que termine de actualizarse el estado.

**Comprobá:**

- Saludo global: `Hola desde mi cliente`.
- Tus interacciones: `1`.
- Contador: `0`.
- Actividad muestra hash, bloque, gas usado y evento `SaludoCambiado`.

El **hash** identifica la transacción. El cliente espera su inclusión en un bloque antes de informar la confirmación. En la red local puede ocurrir tan rápido que el estado pendiente apenas se vea. El gas se paga con el ETH local de prueba.

## 12. Guardá tu mensaje personal

1. En **Mensaje personal**, escribí `Soy el owner de este contrato`.
2. Presioná **Guardar mensaje**.
3. Confirmá en MetaMask y esperá la actualización.

**Comprobá:** tu mensaje muestra ese texto, tus interacciones pasan a `2`, el contador sigue en `0` y el recibo muestra `MensajePersonalCreado`.

«Personal» significa que el contrato lo asocia a tu dirección. **El texto es público en blockchain:** no escribas datos privados.

## 13. Incrementá el contador como owner

1. Presioná **Incrementar contador · solo owner**.
2. Confirmá en MetaMask.
3. Esperá la actualización.

**Comprobá:** contador `1`, interacciones `2` y evento `ContadorIncrementado`.

El contrato solo permite incrementar a su owner. El contador global y las interacciones por cuenta son variables diferentes: `incrementarContador()` no incrementa el mapping de interacciones.

## 14. Probá con una segunda cuenta

1. En A, copiá la clave privada de `Account #1`.
2. Importala en MetaMask con el mismo procedimiento del paso 9. Si podés, nombrala `Hardhat usuario`.
3. Seleccioná esa cuenta y mantené la red local.
4. La página se recarga cuando MetaMask informa el cambio. Si no se recarga, recargala manualmente.
5. Presioná **Conectar MetaMask**. Si MetaMask solicita permisos, autorizá la segunda cuenta para este sitio. Si el cliente sigue mostrando la primera, revisá las cuentas autorizadas del sitio en MetaMask y seleccioná la segunda.
6. Comprobá que la cuenta mostrada por el cliente coincida con `Account #1`.

**Resultado esperado:** el saludo sigue siendo `Hola desde mi cliente`, el owner sigue siendo `Account #0`, el contador sigue en `1`, tu mensaje es `Sin mensaje`, tus interacciones son `0` y el botón del contador está deshabilitado.

Ahora:

1. Escribí `Hola desde la segunda cuenta` en el saludo y guardalo; confirmá en MetaMask.
2. Escribí `Soy el segundo usuario` en el mensaje personal y guardalo; confirmá en MetaMask.
3. Esperá la actualización después de cada operación.

**Comprobá:** interacciones `2`, contador `1`, mensaje `Soy el segundo usuario` y saludo `Hola desde la segunda cuenta`.

Cualquier cuenta puede cambiar el saludo y su propio mensaje. El botón del contador refleja una restricción que también aplica Solidity; ocultar o deshabilitar un botón no reemplaza el control del contrato.

## 15. Rechazá una transacción y recuperate

Con la segunda cuenta conectada:

1. Escribí `Este saludo no debe guardarse` en el campo de saludo.
2. Presioná **Guardar saludo**.
3. En MetaMask, elegí **Rechazar** o **Cancelar**.
4. Comprobá que Actividad informe el rechazo.
5. Presioná **Actualizar estado**.

**Resultado esperado:** el saludo sigue siendo `Hola desde la segunda cuenta`, las interacciones siguen en `2` y el contador sigue en `1`. Rechazar antes de enviar no modifica el contrato.

Para verificar que podés continuar, guardá `Segunda cuenta recuperada` como mensaje personal y confirmá. Tu mensaje debe cambiar y tus interacciones deben pasar a `3`.

## 16. Volvé al owner y compará

1. En MetaMask seleccioná `Account #0`.
2. Después de la recarga, presioná **Conectar MetaMask** y autorizá esa cuenta si lo solicita.
3. Presioná **Actualizar estado**.

**Resultado esperado al completar el recorrido sin escrituras extra:**

| Dato | Owner (`Account #0`) | Segundo usuario (`Account #1`) |
| --- | --- | --- |
| Saludo global | `Hola desde la segunda cuenta` | El mismo |
| Contador | `1` | `1` |
| Mensaje personal | `Soy el owner de este contrato` | `Segunda cuenta recuperada` |
| Interacciones | `2` | `3` |
| Puede incrementar | Sí | No |

El saludo y el contador pertenecen al estado global. Los mensajes y las interacciones se consultan usando la dirección de cada cuenta. Si realizaste escrituras adicionales, las interacciones serán mayores.

La sección Actividad muestra el recibo de tu última transacción confirmada en esa página; no es un historial completo. Para ver cambios hechos desde otra pestaña, presioná **Actualizar estado**.

## 17. Hacé un cambio visible en el cliente

Hasta ahora usaste la aplicación incluida. Ahora vas a modificar su presentación:

1. Dejá A y C ejecutándose.
2. Abrí `index.html` en el editor.
3. Buscá exactamente `<h1>De Solidity al navegador</h1>`.
4. Reemplazalo por `<h1>Mi primer cliente Ethereum</h1>`.
5. Guardá el archivo y volvé al navegador. Vite actualiza la página.
6. Comprobá que cambió el título visible. Si se perdió la conexión, conectá MetaMask otra vez.
7. Consultá el estado y verificá que el saludo y el contador siguen iguales.

Cambiaste HTML, no Solidity: no hace falta redesplegar. El frontend está en `index.html` y `src/`; el contrato está en `contracts/MiContrato.sol`. Si modificás Solidity, sí necesitás compilar y desplegar otra vez para generar un contrato y una ABI coherentes.

## 18. Comprobá que podés generar la aplicación

En B, ejecutá:

```bash
npm run build
```

**Resultado esperado:** Vite finaliza sin errores y crea `dist/`. Incluye la configuración del despliegue que generaste antes del build.

No abras `dist/index.html` con doble clic. Si querés probar esa versión, ejecutá en B:

```bash
npm run preview
```

Abrí la dirección que indique, conectá MetaMask y consultá el estado. La nueva dirección puede requerir permisos de conexión. A debe seguir activa. Terminá el preview con Ctrl+C en B.

Si redesplegás después del build, repetí `npm run build` para copiar la nueva configuración.

## 19. Cerrá la práctica o empezá de nuevo

Para cerrar:

1. Detené el cliente con Ctrl+C en C.
2. Detené Hardhat con Ctrl+C en A.

**El estado local se pierde al detener Hardhat.** MetaMask conserva las cuentas importadas, pero eso no conserva los datos de la blockchain.

Para repetir desde cero:

1. En A, ejecutá `npm run node` y dejalo activo.
2. En B, ejecutá `npm run deploy:local`.
3. Si MetaMask conserva transacciones del nodo anterior, seleccioná exclusivamente la cuenta y red locales y usá su opción para limpiar los datos de actividad y nonce. No restaures ni borres toda la billetera. Repetí para la segunda cuenta si fuera necesario.
4. En C, ejecutá `npm run dev` si lo habías detenido.
5. Recargá el sitio, conectá el owner y comprobá el estado inicial del paso 10.

## Si algo falla

| Problema | Acción concreta |
| --- | --- |
| `ENOENT`, no encuentra `package.json` | Volvé a la carpeta del proyecto; comprobala con el comando del paso 4. |
| `npm ci` falla | Verificá Internet y Node 22. Si informa `E401`, revisá tu configuración de acceso al registro npm; no es un error del contrato. |
| Hardhat no puede descargar el compilador | Revisá conexión, proxy o firewall y repetí `npm test`. |
| Puerto `8545` ocupado | Revisá si ya tenés un nodo activo. Si es de otra práctica, detenelo en su terminal; luego iniciá el de este proyecto. |
| MetaMask no conecta al RPC | Comprobá que A siga activa y que el RPC sea `http://127.0.0.1:8545`. |
| MetaMask muestra otra cuenta o saldo cero | Compará la dirección con A y seleccioná la cuenta importada correcta sobre la red local. |
| El sitio pide instalar MetaMask aunque ya está instalada | Abrí el sitio en el mismo navegador y perfil donde está habilitada la extensión. |
| Error al leer `deployment.json` o mensaje de archivo faltante | Ejecutá `npm run deploy:local` en B y recargá el sitio. Vite puede devolver HTML si el archivo no existe; por eso también puede aparecer un error de JSON. |
| «Seleccioná en MetaMask la red 31337» | Seleccioná la red del paso 8, esperá la recarga y volvé a conectar. |
| «No hay contrato en esa dirección» | Comprobá A, repetí el despliegue en B y recargá el sitio. |
| Error de nonce o transacción que queda pendiente tras reiniciar | Seguí el procedimiento de reinicio del paso 19 para limpiar la actividad de las cuentas locales. |
| El botón del contador está deshabilitado | Compará la cuenta conectada con Owner. Solo `Account #0` puede incrementar en este recorrido. |
| Los valores no coinciden con la tabla | Cada escritura confirmada adicional cambia el estado. Para obtener los valores exactos, repetí desde cero sin operaciones extra. |

## Autoevaluación

Antes de dar por terminada la actividad, comprobá que podés:

- Identificar la dirección de tu cuenta, la del contrato y el chain ID sin confundirlos.
- Explicar por qué una lectura no solicita confirmar una transacción.
- Mostrar un hash, un bloque y un evento de una escritura confirmada.
- Comprobar que las dos cuentas ven el mismo saludo y distintos mensajes.
- Explicar por qué la segunda cuenta no puede incrementar el contador.
- Rechazar una transacción y seguir usando el cliente.
- Modificar el título sin redesplegar el contrato.

Si registrás capturas para tu trabajo, mostrales el estado o los recibos; evitá incluir claves privadas o frases de recuperación.

## Ampliación opcional: usar un despliegue de Amoy

Realizá esta ampliación después de completar el recorrido local. Si ya desplegaste `MiContrato` en Amoy en la clase anterior, podés conectarlo sin desplegar de nuevo:

1. Guardá la dirección de ese contrato y verificá que sea el `MiContrato` con las funciones de este proyecto.
2. En el proyecto de la clase anterior, abrí `artifacts/contracts/MiContrato.sol/MiContrato.json` y copiá el valor completo de su propiedad `abi`.
3. En este proyecto abrí `public/deployment.json`, reemplazá `address` por la dirección de Amoy, `chainId` por `80002` y `abi` por ese array. Conservá el JSON válido; no copies todo el artifact dentro de `abi`.
4. En MetaMask seleccioná Amoy y la cuenta de prueba que usaste la clase anterior. **No uses las cuentas públicas de Hardhat.**
5. Recargá el cliente, conectá y comprobá el estado existente. Los valores pueden diferir de los del recorrido local.
6. Para escribir necesitás POL de testnet. Firmá desde MetaMask; la clave privada no se ingresa en la página.
7. Para volver al circuito local, seleccioná la red local y ejecutá `npm run deploy:local` con A activa; recargá el cliente.

Si necesitás un contrato nuevo en Amoy, copiá `.env.example` a `.env`, completá `AMOY_RPC_URL` con tu RPC y `PRIVATE_KEY` con la clave de una cuenta exclusiva de testnet, y ejecutá `npm run deploy:amoy` en B. Ese comando reemplaza `deployment.json`. `.env` está excluido de Git: no lo publiques ni uses variables `VITE_` para secretos, porque se incluyen en el navegador.

## Referencias y alcance de la validación

El cliente usa [ethers v6](https://docs.ethers.org/v6/): `BrowserProvider` conecta con MetaMask, el signer representa la cuenta que firma y `Contract` combina ABI, dirección y signer. Se conserva Hardhat 2 y Solidity 0.8.28 por continuidad con [la clase anterior](https://github.com/utn-blockchain-5k3/ejercicios_solidity_hardhat); no son todas las últimas versiones publicadas.

Se verificaron las 16 pruebas del contrato, el despliegue y las operaciones por RPC, el build y el recorrido del cliente en un navegador con un proveedor de prueba conectado a Hardhat real. Se comprobaron lecturas, escrituras, recibos, permisos y rechazo de firma. Esa automatización no usa la extensión MetaMask: su autorización manual y el circuito Amoy requieren validación en esos entornos.

En la revisión realizada, `npm audit --omit=dev` no reportó vulnerabilidades; la instalación completa sí reportó avisos en dependencias de desarrollo de Hardhat 2.
