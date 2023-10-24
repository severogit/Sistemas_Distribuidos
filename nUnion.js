var readlineSync = require("readline-sync");
var colors = require("colors");
var net = require("net");

var principal = net.createServer(); // criando server

principal.on("connection", function (socket) { // server preparado para ouvir eventos
    var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
    console.log("Uma nova conexão de restaurante foi recebida".green); // conexao foi estabelecida

    socket.on("data", function (data) { // restaurante devolve uma resposta que o pedido foi recebido
        console.log("Pedido recebido do restaurante".cyan, data.toString());
    });

    socket.on("close", function () { // fecha conexao
        console.log("Conexão fechada de %s".yellow, remoteAddress);
    });

    socket.on("error", function (err) { // qualquer erro captado
        console.log("Erro de conexão %s, error: %s".red, remoteAddress, err.message);
    });
});

principal.listen(7000, function () { // servidor no ar
    console.log("Server escutando %j", principal.address());
})

// criou o centralizador que vai ouvir qualquer conexao recebida
// vai receber info do client e repassar para o restaurante