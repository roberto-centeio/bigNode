
# bigNode
This is the Framework node.js and aims to be framework for large modular project building.

>Em Fase de desenvolvimento!

>It aims to make the development of large projects simple, fast, secure and very flexible, thus warning of reducing the complexity and constraint found in the development of projects that tend to increase with the growth of functionalities, and also have several modules included in them.

Its final concept is that everything is ***`module`*** either as the core of the framework or the functionality of the project, which makes it possible to remove or install quickly and safely, without causing problems to the system.

## Functionality

- Creating models in JSON format
- Ability to export from the database to JSON models
- Ability to export from JSON models to database 
- Has basic API methods on models
- Enable the creation of the Action simply and quickly, from the implementation of query no models
- Installing or removing modules quickly and securely
- Has speed, security and stability in the project

## Project Structure
 This Framework is structured as follows:
- app_modules: Have all modules that contain the project featurescto
    - name_module
      - index: module initialization file
      - models: Contains all models and their structuring of the module
      - bin: folder containing executable files only from this module
      - lib: folder containing libraries used only by this module
      - package.json: package.json of this module 
      - node_modules: folder contains sub-modules used only by this module
      - ...
- bin: folder containing executable project files that are used by more than one 'app_modules' module
- config: folder containing all project settings
    - log: folder that has project log files
    - index: project configuration
    - modules: configuration of the modules used in the projects 
- lib:  older containing libraries and project modules, and which are used by more than one module of 'app_modules'
    - db: database module
        - bin: executables folder of this module
        - lib: pasta de bibliotecas deste modulo
        - node_modules: folder that have sub-modules used only by this module
        - route: folder containing this module's routers
        - test: folder containing the test files of this module
        - config: configuration file for this module
        - index: module initialization file
        - package: package.json of this module
- node_modules: folder that have sub-modules used by framework or used by more than one modules
- test: project test file folder
    - routers: project routers file folder
        - errors: error posting test file
- index: project startup file


### Modules Configuration
The configuration of the modules is done in the `config / modules.js` file and must contain the following structures:
- "route": address to access the module, ex: "/name"
- "models": file name containing models, ex: "models" ,
- "run": module initialization file name, ex: "index",
- "path": path of module location, ex: "apps_modules/name",
```
{
    "route":"/name",
    "models":"models",
    "run":"index",
    "path":"apps_modules/name",
},
```

### Database Configuration
The database configuration is done in the `config / index.js` file and within` config`, and it must have the following structures:
- host: database server address, ex; 'localhost',
- user: database user name, ex;'root',
- password: password, ex: "********",
- database: database name, ex:'myTest',
- port: port number of the database server, ex:3306,
```
db:{
        host: 'localhost',
        user: 'root',
        password:"********",
        database: 'myTest',
        port:3306, 
    }
```

### Project Configuration

The project configuration is done in the `config / index.js` file and should contain the following structures:
- name: project name, ex; 'MyProject',
- fileError: log file address to save the errors that occur in the Project 
- port: port number on which project runs ex:5703,
```
config = {
    name:"MyProject",
    logging:{
        fileError :__dirname+"/log/erros.log",
    },
    server:{
        port:5703
    },
    db:{
        host: 'localhost',
        user: 'root',
        password:"******",
        database: 'myTest',
        port:3306, 
    }
}
```



### Models
In this Framework all modules of App_modules must have a models, which defines all the database structures of the module.
To facilitate and speed up project development, this framework implements the concept of creating models in the `JSON` format.

In the model file you can create several models of the module. It has the following structure:
- nome: table or model name
    - attr: all attributes and their model structure
        - name: attribute name (string)
        - type: attribute data type (string)
            - number,
            - double
            - string,
            - date,
            - datetime,
            - time,
            - email
        - primary: if this attribute is primary key (booleano)
        - auto_increment: if this attribute has an auto increment (booleano),
        - required: if attribute is required (booleano),
        - maxlength: maximum length supported by attribute (int) 
        - minlength: if there is a minimum size supported by the attribute (int)
        - label: attribute label (string)
        - format: format supported by the attribute if case type for date or datetime (string)
        - default: if there is a default value of the attribute (srting/int)
    - name: name of some specific action created by model
        - method: action-supported method (get,post,put e delete)(string)
        - query: query to be executed by the action (string)
        - params: parameters to be received by the action (array)
```
module.exports={ 
    "funcionario":{
        "attr":[
            {
                "name":"idFuncionario",
                "type":"number",
                "primary":true,
                "auto_increment":true,
                "required":true,
            }
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
        .........
    },
    .....
}
```

### App_Modulo module initialization file 
All modules must have an initialization file and an `init` function which will contain all the necessary codes for module initialization. And the `init` function has two parameters, one of` express Router` type and the other is models.
```
module.exports={ 
    init:function(router){
        ......
    }
}
```

## Contribuição
In this Framework all kind of help is always welcome. For your contribution please join us at[grupo do Telegran](https://t.me/joinchat/IiDxvhc_tZA4JlyQv1b2YA).

## Run 
The commands in this Framework are:
- npm start: run the project,
- npm migrate action (create or alter) route(name of module):commands to manipulate the models in the project database, ex: npm migrate create venda,
- npm dev: executar o projecto no modo desevolvimento,
- npm test: executar teste no projecto,

## Requirements
- Nodejs
- NPM
- Nodemon