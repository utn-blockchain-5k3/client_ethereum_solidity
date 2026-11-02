import { BrowserProvider, Contract, isAddress } from "ethers";
import "./style.css";
const $ = id => document.getElementById(id);
let contract, account, config, busy = false;
function status(text) { $("status").textContent = text; }
function controls(enabled) {
  document.querySelectorAll("[data-write]").forEach(b => b.disabled = !enabled || busy);
  $("refresh").disabled = !enabled || busy;
  $("connect").disabled = busy;
}
function report(error) {
  status(error.code === 4001 || error.code === "ACTION_REJECTED"
    ? "Rechazaste la solicitud en MetaMask. Podés volver a intentarlo."
    : error.shortMessage || error.message || "No se pudo completar la operación.");
}
async function refresh() {
  const [info, user] = await Promise.all([contract.getInfoContrato(), contract.getInfoUsuario(account)]);
  for (const [id, value] of Object.entries({ greeting: info[0], owner: info[1], counter: info[2], message: user[0] || "Sin mensaje", interactions: user[1] })) $(id).textContent = String(value);
  $("increment").disabled = busy || info[1].toLowerCase() !== account.toLowerCase();
}
async function connect() {
  controls(false);
  contract = undefined;
  try {
    if (!window.ethereum) throw new Error("Instalá MetaMask y abrí este sitio desde http://localhost:5173.");
    const response = await fetch("/deployment.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Falta deployment.json. Ejecutá npm run deploy:local antes de conectar.");
    config = await response.json();
    if (!isAddress(config.address) || !Array.isArray(config.abi) || ![31337, 80002].includes(config.chainId)) throw new Error("Configuración de despliegue inválida.");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId !== BigInt(config.chainId)) throw new Error(`Seleccioná en MetaMask la red ${config.chainId}. Luego volvé a conectar.`);
    if (await provider.getCode(config.address) === "0x") throw new Error("No hay contrato en esa dirección. Si reiniciaste Hardhat, volvé a desplegar.");
    const signer = await provider.getSigner();
    account = await signer.getAddress();
    contract = new Contract(config.address, config.abi, signer);
    $("account").textContent = `Cuenta: ${account}`;
    $("deployment").textContent = `Red: ${config.chainId} · Contrato: ${config.address}`;
    controls(true);
    await refresh();
    status("Conectado. Las consultas no solicitan una firma; las escrituras requieren una transacción.");
  } catch (error) { contract = undefined; controls(false); report(error); }
}
async function send(method, args = []) {
  if (!contract || busy) return;
  busy = true; controls(true); $("receipt").textContent = "";
  try {
    status("Confirmá la transacción en MetaMask…");
    const tx = await contract[method](...args);
    status(`Enviada: ${tx.hash}. Esperando confirmación…`);
    const receipt = await tx.wait();
    const events = receipt.logs.flatMap(log => {
      try { const event = contract.interface.parseLog(log); return event ? [event.name] : []; }
      catch { return []; }
    });
    $("receipt").textContent = `Hash: ${receipt.hash}\nBloque: ${receipt.blockNumber}\nGas usado: ${receipt.gasUsed}\nEventos: ${events.join(", ")}`;
    status("Transacción confirmada.");
  } catch (error) { report(error); }
  finally { busy = false; controls(Boolean(contract)); if (contract) await refresh().catch(report); }
}
$("connect").addEventListener("click", connect);
$("refresh").addEventListener("click", () => refresh().catch(report));
$("greetingForm").addEventListener("submit", e => { e.preventDefault(); send("setSaludo", [$("greetingInput").value]); });
$("messageForm").addEventListener("submit", e => { e.preventDefault(); send("setMensajePersonal", [$("messageInput").value]); });
$("increment").addEventListener("click", () => send("incrementarContador"));
// Una cuenta o red diferente invalida el signer. Recargar evita usar una sesión vieja.
window.ethereum?.on("accountsChanged", () => window.location.reload());
window.ethereum?.on("chainChanged", () => window.location.reload());
