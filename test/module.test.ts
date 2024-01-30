import {extractJsonFromModule} from './../src/engine/moduleprocessor/moduleprocessor'


describe('GET NODE JSON',  () => {
    it('should return node json', async () => {
      
        let response = await extractJsonFromModule('/Users/ravirawat/Documents/ArrowAgents/src/actionmodules/github/index.ts','test','1.2.2');
        // console.log(response);
        expect(response).toHaveProperty('nodeProperties');
    });
});