const fetchGithubData = async () => {
  const app = document.querySelector("#app");
  const response = await fetch("assets/repos.json");
  const allRepos = await response.json();

  app.innerHTML = `
    <h2 class="repositories-title">Repositories (${allRepos.length})</h2>
    <div class="repositories flow flow--large">
      <form id="search-form" class="search-form">
        <label for="search">Search by title or description</label>
        <input type="text" id="search" name="search" placeholder="Search" />
      </form>

      <div class="repositories__controls">
        <h3>View as:</h3>
        <div class="quick-links">
          <ul>
            <li><button class="button-link" data-active="true">Grid</button></li>
            <li><button class="button-link" data-active="false">List</button></li>
          </ul>
        </div>
      </div>

      <ul class="repos-list repos-list--grid grid grid--thirds grid--gap-large">
        ${allRepos
          .map((repo) => {
            return `
          <li class="repos-list__item">
            <article class="repo flow">
              <h3><a href="${repo.html_url}">${repo.name}</a></h3>
              ${repo.description ? `<p>${repo.description}</p>` : ""}
              <ul class="repo__links flow">
              <li><a href="${repo.html_url}/issues">Open Issues: ${repo.open_issues_count}</a></li>
              <li><a href="${repo.html_url}/pulls">Open PRs</a></li>
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
    </div>
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

  const quickLinks = document.querySelector(".repositories__controls .quick-links");
  quickLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const activeButton = quickLinks.querySelector("[data-active=true]");
      activeButton.dataset.active = false;
      event.target.dataset.active = true;
      const reposList = document.querySelector(".repos-list");
      // Remove all classes
      reposList.className = "";
      if (event.target.textContent === "Grid") {
        reposList.classList.add("repos-list", "repos-list--grid", "grid", "grid--thirds", "grid--gap-large");
      } else if (event.target.textContent === "List") {
        reposList.classList.add("repos-list", "repos-list--list", "flow", "flow--large");
      }
    }
  });

};

fetchGithubData();
