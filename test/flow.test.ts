
import {Engine} from './../src/engine/engine'
let engine = new Engine();
describe('GET NODE JSON',  () => {
    it('should return node json', async () => {
        let response = await engine.execute('flowId');
        // console.log(response);
        expect(response).toHaveProperty('nodeStatus');
    });
});