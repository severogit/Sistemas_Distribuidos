var net = require("net");
var colors = require("colors");
var HOST = "127.0.0.1";

var server = net.createServer();

server.on("connection", function (socket) {
    var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
    channel = new net.Socket();

    channel.connect(7000, HOST, function () {
        console.log("Conexao aberta com o Union!".green);
    });

    socket.on("data", function (data) {
        console.log("Pedido recebido!".cyan, data.toString());
        channel.write(`Delivery Much: ${data.toString()}`.yellow, null, function () {});
        
        socket.write('Pedido confirmado!');
    });

    socket.on("close", function () {
        console.log("Conexão fechada de %s".yellow, remoteAddress);
    });

    socket.on("error", function (err) {
        console.log("Erro de conexão %s, error: %s".red, remoteAddress, err.message);
    });
});

server.listen(8000, function () {
    console.log("Server escutando %j", server.address());
})