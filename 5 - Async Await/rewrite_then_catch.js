// Challenge: rewrite the function below with async/await instead of then/catch

async function loadJson(url) {
//   return fetch(url)
//     .then(response => {
//       if (response.status == 200) {
//         return response.json();
//       } else {
//         throw new Error(response.status);
//       }
//     });
    let response = await fetch(url);

    if (response.status == 200) {
        let json = await response.json();
        return json
    }

    throw new Error(response.status);
}

loadJson('https://javascript.info/no-such-user.json')
  .catch((response) => console.log(response)); // Error: 404 