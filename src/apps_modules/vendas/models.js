
module.exports={ 
    "produtos":{
        "attr":[
            {
                "name":"id",
                "type":"number",
                "primary":true,
                "auto_increment":true,
                "required":true,
                // "min":0,
                // "max":20
            },
            {
                "name":"nome",
                "type":"string",
                "maxlength":20,
                "minlength":0,
                "label":"Nome",
                "required":true,
                'unique':true,
                // 'enum':["sim","nao"],
                'match':/.*/,
            },
            {
                'name':'quantidade',
                'min':0,
                'max':25,
                'type':'number',
                "required":true,
                'default':0
            },
            {
                'name':'date',
                'type':'date',
                'format':'YYYY-dd-mm',
                'default':''
            },
        ],
        "myget":{
            "method":"get",
            "query":"select nome,quantidade from produtos where id=?",
            "params":["id"]
        },
        "Mypost":{
            "method":"post",
            "query":"insert into produtos(nome,quantidade,date) values(?,?,?)",
            "params":["nome","quantidade","date"]
        }
        
    },

    "store":{
        "attr":[
            {
                "name":"id",
                "type":"number",
                "primary":true,
                "auto_increment":true,
                "required":true,
                // "min":0,
                // "max":20
            },
            {
                "name":"nome",
                "type":"string",
                "maxlength":20,
                "minlength":0,
                "label":"Nome",
                "required":true,
                'unique':true,
                // 'enum':["sim","nao"],
                'match':/.*/,
            },
            {
                'name':'quantidade',
                'min':0,
                'max':25,
                'type':'number',
                "required":true,
                'default':0
            },
            {
                'name':'date',
                'type':'date',
                'format':'YYYY-dd-mm',
                'default':''
            },
        ],
        "myget":{
            "method":"get",
            "query":"select nome,quantidade from produtos where id=?",
            "params":["id"]
        },
        "Mypost":{
            "method":"post",
            "query":"insert into produtos(nome,quantidade,date) values(?,?,?)",
            "params":["nome","quantidade","date"]
        }
        
    },

    "users":{
        "attr":[
            {
                "name":"id",
                "type":"number",
                "primary":true,
                "auto_increment":true,
                "required":true,
                "min":0,
                "max":20
            },
            {
                "name":"username",
                "type":"string",
                "maxlength":20,
                "minlength":0,
                "label":"Username",
                "required":true,
                'unique':true,
                'enum':["sim","nao"],
                'match':/.*/,
            },
            {
                'name':'age',
                'min':0,
                'max':25,
                'type':'number',
                "required":true,
                'default':0
            },
            {
                'name':'date',
                'min':0,
                'max':25,
                'type':'string',
                'format':'Y-m-d',
                // "required":true,
                'default':''
            },
            {
                'name':'idStore',
                'type':'number',
                "required":true,   
                "foreign":{
                    "model":"produtos",
                    "key":"id"
                }
            },
            {
                'name':'idProdutos',
                'type':'number',
                "required":true,   
                "foreign":{
                    "model":"produtos",
                    "key":"id"
                }
            },
            
        ],
        "get":{
            "method":"get",
            "return":["username","id"],
            "query":"select * from usres where id=?",
            "params":["id","username","password"]
        }
    },

}