// const { of } = require('rxjs');
// const { map, filter } = require('rxjs/operators');

// const myObservable = of('Hello', 'World', '!');

// myObservable.pipe(
//  filter(word => word.length > 3),
//  map(word => word.toUpperCase())
// ).subscribe(console.log);

function foo() {
    console.log('Hello');
    return 42;
}
  
  var x = foo.call(); // same as foo()
  console.log(x);
  var y = foo.call(); // same as foo()
  console.log(y);