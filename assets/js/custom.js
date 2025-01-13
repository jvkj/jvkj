// Constants at the top for easier data management

const sladko = [
    { label: "Muffini - ČOKOLADNI", href: "muffini_coko.html" },
    { label: "Narastek - RIŽEV", href: "narastek_rizev.html" },
    { label: "Palačinke - AMERIŠKE", href: "palacinke_ameriske.html" },
    { label: "Palačinke - NAVADNE", href: "palacinke_navadne.html" },
];

const piskoti = [
    { label: "Krhki", href: "#krhki_piskoti.html" },
    { label: "Skalce", href: "skalce.html" },
];

const slano = [
    { label: "BRSTIČNI OHROVT v gorčični omaki", href: "brst_oh_gorcicna.html" },
    { label: "Piščančja obara", href: "piscancja_obara.html" },
];

/*const omake = [
    { label: "Tunina omaka", href: "#" },
    { label: "Zelenjavna omaka", href: "#" },
];
    
const ostalo = [
    { label: "Liker - BANANIN", href: "#" },
    { label: "Liker - INGVERJEV", href: "#" },
];

const dev = [
    { label: "Test", href: "test.html" },
    { label: "Test2", href: "test2.html" },
    { label: "Index", href: "test_index.html" },
    { label: "Tekst", href: "test_tekstZaRecept.html" },
];*/

const articles = [
    {
        title: "Palačinke - AMERIŠKE",
        link: "palacinke_ameriske.html",
        image: "palacinke_ameriske.jpeg",
        alt: "Ameriške palačinke",
        description: "Si si zaželel/a neverjetno puhast, zlato zapečen in sladek obrok? Ameriške palačinke so hitre in enostavne za pripravo - kot nalašč za visok kup, premazan/prelit z najljubšimi dodatki!"
    },
    {
        title: "Muffini - ČOKOLADNI",
        link: "muffini_coko.html",
        image: "muffini_coko.jpeg",
        alt: "Čokoladni muffini",
        description: "Prepusti se bogatemu in čokoladnemu okusu domačih čokoladnih mafinov. So hitri in enostavni za pripravo oz. popolni za potešitev želje po sladkem!"
    },
    {
        title: "BRSTIČNI OHROVT v gorčični omaki",
        link: "brst_oh_gorcicna.html",
        image: "brst_oh_gorcicna.jpeg",
        alt: "Brstični ohrovt v gorčični omaki",
        description: "Praženi brstični ohrovt v gorčični omaki je popolna mešanica hrustljavosti in bogatega okusa. Kombinacija sladkaste karamelizacije in pikantne gorčice ustvarja jed, ki zna navdušiti tudi tiste, ki sicer niso največji ljubitelji brstičnega ohrovta."
    },
];

const favorites = 3; // Number of favorite recipes to be displayed

// Usage - moved here right after constant definitions

renderMenu(sladko, 'menu-sladko');
renderMenu(slano, 'menu-slano');
renderMenu(piskoti, 'menu-piskoti');
renderArticles(articles, 'miniPostsContainer');
renderPhoto(photo, 'foto');
renderText(naslov, 'naslov-recepti-1');
renderText(naslov, 'naslov-recepti-2');
renderText(zbirka, 'zbirka-recepti');
renderArticlesV2(articles, 'vsi-recepti');
renderFilterButtons(new Set(['sladko', 'slano', 'piskoti', 'ostalo'])); // Temporary until filters are dynamically determined
setPageTitle(naslov, zbirka);

// Functions for rendering menus, articles, photo, and text

function setPageTitle(naslov, zbirka) {
    document.title = `${naslov} - ${zbirka} by JVKJ`;
}

function renderMenu(data, menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    let html = '';
    for (const item of data) {
        html += `<li><a href="${item.href}">${item.label}</a></li>`;
    }
    menu.innerHTML = html;
}

function renderArticles(articles, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    for (let i = 0; i < Math.min(favorites, articles.length); i++) {
        const article = articles[i];
        html += `
        <article data-filter="${getArticleFilter(article.title)}">
            <h4><u><a href="${article.link}">${article.title}</a></u></h4>
            <a href="${article.link}" class="image"><img src="images/${article.image}" alt="${article.alt}" /></a>
            <p>${article.description}</p>
            <ul class="actions">
                <li><a href="${article.link}" class="button primary">Recept</a></li>
            </ul>
        </article>`;
    }
    container.innerHTML = html;
}

function renderArticlesV2(articles, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Sort articles by title
    const sortedArticles = articles.sort((a, b) => a.title.localeCompare(b.title));

    let html = '';
    const filters = new Set(); // To collect unique filters

    for (const article of sortedArticles) {
        const filter = getArticleFilter(article.title);
        filters.add(filter);

        // Remove hyphens and spaces, then convert to lowercase for comparison
        const normalizedAlt = article.alt.replace(/[- ]/g, '').toLowerCase();
        const normalizedNaslov = naslov.replace(/[- ]/g, '').toLowerCase();

        if (normalizedAlt !== normalizedNaslov) {
            html += `
            <article data-filter="${filter}">
                <a href="${article.link}" class="image"><img src="images/${article.image}" alt="${article.alt}" /></a>
                <a href="${article.link}"><h3>${article.title}</h3></a>
                <p>${article.description}</p>
                <ul class="actions">
                    <li><a href="${article.link}" class="button primary">Recept</a></li>
                </ul>
            </article>`;
        }
    }
    container.innerHTML = html;

    // Render dynamic buttons based on filters
    renderFilterButtons(filters);
}

function renderPhoto(photo, spanId) {
    const span = document.getElementById(spanId);
    if (!span) return;

    const html = `<img src="images/${photo}" alt="" />`;
    span.innerHTML = html;
}

function renderText(text, spanId) {
    const span = document.getElementById(spanId);
    if (!span) return;

    span.textContent = text;
}

function setButtonClass(filter) {
    const buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(button => {
        button.classList.remove('primary');
        if (button.id === `filter${filter.charAt(0).toUpperCase() + filter.slice(1)}` || 
            (filter === 'all' && button.id === 'showAllArticles')) {
            button.classList.add('primary');
        }
    });
}

function renderFilterButtons(filters) {
    const buttonContainer = document.querySelector('.button-container');
    if (!buttonContainer) return;

    let buttonsHTML = `
        <button id="showAllArticles" class="button primary" onclick="filterContent('all')">Vsi</button>
    `;

    filters.forEach(filter => {
        buttonsHTML += `
            <button id="filter${filter.charAt(0).toUpperCase() + filter.slice(1)}" 
                    class="button" 
                    onclick="filterContent('${filter}')">
                ${filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
        `;
    });

    buttonContainer.innerHTML = buttonsHTML;
}

function filterContent(filter) {
    const articles = document.querySelectorAll('#vsi-recepti article');
    articles.forEach(article => {
        if (article.getAttribute('data-filter') === filter || filter === 'all') {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });

    // Update button styles
    setButtonClass(filter);
}

function getArticleFilter(title) {
    if (title.toLowerCase().includes('muffini') || title.toLowerCase().includes('palačinke')) return 'sladko';
    if (title.toLowerCase().includes('piskoti')) return 'piskoti';
    if (title.toLowerCase().includes('brstični')) return 'slano';
    // Add more conditions here if needed
    return 'ostalo'; // Default filter if no match
}