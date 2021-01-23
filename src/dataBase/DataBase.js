import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Tarefas.db"; //Nome do banco de dados
const database_version = "1.0"; //Versão do banco de dados
const database_displayname = "SQLite React Offline Database"; //Nome de exibição do banco de dados
const database_size = 200000; //tamanho do banco de dados

export default class DataBase {
    initDB() {
        let db;
        console.log("METODO INIT");
        return new Promise((resolve) => {
            console.log("Checando a integridade do plugin ...");
            SQLite.echoTest().then(() => {
                console.log("Integridade Ok ...");
                console.log("Abrindo Banco de Dados ...");
                SQLite.openDatabase(database_name, database_version, database_displayname, database_size).then(DB => {
                    db = DB;
                    console.log("Banco de dados Aberto");
                    db.executeSql('SELECT 1 FROM Tarefas LIMIT 1').then(() => {
                        console.log("O banco de dados está pronto ... Executando Consulta SQL ...");
                    }).catch((error) => {
                        console.log("Erro Recebido: ", error);
                        console.log("O Banco de dados não está pronto ... Criando Dados");
                        db.transaction((tx) => {
                            tx.executeSql('CREATE TABLE IF NOT EXISTS Tarefas (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, nome VARCHAR(30), descricao VARCHAR(50), data_termino DATE, prioridade VARCHAR(15))');
                        }).then(() => {
                            console.log("Tabela criada com Sucesso");
                        }).catch(error => {
                            console.log(error);
                            console.log("Deu merda no Quase no fim");
                        });
                    });
                    resolve(db);
                }).catch(error => {
                    console.log(error);
                    console.log("Deu merda no inicio");
                });
            }).catch(error => {
                console.log("echoTest Falhou - plugin não funcional");
            });
        });
    };

    closeDatabase(db) {
        if (db) {
            console.log("Fechando Banco de Dados");
            db.close().then(status => {
                console.log("Banco de dados Desconectado!!");
            }).catch(error => {
                this.errorCB(error);
            });
        } else {
            console.log("A conexão com o banco não está aberta");
        }
    };

    addTarefa(tarefa) {
        console.log("Metodo ADD");
        return new Promise((resolve) => {
            this.initDB().then((db) => {
                console.log("Metodo ADD INICIOU");
                db.transaction((tx) => {
                    //Query SQL para inserir um novo produto   
                    tx.executeSql('INSERT INTO Tarefas VALUES (?, ?, ?, ?)', [tarefa.Nome, tarefa.Descricao, tarefa.DataTermino, tarefa.Prioridade]).then(([tx, results]) => {
                        resolve(results);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                    console.log("Deu merda no FIM DO ADD");
                });
            }).catch((err) => {
                console.log(err);
                console.log("Deu merda no INICIO DO ADD");
            });
        });
    };

    listProduct() {
        return new Promise((resolve) => {
            const tarefas = [];
            this.initDB().then((db) => {
                db.transaction((tx) => {
                    //Query SQL para listar os dados da tabela   
                    tx.executeSql('SELECT t.id, t.nome, t.descricao, t.data_termino, t.prioridade FROM Tarefas t', []).then(([tx, results]) => {
                        console.log("Consulta completa");
                        var len = results.rows.length;
                        for (let i = 0; i < len; i++) {
                            let row = results.rows.item(i);
                            console.log(`Tarefa ID: ${row.id}, Tarefa Nome: ${row.nome}`)
                            const { id, nome, descricao, data_termino, prioridade } = row;
                            tarefas.push({ id, nome, descricao, data_termino, prioridade });
                        }
                        console.log(tarefas);
                        resolve(tarefas);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    };
}