module.exports = {
roots: ['./test'],
transform: {
    '^.+\\.ts?$': 'ts-jest',
},
testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};



// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//    };
