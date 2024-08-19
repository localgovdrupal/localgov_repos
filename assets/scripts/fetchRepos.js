const fs = require('fs');

let allRepos = [];
let page = 1;
let perPage = 20; // Maximum allowed by GitHub API

(async () => {
  while (true) {
    const response = await fetch(
      `https://api.github.com/orgs/localgovdrupal/repos?page=${page}&per_page=${perPage}`
    );
    const data = await response.json();
    if (data.length === 0) break;
    allRepos = allRepos.concat(data);
    page++;
  }

  // Write the data to a file
  fs.writeFile('./assets/repos.json', JSON.stringify(allRepos, null, 2), (err) => {
    if (err) throw err;
    console.log('Data has been written to repos.json');
  });
})();
