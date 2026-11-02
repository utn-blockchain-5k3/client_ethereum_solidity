const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MiContrato", function () {
  let contrato;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const MiContrato = await ethers.getContractFactory("MiContrato");
    contrato = await MiContrato.deploy();
    await contrato.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Debe establecer el saludo inicial correctamente", async function () {
      expect(await contrato.saludo()).to.equal("Hola Polygon");
    });

    it("Debe establecer el owner correctamente", async function () {
      expect(await contrato.owner()).to.equal(owner.address);
    });

    it("Debe inicializar el contador en 0", async function () {
      expect(await contrato.contador()).to.equal(0);
    });
  });

  describe("Funciones de saludo", function () {
    it("Debe cambiar el saludo global", async function () {
      const nuevoSaludo = "Hola UTN";
      await contrato.setSaludo(nuevoSaludo);
      expect(await contrato.saludo()).to.equal(nuevoSaludo);
    });

    it("Debe emitir evento al cambiar saludo", async function () {
      const nuevoSaludo = "Hola Blockchain";
      const tx = await contrato.setSaludo(nuevoSaludo);
      const receipt = await tx.wait();
      
      // Verificar que se emitió el evento
      await expect(contrato.setSaludo("Otro saludo"))
        .to.emit(contrato, "SaludoCambiado");
    });

    it("Debe incrementar contador de interacciones", async function () {
      await contrato.setSaludo("Test");
      const [, interacciones] = await contrato.getInfoUsuario(owner.address);
      expect(interacciones).to.equal(1);
    });
  });

  describe("Mensajes personales", function () {
    it("Debe permitir crear mensaje personal", async function () {
      const mensaje = "Mi mensaje personal";
      await contrato.setMensajePersonal(mensaje);
      expect(await contrato.mensajesPersonales(owner.address)).to.equal(mensaje);
    });

    it("Debe emitir evento al crear mensaje personal", async function () {
      const mensaje = "Mensaje de prueba";
      await expect(contrato.setMensajePersonal(mensaje))
        .to.emit(contrato, "MensajePersonalCreado")
        .withArgs(owner.address, mensaje);
    });

    it("Debe obtener información del usuario correctamente", async function () {
      const mensaje = "Test mensaje";
      await contrato.setMensajePersonal(mensaje);
      await contrato.setSaludo("Test saludo");
      
      const [mensajePersonal, interacciones] = await contrato.getInfoUsuario(owner.address);
      expect(mensajePersonal).to.equal(mensaje);
      expect(interacciones).to.equal(2);
    });
  });

  describe("Funciones de owner", function () {
    it("Solo el owner debe poder incrementar contador", async function () {
      await contrato.incrementarContador();
      expect(await contrato.contador()).to.equal(1);
    });

    it("No debe permitir que otros incrementen el contador", async function () {
      await expect(contrato.connect(otherAccount).incrementarContador())
        .to.be.revertedWith("Solo el owner puede ejecutar esta funcion");
    });

    it("Debe emitir evento al incrementar contador", async function () {
      await expect(contrato.incrementarContador())
        .to.emit(contrato, "ContadorIncrementado")
        .withArgs(owner.address, 1);
    });

    it("Debe permitir cambiar owner", async function () {
      await contrato.cambiarOwner(otherAccount.address);
      expect(await contrato.owner()).to.equal(otherAccount.address);
    });

    it("No debe permitir cambiar a dirección inválida", async function () {
      await expect(contrato.cambiarOwner(ethers.ZeroAddress))
        .to.be.revertedWith("Direccion invalida");
    });
  });

  describe("Funciones de vista", function () {
    it("Debe retornar información completa del contrato", async function () {
      await contrato.incrementarContador();
      const [saludoActual, ownerActual, contadorActual, bloqueActual] = 
        await contrato.getInfoContrato();
      
      expect(saludoActual).to.equal("Hola Polygon");
      expect(ownerActual).to.equal(owner.address);
      expect(contadorActual).to.equal(1);
      expect(bloqueActual).to.be.a("bigint");
    });
  });

  describe("Interacciones de múltiples usuarios", function () {
    it("Debe manejar diferentes usuarios correctamente", async function () {
      // Owner interactúa
      await contrato.setSaludo("Saludo del owner");
      await contrato.setMensajePersonal("Mensaje del owner");
      
      // Otro usuario interactúa
      await contrato.connect(otherAccount).setSaludo("Saludo de otro usuario");
      await contrato.connect(otherAccount).setMensajePersonal("Mensaje de otro usuario");
      
      // Verificar interacciones del owner
      const [mensajeOwner, interaccionesOwner] = await contrato.getInfoUsuario(owner.address);
      expect(mensajeOwner).to.equal("Mensaje del owner");
      expect(interaccionesOwner).to.equal(2);
      
      // Verificar interacciones del otro usuario
      const [mensajeOther, interaccionesOther] = await contrato.getInfoUsuario(otherAccount.address);
      expect(mensajeOther).to.equal("Mensaje de otro usuario");
      expect(interaccionesOther).to.equal(2);
      
      // El saludo global debe ser el último establecido
      expect(await contrato.saludo()).to.equal("Saludo de otro usuario");
    });
  });
});