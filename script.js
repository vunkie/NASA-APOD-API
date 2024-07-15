// Elementos do DOM
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// API da NASA
const count = 10;
//const API_KEY = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;

// Variáveis
let resultsArray = [];
let favorites = {};

// Mostrar conteudo, remover loader
function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

// Criar elementos do DOM
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((result) => {
    // Container de Card
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "Ver Imagem Cheia";
    link.target = "_blank";
    // Imagem
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "Imagem do dia da NASA";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Corpo do Card
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Título do Card
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Botão de Salvar
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Adicionar aos Favoritos";
      saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = "Remover dos Favoritos";
      saveText.setAttribute("onclick", `removeFavorite('${result.url}')`);
    }

    // Texto do Card
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Rodapé Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Data
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyRight === undefined ? "Desconhecido" : result.copyRight;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // Adiciona ao DOM
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// Função para atualizar o DOM
function updateDOM(page) {
  // Pega os favoritos do Local Storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  // Limpa o container de imagens
  imagesContainer.textContent = "";

  // Criar elementos do DOM
  createDOMNodes(page);

  // Mostra o conteúdo e remove o loader
  showContent(page);
}

// GET 10 imagens da API da NASA
async function getNasaPictures() {
  // Mostra o Loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    // console.log(resultsArray);
    updateDOM("results");
  } catch (error) {
    // Catch Error Here
    throw new Error("Erro ao buscar imagens da NASA: ", error);
  }
}

// Adicionar resultados aos favoritos
function saveFavorite(itemUrl) {
  // Loop através dos resultados da NASA para selecionar o favorito
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // Mostra a mensagem de confirmação
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Salvar no Local Storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remover favoritos
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    // Salvar no Local Storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// On Load
getNasaPictures();
