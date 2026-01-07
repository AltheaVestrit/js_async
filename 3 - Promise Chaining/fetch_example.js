  // Make a request to GitHub for user with username iliakan
fetch(`https://api.github.com/users/iliakan`)
  // Load it as json
  .then(response => response.json())
  // Show the user id (githubUser.id)
  .then(githubUser => {
    console.log(githubUser.id); // 349336
    return githubUser;
  })
  // Show full name, don't return anything
  .then(githubUser => {
    console.log(githubUser.name); // Ilya Kantor
  })
  // Even a .then without a return value returns a promise, and is therefore thenneable.
  // Log a message to the console, but don't return anything
  .then(() => {
    console.log("A .then call always returns a promise, that's why this .then call on the previous .then is allowed.");
  })
  // Show location -- uncommenting the code below will give an error because the previous .then(s) returned a promise without a result
//   .then(githubUser => {
//     console.log(githubUser.location);
//   });