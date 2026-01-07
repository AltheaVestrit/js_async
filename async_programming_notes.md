# Notes on Asynchronous Programming in JavaScript
Notes on asynchronous programming in JavaScript, based on [JAVASCRIPT.INFO - Promises, async/await](https://javascript.info/async).

## Constructor syntax
```js
let promise = new Promise(function(resolve, reject) {
    // executor (the producing code, "singer")
});
```
When `new Promise` is created, the executor runs automatically.

## Callbacks
When the executor obtains the result, it should call one of these callbacks:
* `Resolve(value)` – if the job is finished successfully, with result `value`
* `Reject(error)` – if an error has occurred, `error` is the error object

## `promise` object internal properties
The `promise` object has the following internal properties:
> ❗ *Internal* properties are not directly accessible.
* `state` – initially "`pending`", then changes to either "`fulfilled`" when `resolve` is called or "`rejected`" when `reject` is called. When the state has changed to "`fulfilled`" or "`rejected`", we say that the promise is `settled`.
* `result` – initially undefined, then changes to `value` when `resolve(value)` is called or `error` when `reject(error)` is called.

![](promise_settling.png)

## Accessing the state / result
The properties `state` and `result` of the `Promise` object are internal. We can’t directly access them. We can use the methods `.then`/`.catch`/`.finally` for that. They are described below.

### .then
```js
promise.then(
  function(result) { /* handle a successful result */ },
  function(error) { /* handle an error */ }
);
```
None of the functions that can be passed to the `then` handler are mandatory, they can both be `null` (see explanation below catch).

### .catch
The call `.catch(errorHandlingFunction)` is a complete analog of `.then(null, errorHandlingFunction)`, it's just a shorthand.

### .finally
The call `.finally(f)` is used to always run `f`, when the promise is settled: whether it's `resolved` or `rejected`. Two important aspects of `finally`:
* The `finally` handler has no arguments, it doesn't get the outcome of the previous handler.
* The `finally` handler "passes through" the result or error to the next suitable handler.
* The `finally` handler shouldn't return anything. If it does, the returned value is silently ignored.

Example:
```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve("value"), 2000);
})
  .finally(() => alert("Promise ready")) // triggers first
  .then(result => alert(result)); // <-- .then shows "value"
```

## Promises chaining
Every call to a `.then` returns a new promise, so that we can call the next `.then` on it. When a handler returns a value, it becomes the result of that promise, so the next `.then` is called with it. Example:
```js
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  console.log(result); // 1
  return result * 2;

}).then(function(result) {

  console.log(result); // 2
  return result * 2;

}).then(function(result) {

  console.log(result); // 4
  return result * 2;

});
```
### Adding many `.then` to a single promise
> ❗ Adding many `.then` to a single promise is not the same as chaining. 

In the example below, the result isn't passed through the chain of `.then`-handlers:
```js
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
});

promise.then(function(result) {
  console.log(result); // 1
  return result * 2;
});

promise.then(function(result) {
  console.log(result); // 1
  return result * 2;
});

promise.then(function(result) {
  console.log(result); // 1
  return result * 2;
});
```

## Network requests: `fetch`
The `fetch(url)` method makes a network request to the `url` and returns a promise. The promise resolves with a `response` object when the remote server responds with headers, but *before the full response is downloaded*.

To read the full response, we should call the method `response.text()`: it returns a promise that resolves when the full text is downloaded from the remote server, with that text as a result.

### Using `response.text`
Reads the remote data. Returns a promise that resolves when the full text is downloaded from the remote server, with that text as a result.
```js
fetch('/article/promise-chaining/user.json')
  // .then below runs when the remote server responds
  .then(function(response) {
    // response.text() returns a new promise that resolves with the full
    // response text when it loads
    return response.text();
  })
  .then(function(text) {
    // ...and here's the content of the remote file
    console.log(text); // {"name": "iliakan", "isAdmin": true}
  });
```

### Using `response.json`
This reads the remote data and parses it as JSON. It returns a promise that resolves when the full text is downloaded from the remote server AND is fully parsed as JSON, with that JSON as a result.
```js
// same as above, but response.json() parses the remote content as JSON
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => console.log(user.name)); // iliakan, got user name
```

## Promise chaining - good practice
As a good practice, an asynchronous action should always return a promise. That makes it possible to plan actions after it; even if we don’t plan to extend the chain now, we may need it later.

Example: see [fetch_example.js](./3%20-%20Promise%20Chaining/fetch_example.js).