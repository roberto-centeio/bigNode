function prepareQueryInsert(objs){
    let into = "(";
    let values = "(";
    let params = [];

    Object.keys(objs).forEach((element,index) => {
        into = into + element+"";
        values = values + "?";
        
        
        if(index != (Object.keys(objs).length-1)){
            into = into + ",";
            values = values + ",";
        }
        
        params.push(objs[element])
    })


    into = into + ")";
    values = values + ")";

    return {
        into,
        values,
        params
    }
}

module.exports={
    prepareQueryInsert
}