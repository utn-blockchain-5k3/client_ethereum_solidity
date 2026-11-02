# Cliente Ethereum + Solidity

Ejemplo de la UTN que continúa [los ejercicios de Hardhat de la clase anterior](https://github.com/utn-blockchain-5k3/ejercicios_solidity_hardhat). Antes desplegabas y llamabas a `MiContrato` desde scripts; ahora lo usás desde un navegador y firmás con MetaMask. Se conserva el contrato original, con Solidity 0.8.28 y Hardhat 2 para mantener la continuidad.

## Requisitos

- Node.js 22 y npm. Con nvm: `nvm use`.
- MetaMask instalado en el navegador, con una cuenta exclusiva para prácticas.
- Tres terminales abiertas en la raíz de este repositorio.

## Ejecutar en local

```bash
git clone https://github.com/utn-blockchain-5k3/client_ethereum_solidity.git
cd client_ethereum_solidity
npm ci
npm test
```

`npm ci` instala las versiones del lockfile. `npm test` compila y prueba el contrato en una red temporal; esa red termina al finalizar las pruebas.

**Terminal 1:**

```bash
npm run node
```

Inicia la blockchain local en `http://127.0.0.1:8545`, con chain ID `31337`. Dejá esta terminal abierta. Hardhat muestra cuentas y claves públicas de desarrollo: nunca las uses en redes públicas ni les envíes fondos reales.

**Terminal 2:**

```bash
npm run deploy:local
```

Despliega `MiContrato` en el nodo anterior. Genera `public/deployment.json` con dirección, chain ID y ABI completos. El cliente consume ese archivo; no copies direcciones ni ABI a mano. Este archivo es público y no contiene secretos.

**Terminal 3:**

```bash
npm run dev
```

Abrí `http://localhost:5173` (o el puerto que indique Vite). Agregá en MetaMask una red con RPC `http://127.0.0.1:8545`, chain ID `31337` y símbolo `ETH`. Importá **solo en una billetera de prácticas** la primera cuenta que muestra Hardhat: es el owner que despliega el contrato. Seleccioná esa red y presioná **Conectar MetaMask**.

## Recorrido de prueba

1. Leé el saludo `Hola Polygon`, el owner y el contador inicial `0`. Las consultas usan llamadas RPC, sin transacciones ni costo de gas.
2. Guardá un saludo. MetaMask solicita una firma; el cliente muestra el hash pendiente y espera `tx.wait()` antes de informar confirmación y actualizar el estado.
3. Guardá un mensaje personal. Aunque se asocia a tu dirección, el texto es público. Ambas escrituras incrementan tus interacciones.
4. Incrementá el contador desde el owner. Esta operación emite un evento, pero no aumenta el mapping de interacciones: así está definido el contrato original.
5. Importá la segunda cuenta local y cambiala en MetaMask. Reconectá: el saludo global se conserva y el mensaje depende de la cuenta. El botón del contador queda deshabilitado; el contrato también rechaza llamadas de terceros.
6. Rechazá una solicitud de firma para observar el error recuperable. Usá **Actualizar estado** para consultar cambios realizados desde otra pestaña; no hay suscripción permanente a eventos.

La sección Actividad muestra los eventos del recibo de tu última transacción confirmada. Cambiar la cuenta o la red recarga la página para invalidar el signer anterior. El cliente no pide ni guarda claves privadas.

## Usar el contrato de la clase anterior

Si ya tenés `MiContrato` desplegado, no hace falta volver a desplegar. Copiá el `abi` de su artifact `artifacts/contracts/MiContrato.sol/MiContrato.json` a `public/deployment.json`, junto con su dirección y la red:

```json
{
  "address": "REEMPLAZAR_POR_LA_DIRECCION_DEL_CONTRATO",
  "chainId": 80002,
  "abi": []
}
```

Reemplazá `abi: []` por el array completo del artifact; el ejemplo anterior es una plantilla. La interfaz requiere las funciones del `MiContrato` original. La dirección debe corresponder a la misma red seleccionada en MetaMask.

## Despliegue opcional en Polygon Amoy

El circuito principal se ejecuta íntegramente en local. Para Amoy necesitás una cuenta de prueba con POL de testnet y un RPC accesible:

```bash
cp .env.example .env
# Editá .env: AMOY_RPC_URL y PRIVATE_KEY de la cuenta de prueba.
npm run deploy:amoy
npm run dev
```

El despliegue genera el mismo archivo con chain ID `80002`. Seleccioná Amoy en MetaMask. `.env` se usa únicamente en Hardhat y está excluido de Git; no uses variables `VITE_` para claves privadas porque terminarían en el navegador. El frontend firma a través de MetaMask.

## Cómo se conecta

`Navegador → ethers BrowserProvider → MetaMask → RPC → MiContrato`

- **Provider:** consulta la red y el código del contrato.
- **Signer:** representa la cuenta que autoriza transacciones en MetaMask.
- **ABI:** describe funciones y eventos para codificar llamadas y decodificar resultados.
- **Dirección + chain ID:** identifican el despliegue que debe usar el cliente.

`contracts/` contiene el contrato; `test/`, sus pruebas; `scripts/deploy.js`, el despliegue y la exportación; `src/main.js`, la conexión, lecturas y escrituras; `src/style.css`, los estilos. Para practicar, cambiá textos y estilos en `src/`, o agregá un campo que consulte el bloque devuelto por `getInfoContrato()`. Si cambiás Solidity, compilá y desplegá nuevamente para actualizar dirección y ABI.

## Problemas frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| Falta deployment.json | Ejecutá el despliegue antes de conectar. |
| Red incorrecta | Seleccioná el chain ID que indica el cliente y reconectá. |
| No hay contrato en esa dirección | Reiniciar Hardhat borra el estado: volvé a desplegar. |
| MetaMask no conecta al RPC | Verificá que `npm run node` siga activo y el puerto sea 8545. |
| Nonce incorrecto después de reiniciar el nodo | Limpiá los datos de actividad de la cuenta local en MetaMask y reconectá. |
| No podés incrementar | Usá la cuenta owner; no alcanza con cambiar el frontend. |
| No tenés saldo | En local importá una cuenta del nodo; en Amoy necesitás tokens de testnet. |

## Compilación del cliente

```bash
npm run build
npm run preview
```

Vite genera `dist/`. Ejecutá el despliegue **antes** del build para incluir `deployment.json`. Ese archivo queda asociado a esa red y dirección: si redesplegás, repetí el build. Para terminar, detené Vite y Hardhat con Ctrl+C; el estado local se pierde al detener el nodo.

## Referencias

- [ethers v6: BrowserProvider, Signer y Contract](https://docs.ethers.org/v6/)
- [Hardhat 2](https://v2.hardhat.org/docs)
- [MetaMask](https://docs.metamask.io/)

Hardhat 2 se mantiene aquí por compatibilidad con la clase anterior. [Hardhat publica su política de fin de soporte y migración a la versión 3](https://hardhat.org/docs/reference/hardhat-2-end-of-life).

## Validación y alcance

Se verificaron 16 pruebas del contrato, despliegue en Hardhat local, uso del ABI exportado por RPC, lecturas, escrituras, recibos, rechazo por permisos y build del cliente. La firma manual con la extensión MetaMask y el circuito Amoy requieren comprobación en esos entornos; no se presentan como pruebas realizadas.

`npm audit --omit=dev` no reportó vulnerabilidades. La instalación completa sí reporta avisos en dependencias de desarrollo de Hardhat 2. Este repositorio es un ejemplo educativo local; una actualización mayor requiere adaptar configuración y plugins.
