const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
    cors: { origin: "*" } 
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DE SOCKETS (CORREGIDA) ---
io.on('connection', (socket) => {
    console.log('✅ Conexión establecida');

    // Escuchamos el pedido que envía el cliente
    socket.on('enviar-pedido', (pedido) => {
        console.log("📦 Nuevo pedido de:", pedido.cliente);
        
        // Reenviamos el pedido a TODOS (incluyendo al vendedor)
        io.emit('nuevo-pedido', pedido); 
    });

    socket.on('disconnect', () => {
        console.log('❌ Alguien se desconectó');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});