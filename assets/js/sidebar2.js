
function setPageTitle(naslov, zbirka) {
    document.title = `${naslov} - ${zbirka} by JVKJ`;
}

// Render menu based on tags
function renderMenu() {
    const tags = new Set(articles.map(article => article.tag));
    const currentPage = window.location.pathname.split('/').pop(); // Get the current page's filename

    tags.forEach(tag => {
        const menuId = `menu-${tag}`;
        const menu = document.getElementById(menuId);
        if (menu) {
            let html = '';
            articles.forEach(article => {
                if (article.tag === tag && article.link !== currentPage) { // Exclude current page
                    html += `<li><a href="${article.link}">${article.title}</a></li>`;
                }
            });
            menu.innerHTML = html;
        }
    });
}

// Render favorite articles
function renderFavorites() {
    const favoritesContainer = document.getElementById('miniPostsContainer');
    if (favoritesContainer) {
        const currentPage = window.location.pathname.split('/').pop(); // Get the current page's filename
        let html = '';
        articles
            .filter(article => article.fav === "1" && article.link !== currentPage) // Exclude current page
            .forEach(article => {
                html += `
                <article data-filter="${article.tag}">
                    <h4><u><a href="${article.link}">${article.title}</a></u></h4>
                    <a href="${article.link}" class="image"><img src="images/${article.image}" alt="${article.alt}" /></a>
                    <p>${article.description}</p>
                    <ul class="actions">
                        <li><a href="${article.link}" class="button primary">Recept</a></li>
                    </ul>
                </article>`;
            });
        favoritesContainer.innerHTML = html;
    }
}

function renderArticles() {
    const articlesContainer = document.getElementById('vsi-recepti');
    if (!articlesContainer) return;

    const currentPage = window.location.pathname.split('/').pop(); // Get the current page's filename

    // Sort articles alphabetically and exclude the current page
    const sortedArticles = articles
        .filter(article => article.link !== currentPage) // Exclude current page
        .sort((a, b) => a.title.localeCompare(b.title));

    // Generate HTML for sorted articles
    let html = '';
    sortedArticles.forEach(article => {
        html += `
        <article data-filter="${article.tag}">
            <a href="${article.link}" class="image"><img src="images/${article.image}" alt="${article.alt}" /></a>
            <a href="${article.link}"><h3>${article.title}</h3></a>
            <p>${article.description}</p>
            <ul class="actions">
                <li><a href="${article.link}" class="button primary">Recept</a></li>
            </ul>
        </article>`;
    });

    // Render sorted articles
    articlesContainer.innerHTML = html;
}

// Render filter buttons dynamically based on tags
function renderFilterButtons() {
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
        const tags = ['VSI', ...new Set(articles.map(article => article.tag.toUpperCase()))];
        let buttonsHTML = tags.map(tag => `
            <button id="${tag === 'VSI' ? 'showAllArticles' : `filter${tag}`}" class="button ${tag === 'VSI' ? 'primary' : ''}" onclick="filterContent(${tag === 'VSI' ? "'all'" : `'${tag.toLowerCase()}'`})">
                ${tag}
            </button>
        `).join('');
        buttonContainer.innerHTML = buttonsHTML;
    }
}

function filterContent(filter) {
    const articlesContainer = document.getElementById('vsi-recepti');
    if (!articlesContainer) return;

    const currentPage = window.location.pathname.split('/').pop(); // Get the current page's filename

    // Clear current articles
    articlesContainer.innerHTML = '';

    // Filter and sort articles alphabetically
    const filteredArticles = articles
        .filter(article => (filter === 'all' || article.tag.toLowerCase() === filter) && article.link !== currentPage) // Exclude current page
        .sort((a, b) => a.title.localeCompare(b.title));

    // Generate HTML for filtered articles
    let html = '';
    filteredArticles.forEach(article => {
        html += `
        <article data-filter="${article.tag}">
            <a href="${article.link}" class="image"><img src="images/${article.image}" alt="${article.alt}" /></a>
            <a href="${article.link}"><h3>${article.title}</h3></a>
            <p>${article.description}</p>
            <ul class="actions">
                <li><a href="${article.link}" class="button primary">Recept</a></li>
            </ul>
        </article>`;
    });

    // Render filtered articles
    articlesContainer.innerHTML = html;

    // Update button styles
    const buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(button => {
        button.classList.remove('primary');
        if (button.id === (filter === 'all' ? 'showAllArticles' : `filter${filter.toUpperCase()}`)) {
            button.classList.add('primary');
        }
    });
}

// Usage - moved here right after function definitions

renderMenu();
renderFavorites();
renderArticles();
renderFilterButtons();
setPageTitle(naslov, zbirka); // Assuming naslov and zbirka are defined somewhere in your scripts

// Additional setup if needed
function renderPhoto(photo, spanId) {
    const span = document.getElementById(spanId);
    if (span) {
        span.innerHTML = `<img src="images/${photo}" alt="" />`;
    }
}

function renderText(text, spanId) {
    const span = document.getElementById(spanId);
    if (span) {
        span.textContent = text;
    }
}

// Call these if you need them based on how your page is structured
renderPhoto(photo, 'foto');
renderText(naslov, 'naslov-recepti-1');
renderText(naslov, 'naslov-recepti-2');
renderText(zbirka, 'zbirka-recepti');