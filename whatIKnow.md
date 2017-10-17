# 学习小结

### process对象提供一系列属性，用于返回系统信息。
  * process.pid：当前进程的进程号。
  * process.version：Node的版本，比如v0.10.18。
  * process.platform：当前系统平台，比如Linux。
  * process.title：默认值为“node”，可以自定义该值。
  * process.argv：当前进程的命令行参数数组。
  * process.env：指向当前shell的环境变量，比如  
  * process.env.HOME。
  * process.execPath：运行当前进程的可执行文件的绝对路径。
  * process.stdout：指向标准输出。
  * process.stdin：指向标准输入。
  * process.stderr：指向标准错误。

### Ramda
A practical functional library for JavaScript programmers.
  ```bash
  npm install ramda
  ```
  * [map](http://ramdajs.com/docs/#map)
    * eg:   
      ```javascript
      const R = require('ramda');

      var double = x => x * 2;

      R.map(double, [1, 2, 3]); //=> [2, 4, 6]

      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
      ```
  * [compose]()
    * eg:
      ```javascript
      var classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
      
      var yellGreeting = R.compose(R.toUpper, classyGreeting);
      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"

      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7 
      ```
### path
  * [resolve]()
    * eg:
      ```bash
      import { resolve } from 'path'
      ```
      ```javascript
      resolve([from ...], to)
      ```
      接收参数：
      * from 源路径
      * to 将被解析到绝对路径的字符串

### ES7的Async/Await
  * eg:
    ```javascript
    var sleep = function (time) {
      return new Promise(function (resolve, reject) {
          setTimeout(function () {
              resolve();
          }, time);
      })
    };

    var start = async function () {
      // 在这里使用起来就像同步代码那样直观
      console.log('start');
      await sleep(3000);
      console.log('end');
    };

    start();
    ```
    控制台先输出start，稍等3秒后，输出了end。
  * 基本规则
    1. async 表示这是一个async函数，await只能用在这个函数里面。
    2. await 表示在这里等待promise返回结果了，再继续执行。
    3. await 后面跟着的应该是一个promise对象（当然，其他返回值也没关系，只是会立即执行，不过那样就没有意义了…）
  > 引用来自 --> [这里](https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6)