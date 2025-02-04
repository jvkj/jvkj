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

// Ingredients that should use milliliters instead of grams
//const sestavineMl = ['mleko', 'voda', 'olje']; // Add your milliliter ingredients here

// Function to update the displayed quantity in the h3 tag
function updateQuantityText() {
    const quantityElement = document.getElementById('naslovKolicina');
    if (quantityElement) {
        quantityElement.textContent = kolicina;
    }
}

// Function to handle singular, dual, and plural forms of quantities and ingredients
function adjustPlural(number, itemName) {
    const isQuantity = itemName in quantityPlurals;
    const plurals = isQuantity ? quantityPlurals[itemName] : foodPlurals[itemName];
    
    if (plurals) {
        if (number >= 1 && number <= 5) {
            return plurals[number - 1];
        } else {
            return plurals[4]; // Use the form for 5 or more
        }
    }
    return itemName; // If no specific plural form found, return singular form
}

// Function to distribute steps into two columns, maintaining sequence
function distributeSteps(steps) {
    const container1 = document.getElementById('recipeContainer1');
    const container2 = document.getElementById('recipeContainer2');
    if (!container1 || !container2) return;

    // Distribute steps evenly without considering content length
    let halfLength = Math.ceil(steps.length / 2);
    let leftColumn = steps.slice(0, halfLength);
    let rightColumn = steps.slice(halfLength);

    // Render steps into each container
    container1.innerHTML = leftColumn.map(s => `<p>${s}</p>`).join('');
    container2.innerHTML = rightColumn.map(s => `<p>${s}</p>`).join('');
}

// Function to update ingredient list and steps based on quantity
function updateRecipe(quantity) {
    const ingredientsList = document.getElementById('ingredientsList');
    if (!ingredientsList) return;

    let html = '';
    for (const [ingredient, grams] of Object.entries(sestavine)) {
        let adjustedQuantity = grams * quantity;
        let ingredientName = ingredient;
        let isQuantity = false;
        
        // Check if the ingredient starts with a known quantity term
        for (const quantityTerm of Object.keys(quantityPlurals)) {
            if (ingredient.startsWith(quantityTerm + ' ')) {
                isQuantity = true;
                const parts = ingredient.split(' ');
                const quantityType = parts[0];
                const actualIngredient = parts.slice(1).join(' '); // Handle multi-word ingredients
                let roundedQuantity = Math.max(1, Math.round(adjustedQuantity));
                
                let adjustedText = adjustPlural(roundedQuantity, quantityType);
                
                html += `<li><strong>${roundedQuantity}</strong> ${adjustedText} ${actualIngredient}</li>`;
                break;
            }
        }

        if (!isQuantity) {
            // Check if the ingredient is one of our special food items
            if (ingredient in foodPlurals) {
                let roundedQuantity = Math.max(1, Math.round(adjustedQuantity));
                let adjustedText = adjustPlural(roundedQuantity, ingredient);
                html += `<li><strong>${roundedQuantity}</strong> ${adjustedText}</li>`;
            } else {
                // Determine unit and format display
                let displayQuantity = Math.round(adjustedQuantity);
                let unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
                html += `<li><strong>${displayQuantity}</strong>${unit} ${ingredientName}</li>`;
            }
        }
    }
    ingredientsList.innerHTML = html;

    // Update the quantities in the recipe steps
    let steps = [];
    for (let i = 0; i < postopek.length; i++) {
        let step = postopek[i];
        for (const [ingredient, grams] of Object.entries(sestavine)) {
            let adjustedQuantity = (grams * quantity);
            let classname = ingredient.replace(/\s/g, '_');
            
            // Handle quantity-based ingredients
            if (ingredient.split(' ')[0] in quantityPlurals) {
                const parts = ingredient.split(' ');
                const quantityType = parts[0];
                const actualIngredient = parts.slice(1).join(' ');
                let roundedQuantity = Math.max(1, Math.round(adjustedQuantity));
                let adjustedText = adjustPlural(roundedQuantity, quantityType);
                
                step = step.replace(
                    new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g'),
                    `<strong>${roundedQuantity} ${adjustedText} ${actualIngredient}</strong>`
                );
            }
            // Handle food plural ingredients
            else if (ingredient in foodPlurals) {
                let roundedQuantity = Math.max(1, Math.round(adjustedQuantity));
                let adjustedText = adjustPlural(roundedQuantity, ingredient);
                step = step.replace(
                    new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g'),
                    `<strong>${roundedQuantity} ${adjustedText}</strong>`
                );
            }
            // Handle regular ingredients with ml/g
            else {
                let displayQuantity = Math.round(adjustedQuantity);
                let unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
                step = step.replace(
                    new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g'),
                    `<strong>${displayQuantity}${unit} ${ingredient}</strong>`
                );
            }
        }
        steps.push(step);
    }
    
    distributeSteps(steps);
}

// Function to handle quantity increase/decrease
function adjustQuantity(adjustment) {
    const quantityInput = document.getElementById('steviloOseb');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity = Math.max(1, currentQuantity + adjustment);
    quantityInput.value = currentQuantity;
    updateQuantityText();
}

// Function to calculate and display time based on quantity
function updateTime(quantity) {
    let cas1Total = cas1Adjust ? cas1 * quantity : cas1;
    let cas2Total = cas2Adjust ? cas2 * quantity : cas2;
    let cas3Total = cas3Adjust ? cas3 * quantity : cas3;
    
    const formatTime = (time) => {
        if (time === 0) return null;
        if (time >= 60) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
        }
        return `${time}min`;
    };

    cas1Total = formatTime(cas1Total);
    cas2Total = formatTime(cas2Total);
    cas3Total = formatTime(cas3Total);

    let skupniCas = (cas1Adjust ? cas1 * quantity : cas1) + 
                    (cas2Adjust ? cas2 * quantity : cas2) + 
                    (cas3Adjust ? cas3 * quantity : cas3);
    skupniCas = formatTime(skupniCas);

    const timeElement = document.getElementById('prepTime');
    if (timeElement) {
        let timeListItems = '';
        if (cas1Total !== null) timeListItems += `<li>${cas1Name}: <strong><em>${cas1Total}</em></strong></li>`;
        if (cas2Total !== null) timeListItems += `<li>${cas2Name}: <strong><em>${cas2Total}</em></strong></li>`;
        if (cas3Total !== null) timeListItems += `<li>${cas3Name}: <strong><em>${cas3Total}</em></strong></li>`;

        timeElement.innerHTML = `
            <h3><u>${skupniCasName}</u>: <strong><em>${skupniCas}</em></strong></h3>
            <ul class="alt">
                ${timeListItems}
            </ul>
        `;
    }
}

// Function for the calculate button
function multiplyBy() {
    const quantity = parseInt(document.getElementById('steviloOseb').value);
    updateRecipe(quantity);
    updateTime(quantity);
}

// Function to render notes, only if `opombe` is not "0"
function renderNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    if (notesContainer) {
        notesContainer.innerHTML = notes !== "0" 
            ? `<br><div class="box"><center>* - <em><u>${notes}</u></em></center></div>`
            : '';
    }
}

// Event listeners for buttons
document.getElementById('minusButton').addEventListener('click', function(e) {
    e.preventDefault();
    adjustQuantity(-1);
});

document.getElementById('plusButton').addEventListener('click', function(e) {
    e.preventDefault();
    adjustQuantity(1);
});

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function() {
    updateQuantityText();
    updateRecipe(zacetnaKolicina);
    updateTime(zacetnaKolicina);
    document.getElementById('steviloOseb').value = zacetnaKolicina;
    renderNotes(opombe);
});