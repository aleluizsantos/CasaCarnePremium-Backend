//--------------------------
//Fazer a leitura de todos os arquivos que estão dentro diretóiro
//pegando todas as controller e adicionar na nossa aplicação
//--------------------------
const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs
        .readdirSync(__dirname) //ler o diretório que estamos
        .filter(file => ((file.indexOf('.')) !==0 && (file !== 'index.js')))
        .forEach(file => require(path.resolve(__dirname, file))(app));
}