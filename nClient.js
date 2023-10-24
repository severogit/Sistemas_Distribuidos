var readlineSync = require("readline-sync");
var colors = require("colors");
var net = require("net");

var HOST = "127.0.0.1";// localhost

var IFOOD = 9000;// porta IFood
var DELIVERY = 8000;// porta Delivery

var client = null; // inicializando o client

function OpenIFoodConnection() {// função para abrir conexão com IFood
    if (client) {
        console.log("Ja ha uma conexao aberta".red);
        setTimeout(function () {
            menu();
        }, 0)
        return;
    }

    client = new net.Socket(); // cria socket (tunel para transmissao de dados)

    client.on("error", function (err) { // caso reporte algum erro
        client.destroy(); // destroi conexao
        client = null; // atribui o client a null novamente para que ele seja elegivel a uma nova conexao
        console.log("Erro, a conexao nao pode ser aberta, motivo: , %s".red, err.message);// logar a mensagem de erro
        setTimeout(function () { // abrir o menu de acoes novamente
            menu();
        }, 0)
    })

    client.on("data", function (data) { // quando o client recebe alguma informacao (pedido)
        console.log(data.toString()); // log com a informacao recebida (pedido)
        setTimeout(function () { // abrir o menu de acoes novamente
            menu();
        }, 0)
    });

    client.connect(IFOOD, HOST, function () { // conenecta com o server do IFood
        console.log("Conexao aberta com restaurante iFood!".green);
        setTimeout(function () {
            menu();
        }, 0)
    });
}

function OpenDeliveryConnection() { // função para abrir conexão com Delivery
    if (client) {
        console.log("Ja ha uma conexao aberta".red);
        setTimeout(function () {
            menu();
        }, 0)
        return;
    }

    client = new net.Socket(); // cria socket

    client.on("error", function (err) { // caso reporte algum erro
        client.destroy();
        client = null;
        console.log("Erro, a conexao nao pode ser aberta, motivo: , %s".red, err.message); // caso de algum erro na hora de abrir a conexão com algum restaurante
        setTimeout(function () {
            menu();
        }, 0)
    })

    client.on("data", function (data) { // quando o restaurante recebe algum pedido
        console.log("Recebido: %s".cyan, data);
        setTimeout(function () {
            menu();
        }, 0)
    });

    client.connect(DELIVERY, HOST, function () {
        console.log("Conexao aberta com restaurante DeliveryMuch!".green);
        setTimeout(function () {
            menu();
        }, 0)
    });
}

function SendData(data) { // envia o pedido do cliente
    if (!client) {
        console.log("Nao ha um cliente criado.".red); // se nenhunha conexão foi estabelecida e o cliente tenta mandar mensagem
        setTimeout(function () {
            menu();
        }, 0)
        return;
    }

    client.write(data, null, function () { // escreve a mensagem do cliente
        setTimeout(function () {
            menu();
        }, 0)
    });
}

function CloseConnection(data) { // encerra conexão
    if (!client) {
        console.log("A conexao ja esta fechada.".red);
        setTimeout(function () {
            menu();
        }, 0)
        return;
    }

    client.destroy(); // destrói o tunel aberto
    client = null;
    console.log("Conexao fechada com sucesso!".yellow)
    setTimeout(function () {
        menu();
    }, 0)
}

function menu() {
    var lineRead = readlineSync.question("Escolha uma opcao\n 1 - Selecionar iFood\n 2 - Selecionar Delivery\n 3 - Fazer pedido\n 4 - Fechar conexao\n");

    switch(lineRead){
        case "1":
            OpenIFoodConnection();
            break;
        case "2":
            OpenDeliveryConnection();
            break;
        case "3":
            var data = readlineSync.question("Escreva seu pedido: ");
            SendData(data);
            break;
        case "4":
            CloseConnection()
            break;
        default:
            setTimeout(function () {
                menu();
            }, 0)
            break;
    }
}

menu();

// yarn
// abre delivery
// abre ifood
// abre union
// client