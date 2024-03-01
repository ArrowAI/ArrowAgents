
export const execute = () => {
    let nodeProcess = "node:process"
    return new Promise(async (resolve, reject) => {
        try {
            let { argv } = await import(nodeProcess);
            let props = JSON.parse(argv[2]);
            let nodeProperties = await executeNodeProp(props)
            resolve(nodeProperties)
        } catch (error) {
            reject(error)
        }
    });

}
const executeNodeProp = async (prop) => {
    const nodeModuleName = prop.module as string
    const nodeModule = await import(nodeModuleName)
    const nodeInstance = new nodeModule.nodeClass();
    console.log(nodeInstance)
    let result = await nodeInstance['actions'][prop.action][prop.method](prop);
    let writeVariable='node:fs/promises'
    let { writeFile } = await import(writeVariable);
    await writeFile('./output.json',JSON.stringify(result), 'utf-8')
    console.log(result);
    return result;
}
execute()
    .catch(e => console.error(e))
