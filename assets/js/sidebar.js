// Constants at the top for easier data management

const sladko = [
    { label: "Muffini - ČOKOLADNI", href: "muffini_coko.html" },
    { label: "Palačinke - AMERIŠKE", href: "palacinke_ameriske.html" },
    //{ label: "Palačinke - NAVADNE", href: "#" },
];

const piskoti = [
    { label: "Krhki piškoti", href: "#" },
    { label: "Skalce", href: "#" },
];
    
const slano = [
    { label: "Brstični ohrovt v gorčični omaki", href: "#" },
    { label: "Piščančja obara", href: "#" },
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
        image: "am_pancakes.jpeg",
        alt: "Ameriške palačinke",
        description: "Si si zaželel/a neverjetno puhast, zlato zapečen in sladek obrok? Ameriške palačinke so hitre in enostavne za pripravo - kot nalašč za visok kup, premazan/prelit z najljubšimi dodatki!"
    },
    {
        title: "Muffini - ČOKOLADNI",
        link: "muffini_coko.html",
        image: "choco-muffin.jpeg",
        alt: "Čokoladni muffini",
        description: "Prepusti se bogatemu in čokoladnemu okusu domačih čokoladnih mafinov. So hitri in enostavni za pripravo oz. popolni za potešitev želje po sladkem!"
    },
    {
        title: "Palačinke",
        link: "palacinke_ameriske.html",
        image: "am_pancakes.jpeg",
        alt: "Ameriške palačinke",
        description: "Si si zaželel/a neverjetno puhast, zlato zapečen in sladek obrok? Ameriške palačinke so hitre in enostavne za pripravo - kot nalašč za visok kup, premazan/prelit z najljubšimi dodatki!"
    },
];

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
    for (const article of articles) {
        html += `
        <article>
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

// Function to render articles, excluding the one matching the current page's alt name
function renderArticlesV2(articles, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !naslov) return;

    let html = '';
    for (const article of articles) {
        // Remove hyphens and spaces, then convert to lowercase for comparison
        const normalizedAlt = article.alt.replace(/[- ]/g, '').toLowerCase();
        const normalizedNaslov = naslov.replace(/[- ]/g, '').toLowerCase();

        if (normalizedAlt !== normalizedNaslov) {
            html += `
            <article>
                <a href="${article.link}" class="image"><img src="images/${article.image}" alt="${article.alt}" /></a>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <ul class="actions">
                    <li><a href="${article.link}" class="button primary">Recept</a></li>
                </ul>
            </article>`;
        }
    }
    container.innerHTML = html;
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