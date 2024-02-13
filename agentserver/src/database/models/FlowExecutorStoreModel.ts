import AppDataSource from "../data-source"
import { FlowExecutorStore } from "../entity/FlowExecutorStore"

class FlowExecutorStoreModel {

    static async insertData() {
        const executor = new FlowExecutorStore()
        executor.flowId = "flowId"
        executor.context = {}
        executor.currentNodeId = "currentNodeId"
        await AppDataSource.manager.save(executor)
        console.log("Flow Executor has been saved. Executor id is", executor.id)

        const flowExecutorRepository = AppDataSource.getRepository(FlowExecutorStoreModel)



        const firstPhoto = await flowExecutorRepository.findOneBy({
            id: 1,
        })



    }
}

export default FlowExecutorStoreModel;