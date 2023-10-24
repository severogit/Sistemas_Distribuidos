var net = require("net");
var colors = require("colors");
var HOST = "127.0.0.1";

var server = net.createServer(); // criando novo servidor

server.on("connection", function (socket) { // server escutando o evento de conexao
    var remoteAddress = socket.remoteAddress + ":" + socket.remotePort;
    channel = new net.Socket(); // criando o canal para a conexao

    channel.connect(7000, HOST, function () { // conectando ao canal Union (centralizador dos restaurantes)
        console.log("Conexao aberta com o Union!".green);
    });

    socket.on("data", function (data) { // escutando quando receber alguma informacao (pedido)
        console.log("Pedido recebido!".cyan, data.toString()); // transcrevendo o pedido recebido
        channel.write(`iFood: ${data.toString()}`.yellow, null, function () {}); // devolve como pedido recebido
        
        socket.write('Pedido confirmado!'); // devolve pro usuario a confirmacao do pedido
    });

    socket.on("close", function () { // fechando conexao do restaurante
        console.log("Conexão fechada de %s".yellow, remoteAddress);
    });

    socket.on("error", function (err) { // algum erro que possa ser reportado
        console.log("Erro de conexão %s, error: %s".red, remoteAddress, err.message);
    });
});

server.listen(9000, function () { // server no ar
    console.log("Server escutando %j", server.address());
});

// server ifood que vai estar conectado com o union