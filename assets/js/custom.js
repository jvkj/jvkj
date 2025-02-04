// Constants for ingredient plural forms
const foodPlurals = {
    'jajce': ['jajce', 'jajci', 'jajca', 'jajca', 'jajc'],
    'banane': ['banana', 'banani', 'banane', 'banane', 'banan'],
    'cvetača': ['cvetača', 'cvetači', 'cvetače', 'cvetače', 'cvetač'],
    'limona': ['limona', 'limoni', 'limone', 'limone', 'limon'],
    'ananas': ['ananas', 'ananasa', 'ananasi', 'ananasi', 'ananasov']
};

// Constants for quantity plural forms
const quantityPlurals = {
    'žlica': ['žlica', 'žlici', 'žlice', 'žlice', 'žlic'],
    'žlička': ['žlička', 'žlički', 'žličke', 'žličke', 'žličk'],
    'ščepec': ['ščepec', 'ščepca', 'ščepci', 'ščepci', 'ščepcev'],
    'ščep': ['ščep', 'ščepa', 'ščepi', 'ščepi', 'ščepov'],
    'strok': ['strok', 'stroka', 'stroki', 'stroki', 'strokov']
};

function updateQuantityText() {
    const quantityElement = document.getElementById('naslovKolicina');
    if (quantityElement) {
        quantityElement.textContent = kolicina;
    }
}

function adjustPlural(number, itemName) {
    const isQuantity = itemName in quantityPlurals;
    const plurals = isQuantity ? quantityPlurals[itemName] : foodPlurals[itemName];
    
    if (plurals) {
        return number >= 1 && number <= 5 ? plurals[number - 1] : plurals[4];
    }
    return itemName;
}

function distributeSteps(steps) {
    const container1 = document.getElementById('recipeContainer1');
    const container2 = document.getElementById('recipeContainer2');
    if (!container1 || !container2) return;

    const halfLength = Math.ceil(steps.length / 2);
    container1.innerHTML = steps.slice(0, halfLength).map(s => `<p>${s}</p>`).join('');
    container2.innerHTML = steps.slice(halfLength).map(s => `<p>${s}</p>`).join('');
}

function updateRecipe(quantity) {
    const ingredientsList = document.getElementById('ingredientsList');
    if (!ingredientsList) return;

    let html = '';
    for (const [ingredient, grams] of Object.entries(sestavine)) {
        let adjusted = grams * quantity;
        let isQuantity = false;

        // Handle quantity-based ingredients (žlica, žlička etc.)
        for (const qTerm of Object.keys(quantityPlurals)) {
            if (ingredient.startsWith(qTerm + ' ')) {
                const [qType, ...rest] = ingredient.split(' ');
                const actualIngredient = rest.join(' ');
                const rounded = Math.max(1, Math.round(adjusted));
                html += `<li><strong>${rounded}</strong> ${adjustPlural(rounded, qType)} ${actualIngredient}</li>`;
                isQuantity = true;
                break;
            }
        }

        if (!isQuantity) {
            if (ingredient in foodPlurals) {
                const rounded = Math.max(1, Math.round(adjusted));
                html += `<li><strong>${rounded}</strong> ${adjustPlural(rounded, ingredient)}</li>`;
            } else {
                let display, unit;
                if (sestavineDecimal.includes(ingredient)) {
                    display = adjusted.toFixed(1);
                    unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
                } else {
                    display = Math.round(adjusted);
                    unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
                }
                html += `<li><strong>${display}</strong>${unit} ${ingredient}</li>`;
            }
        }
    }
    ingredientsList.innerHTML = html;

    // Update recipe steps
    const steps = postopek.map(step => {
        return Object.entries(sestavine).reduce((currentStep, [ingredient, grams]) => {
            const classname = ingredient.replace(/\s/g, '_');
            const adjusted = grams * quantity;
            const regex = new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g');

            if (ingredient.split(' ')[0] in quantityPlurals) {
                const [qType, ...rest] = ingredient.split(' ');
                const actual = rest.join(' ');
                const rounded = Math.max(1, Math.round(adjusted));
                return currentStep.replace(regex, `<strong>${rounded} ${adjustPlural(rounded, qType)} ${actual}</strong>`);
            }
            
            if (ingredient in foodPlurals) {
                const rounded = Math.max(1, Math.round(adjusted));
                return currentStep.replace(regex, `<strong>${rounded} ${adjustPlural(rounded, ingredient)}</strong>`);
            }

            let display, unit;
            if (sestavineDecimal.includes(ingredient)) {
                display = adjusted.toFixed(1);
                unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
            } else {
                display = Math.round(adjusted);
                unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
            }
            return currentStep.replace(regex, `<strong>${display}${unit} ${ingredient}</strong>`);
        }, step);
    });

    distributeSteps(steps);
}

function adjustQuantity(adjustment) {
    const input = document.getElementById('steviloOseb');
    let qty = Math.max(1, parseInt(input.value) + adjustment);
    input.value = qty;
    updateQuantityText();
}

function updateTime(quantity) {
    const formatTime = time => {
        if (!time) return null;
        if (time >= 60) {
            const hours = Math.floor(time / 60);
            const mins = time % 60;
            return mins ? `${hours}h ${mins}min` : `${hours}h`;
        }
        return `${time}min`;
    };

    const calculateTime = (base, adjust) => adjust ? base * quantity : base;
    
    const times = [cas1, cas2, cas3].map((t, i) => 
        formatTime(calculateTime(t, [cas1Adjust, cas2Adjust, cas3Adjust][i]))
    );

    const totalTime = formatTime([cas1, cas2, cas3].reduce((acc, t, i) => 
        acc + calculateTime(t, [cas1Adjust, cas2Adjust, cas3Adjust][i]), 0));

    const timeElement = document.getElementById('prepTime');
    if (timeElement) {
        timeElement.innerHTML = `
            <h3><u>${skupniCasName}</u>: <strong><em>${totalTime}</em></strong></h3>
            <ul class="alt">
                ${times.map((t, i) => t ? `<li>${[cas1Name, cas2Name, cas3Name][i]}: <strong><em>${t}</em></strong></li>` : '').join('')}
            </ul>
        `;
    }
}

function multiplyBy() {
    const quantity = parseInt(document.getElementById('steviloOseb').value);
    updateRecipe(quantity);
    updateTime(quantity);
}

function renderNotes(notes) {
    const container = document.getElementById('notesContainer');
    if (container) {
        container.innerHTML = notes !== "0" 
            ? `<br><div class="box"><center>* - <em><u>${notes}</u></em></center></div>`
            : '';
    }
}

// Event listeners
document.getElementById('minusButton').addEventListener('click', e => {
    e.preventDefault();
    adjustQuantity(-1);
});

document.getElementById('plusButton').addEventListener('click', e => {
    e.preventDefault();
    adjustQuantity(1);
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateQuantityText();
    updateRecipe(zacetnaKolicina);
    updateTime(zacetnaKolicina);
    document.getElementById('steviloOseb').value = zacetnaKolicina;
    renderNotes(opombe);
});