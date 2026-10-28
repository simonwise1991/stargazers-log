const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const listStatus = document.querySelector("#list-status");

function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function createRepositoryItem(repository, index) {
  const item = document.createElement("li");
  item.className = "repository";
  item.style.animationDelay = `${index * 70}ms`;

  const link = document.createElement("a");
  link.className = "repository-name";
  link.href = repository.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repository.name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description;

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";

  const language = document.createElement("span");
  language.textContent = repository.language;

  const date = document.createElement("time");
  date.dateTime = repository.starredAt;
  date.textContent = `Starred ${formatDate(repository.starredAt)}`;

  metadata.append(language, date);
  item.append(link, description, metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const repositories = await response.json();
    repositories.sort((first, second) => second.starredAt.localeCompare(first.starredAt));

    const items = repositories.map(createRepositoryItem);
    repositoryList.replaceChildren(...items);
    repositoryCount.textContent = `${repositories.length} repositories`;
    listStatus.textContent = "";
  } catch (error) {
    listStatus.classList.add("error");
    listStatus.textContent = "Couldn't load the repository list. Try again later.";
    console.error("Unable to load starred repositories:", error);
  }
}

loadRepositories();