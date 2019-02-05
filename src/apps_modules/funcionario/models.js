module.exports={ 
    "funcionario":{
        "attr":[
            {
                "name":"idFuncionario",
                "type":"number",
                "primary":true,
                "auto_increment":true,
                "required":true,
            },
            {
                "name":"nome",
                "type":"string",
                "maxlength":80,
                "minlength":0,
                "label":"Nome",
                "required":true,
            },
            {
                'name':'apelido',
                "type":"string",
                "maxlength":80,
                "minlength":0,
                "label":"Apelido"
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
}