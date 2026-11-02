// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MiContrato {
    // Variables de estado
    string public saludo = "Hola Polygon";
    address public owner;
    uint256 public contador;
    mapping(address => string) public mensajesPersonales;
    mapping(address => uint256) public interacciones;
    
    // Eventos
    event SaludoCambiado(address indexed usuario, string nuevoSaludo, uint256 timestamp);
    event MensajePersonalCreado(address indexed usuario, string mensaje);
    event ContadorIncrementado(address indexed usuario, uint256 nuevoValor);
    
    // Modificadores
    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esta funcion");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        contador = 0;
    }
    
    // Función para cambiar el saludo global
    function setSaludo(string calldata _nuevo) external {
        saludo = _nuevo;
        interacciones[msg.sender]++;
        emit SaludoCambiado(msg.sender, _nuevo, block.timestamp);
    }
    
    // Función para crear mensaje personal
    function setMensajePersonal(string calldata _mensaje) external {
        mensajesPersonales[msg.sender] = _mensaje;
        interacciones[msg.sender]++;
        emit MensajePersonalCreado(msg.sender, _mensaje);
    }
    
    // Función para incrementar contador (solo owner)
    function incrementarContador() external soloOwner {
        contador++;
        emit ContadorIncrementado(msg.sender, contador);
    }
    
    // Función para obtener información del usuario
    function getInfoUsuario(address _usuario) external view returns (
        string memory mensajePersonal,
        uint256 numInteracciones
    ) {
        return (mensajesPersonales[_usuario], interacciones[_usuario]);
    }
    
    // Función para cambiar owner (solo owner actual)
    function cambiarOwner(address _nuevoOwner) external soloOwner {
        require(_nuevoOwner != address(0), "Direccion invalida");
        owner = _nuevoOwner;
    }
    
    // Función para obtener información general del contrato
    function getInfoContrato() external view returns (
        string memory saludoActual,
        address ownerActual,
        uint256 contadorActual,
        uint256 bloqueActual
    ) {
        return (saludo, owner, contador, block.number);
    }
}