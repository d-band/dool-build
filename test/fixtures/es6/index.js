
class Model {
  constructor() {}
}

class User extends Model {
  constructor() {
    super();
    this.sayHello();
  }

  sayHello() {
    console.log("Hello World!");
  }
}

import B from './b';

console.log(B);

console.log(require('./a'));

new User();
