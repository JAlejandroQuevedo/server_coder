import { Server } from "socket.io";
import { modelMessages } from "../../controllers/dao/models/messages.model.js";

const chatSocket = (server) => {
    let messages = [];
    const io = new Server(server)
    io.on('connection', client => {
        client.emit('chatLog', messages);
        console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
        client.on('newMessage', data => {
            messages.push(data);
            console.log(`Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`);
            modelMessages.create(messages)
            io.emit('messageArrived', data);

        });
    });
    return io;

}

export { chatSocket }