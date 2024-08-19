const fetchGithubData = async () => {
  const app = document.querySelector("#app");
  const response = await fetch("assets/repos.json");
  const allRepos = await response.json();

  app.innerHTML = `
    <h2 class="repositories-title">Repositories (${allRepos.length})</h2>
    <form id="search-form" class="search-form">
      <label for="search">Search by title or description</label>
      <input type="text" id="search" name="search" placeholder="Search" />
    </form>
    <ul class="repos-list grid grid--thirds grid--gap-large">
      ${allRepos
        .map((repo) => {
          return `
        <li class="repos-list__item">
          <article class="repo flow">
            <h3><a href="${repo.html_url}">${repo.name}</a></h3>
            ${repo.description ? `<p>${repo.description}</p>` : ""}
            <ul class="repo__links flow">
            <li><a href="${repo.html_url}/issues">Open Issues: ${repo.open_issues_count}</a></li>
            <li><a href="${repo.html_url}/pulls">Open PRs: ${repo.open_issues_count}</a></li>
            <li><a href="${repo.html_url}/commits">Latest Commits</a></li>
            <li><a href="${repo.html_url}/releases">Releases</a></li>
            <li>Clone command:<br> <code>git clone ${repo.ssh_url}</code></li>
            </ul>
          </article>
        </li>
      `;
        })
        .join("")}
    </ul>
  `;
  const repositoriesTitle = document.querySelector(".repositories-title");
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search");
  searchForm.addEventListener("keyup", (event) => {
    const searchValue = searchInput.value;
    const filteredRepos = allRepos.filter((repo) => {
      return (
        repo.name.toLowerCase().includes(searchValue) ||
        (repo.description && repo.description.toLowerCase().includes(searchValue))
      );
    });
    allRepos.forEach((repo) => {
      // If not in filtered repos, add hidden class
      const repoElement = document.querySelector(`.repo [href="${repo.html_url}"]`);
      if (!filteredRepos.includes(repo)) {
        repoElement.closest(".repos-list__item").classList.add("hidden");
      } else {
        repoElement.closest(".repos-list__item").classList.remove("hidden");
      }
    });
    repositoriesTitle.textContent = `Repositories (${filteredRepos.length})`;
  });
};

fetchGithubData();
