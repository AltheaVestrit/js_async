class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

// DONE: Rewrite using async/await instead of .then/catch.
async function loadJson(url) {
//   return fetch(url)
//     .then(response => {
//       if (response.status == 200) {
//         return response.json();
//       } else {
//         throw new HttpError(response);
//       }
//     });
    let response = await fetch(url);

    if (response.status == 200) {
        let json = await response.json();
        return json;
    } else {
        throw new HttpError(response);
    }
}

// Ask for a user name until github returns a valid user
// TODO: Rewrite using async/await instead of .then/catch.
// TODO: Get rid of the recursion in favour of a loop.
async function demoGithubUser() {
  let name = "iliakan";
  let json;

  while (true) {
    try {
      json = await loadJson(`https://api.github.com/users/${name}`);
      break;
    } catch (err) {
      if (err instanceof HttpError && err.response.status == 404) {
        console.log("No such user, please reenter.");
      } else {
        throw err;
      }
    }
  }
  console.log(`Full name: ${json.name}.`);
  return json;

  // return loadJson(`https://api.github.com/users/${name}`)
  //   .then(user => {
  //     console.log(`Full name: ${user.name}.`);
  //     return user;
  //   })
  //   .catch(err => {
  //     if (err instanceof HttpError && err.response.status == 404) {
  //       console.log("No such user, please reenter.");
  //       return demoGithubUser();
  //     } else {
  //       throw err;
  //     }
  //   });
}

demoGithubUser();