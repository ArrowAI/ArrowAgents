class Base{
    run(){

    }
}

const classRegistry = {
    base: Base
};

function generatefromJson(jsonobj){
    let BaseClass = classRegistry[jsonobj.extends];

    let NewClass = class extends BaseClass {};

    NewClass.prototype.run = function(){
        flowExecutor(jsonobj.graph["run"].executiongraph, this)
    }
    return NewClass;
}