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
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        updateThemeIcon();
    });
});

searchForm.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        sidebar.classList.remove("collapsed");
        searchForm.querySelector("input").focus();
    }
});

// Alterna o tema
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
});

// ✅ Mantém só este bloco para lidar com troca de páginas
const menuLinks = document.querySelectorAll('.menu-link');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelectorAll('.page, .pageProposta, .pageClientes').forEach(page => {
            page.style.display = 'none';
        });

        const targetId = link.getAttribute('data-target');
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.style.display = 'block';

            if (targetId === 'propostas') {
                fetchPropostas();
            } else if (targetId === 'clientes') {
                document.getElementById('clientes').style.display = 'block';
                carregarClientes();
            }
        }
    });
});

// Botão "FECHAR COMPONENTE"
const btnFecharPropostas = document.getElementById('btnFecharPropostas');
if (btnFecharPropostas) {
    btnFecharPropostas.addEventListener('click', () => {
        const propostasPage = document.getElementById('propostas');
        if (propostasPage) {
            propostasPage.style.display = 'none';
        }
    });
}

const btnFecharClientes = document.getElementById('btnFecharClientes');
if (btnFecharClientes) {
    btnFecharClientes.addEventListener('click', () => {
        const clientesPage = document.getElementById('clientes');
        if (clientesPage) {
            clientesPage.style.display = 'none';
        }
    });
}

