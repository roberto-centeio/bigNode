let users = require("./index").models.users

users.attrs.id = 80;
users.attrs.username = "Roberto Centeio";
users.attrs.age = 12;
users.attrs.date = "14/02/2018";
users.attrs.idProdutos = 3;
users.attrs.idStore = 3;
console.log(users.save())