const sidebar = document.querySelector(".sidebar");
const sidebarToggleBtn = document.querySelectorAll(".sidebar-toggle");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const searchForm = document.querySelector(".search-form");

// Atualiza o ícone do tema com base no estado atual
const updateThemeIcon = () => {
    const isDark = document.body.classList.contains("dark-theme");
    themeIcon.className = isDark ? "fa-solid fa-sun theme-icon" : "fa-solid fa-moon theme-icon";
};

// Define tema escuro se salvo ou se o sistema preferir
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();

// Alterna a sidebar
sidebarToggleBtn.forEach(btn => {
    btn.addEventListener("click", ()=> {
        sidebar.classList.toggle("collapsed");
        updateThemeIcon();
    });
});

searchForm.addEventListener("click", () => {
    if(sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
        searchForm.querySelector("input").focus();
    }
})

// Alterna o tema
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
});

const mainContent = document.getElementById("main-content");
const links = document.querySelectorAll(".menu-link");

const loadPage = async (page) => {
  try {
    const response = await fetch(`pages/${page}.html`);
    const html = await response.text();
    mainContent.innerHTML = html;
  } catch (error) {
    mainContent.innerHTML = "<h2>Página não encontrada</h2>";
  }
};

// Atualiza classe ativa e carrega a página correspondente
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    links.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const label = link.textContent.trim().toLowerCase();
    loadPage(label); // Ex: dashboard, propostas, clientes
  });
});


