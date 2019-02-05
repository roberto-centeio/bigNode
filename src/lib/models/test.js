const produtos =  require("./index").produtos

produtos.get(10);
produtos.save();

Object.keys(produtos).forEach(function(item){
    console.log(item,typeof produtos[item])
})
