
// Functions for rendering menus, articles, and favorites

function setPageTitle(naslov, zbirka) {
    document.title = `${naslov} - ${zbirka} by JVKJ`;
}

// Render menu based on tags
function renderMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuContainer = document.querySelector('nav#menu.meni');
    if (!menuContainer) return;

    // Get unique sorted tags with non-empty submenus
    const tags = [...new Set(articles.map(article => article.tag))]
        .sort((a, b) => a.localeCompare(b))
        .filter(tag => articles.some(article => 
            article.tag === tag && 
            article.link !== currentPage
        ));

    let menuHTML = `
        <header class="major">
            <h2>Menu</h2>
        </header>
        <ul class="links">`;  // Added 'links' class for theme compatibility

    // Add Home link if not on index
    if (!currentPage.endsWith('index.html')) {
        menuHTML += `<li><a href="index.html">Začetna stran</a></li>`;
    }

    // Generate menu items
    tags.forEach(tag => {
        const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        menuHTML += `
            <li>
                <span class="opener">${capitalizedTag}<span class="fa fa-angle-down" style="float: right"></span></span>
                <ul>`;

        // Add filtered articles sorted by title
        articles.filter(article => 
            article.tag === tag && 
            article.link !== currentPage
        )
        .sort((a, b) => a.title.localeCompare(b.title))
        .forEach(article => {
            menuHTML += `<li><a href="${article.link}">${article.title}</a></li>`;
        });

        menuHTML += `</ul></li>`;
    });

    menuHTML += `</ul>`;
    menuContainer.innerHTML = menuHTML;

    // Initialize menu interactions
    initMenuInteractions();
}

function initMenuInteractions() {
    // Remove existing handlers to prevent duplicates
    $(document).off('click', '.opener');
    
    // Initialize menu toggles with proper animation
    $('.opener').each(function() {
        const $this = $(this);
        const $parent = $this.parent();
        const $submenu = $this.next('ul');
        
        // Initialize state
        $submenu.hide().data('shown', false);
        
        $this.on('click', function(e) {
            e.preventDefault();
            const $allOpeners = $('.opener');
            
            // Close all other menus
            $allOpeners.not(this).each(function() {
                const $otherSubmenu = $(this).next('ul');
                $otherSubmenu.slideUp(200);
                $(this).find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            });

            // Toggle current menu
            $submenu.stop(true, true).slideToggle(200, function() {
                $submenu.data('shown', $(this).is(':visible'));
            });
            
            // Rotate arrow icon
            $this.find('.fa')
                .toggleClass('fa-angle-down fa-angle-up');
        });
    });

    // Close menus when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('nav#menu').length) {
            $('.opener').next('ul').slideUp(200);
            $('.opener .fa').removeClass('fa-angle-up').addClass('fa-angle-down');
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

// Render all articles
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

// Filter articles based on the selected tag
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

// Render photo and text dynamically
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

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    renderFavorites();
    renderArticles();
    renderFilterButtons();
    setPageTitle(naslov, zbirka); // Assuming naslov and zbirka are defined somewhere in your scripts

    // Call these if you need them based on how your page is structured
    renderPhoto(photo, 'foto');
    renderText(naslov, 'naslov-recepti-1');
    renderText(naslov, 'naslov-recepti-2');
    renderText(zbirka, 'zbirka-recepti');
});