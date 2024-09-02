const fetchGithubData = async () => {
  const app = document.querySelector("#app");
  const response = await fetch("assets/repos.json");
  const allRepos = await response.json();
  const repositoriesCount =  document.querySelector(".repositories-count");
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search");
  let currentSearchValue = "";

  repositoriesCount.textContent = `(${allRepos.length})`;

  // Function to fetch the latest release of a repository
  const getLatestRelease = async (repoOwner, repoName) => {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching latest release: ${response.statusText}`);
      }
      const releaseData = await response.json();
      return releaseData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Function to handle the list and grid view
  const handleListing = (repos, view) => {
    if (view === 'grid' || view === 'list') {
      return `
        ${view === 'grid' ? '<ul class="repos-list repos-list--grid grid grid--thirds grid--gap-large">' : '<ul class="repos-list">'}
        ${view === 'list' ? '<ul class="repos-list repos-list--list flow flow--large">' : ''}
          ${repos.map((repo) => {
            const latestRelease = getLatestRelease('localgovdrupal', repo.name);
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
                    <li>Latest release: ${latestRelease.tag_name}</li>
                    <li>
                        Clone command:<br>
                        <pre><code>git clone ${repo.ssh_url}</code></pre>
                        <button type="button" class="button-link copy-clone">Copy clone command</button>
                    </li>
                  </ul>
                </article>
              </li>
            `;
          }).join("")}
        </ul>
      `;
    }
    if (view === 'table') {
      return `
        <table class="repos-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Info</th>
              <th>Links</th>
            </tr>
          </thead>
          <tbody>
            ${repos.map((repo) => {
              const latestRelease = getLatestRelease('localgovdrupal', repo.name);
              console.log(latestRelease);

              return `
                <tr class="repo-row">
                  <td>
                    <h3><a href="${repo.html_url}">${repo.name}</a></h3>
                  </td>
                  <td>
                    ${repo.description ? `<p>${repo.description}</p>` : ""}
                    <pre><code>git clone ${repo.ssh_url}</code></pre>
                    <button type="button" class="button-link copy-clone">Copy clone command</button>
                  </td>
                  <td>
                    <ul>
                      <li><a href="${repo.html_url}/issues">Open Issues: ${repo.open_issues_count}</a></li>
                      <li><a href="${repo.html_url}/pulls">Open PRs</a></li>
                      <li><a href="${repo.html_url}/commits">Latest Commits</a></li>
                      <li><a href="${repo.html_url}/releases">Releases</a></li>
                      <li>Latest release: ${latestRelease.tag_name}</li>
                    </ul>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }
  };

  const filterRepos = (repos, searchValue) => {
    return repos.filter((repo) => {
      return (
        repo.name.toLowerCase().includes(searchValue) ||
        (repo.description && repo.description.toLowerCase().includes(searchValue))
      );
    });
  };

  const renderView = (repos, view) => {
    app.innerHTML = handleListing(repos, view);
  };

  app.innerHTML = handleListing(allRepos, 'table');

  const quickLinks = document.querySelector(".repositories__controls .quick-links");
  quickLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const activeButton = quickLinks.querySelector("[data-active=true]");
      activeButton.dataset.active = false;
      event.target.dataset.active = true;
      const view = event.target.textContent.toLowerCase();
      const filteredRepos = filterRepos(allRepos, currentSearchValue);
      renderView(filteredRepos, view);
    }
  });

  searchForm.addEventListener("keyup", (event) => {
    currentSearchValue = searchInput.value.toLowerCase();
    const filteredRepos = filterRepos(allRepos, currentSearchValue);
    const activeButton = quickLinks.querySelector("[data-active=true]");
    const view = activeButton.textContent.toLowerCase();
    renderView(filteredRepos, view);
    repositoriesCount.textContent = `(${filteredRepos.length})`;
  });

  const copyCloneCommands = document.querySelectorAll(".copy-clone");
  copyCloneCommands.forEach((command) => {
    command.addEventListener("click", (event) => {
      const cloneCommand = event.target.previousElementSibling.textContent;
      navigator.clipboard.writeText(cloneCommand);
    });
  });

};

fetchGithubData();
