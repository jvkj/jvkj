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

// Helper function to format numbers
function formatDecimal(number) {
    return Number.isInteger(number) ? 
        number.toString() : 
        parseFloat(number.toFixed(1)).toString();
}

// Function to update the displayed quantity in the h3 tag
function updateQuantityText() {
    const quantityElement = document.getElementById('naslovKolicina');
    if (quantityElement) {
        quantityElement.textContent = kolicina;
    }
}

// Function to handle plural forms with decimal support
function adjustPlural(number, itemName) {
    const isQuantity = itemName in quantityPlurals;
    const plurals = isQuantity ? quantityPlurals[itemName] : foodPlurals[itemName];
    
    if (plurals) {
        // Handle decimal values for quantity terms
        if (isQuantity && !Number.isInteger(number)) {
            return plurals[4];
        }
        
        const integerValue = Math.floor(number);
        if (integerValue >= 1 && integerValue <= 5) {
            return plurals[integerValue - 1];
        }
        return plurals[4];
    }
    return itemName;
}

// Function to distribute steps into two columns
function distributeSteps(steps) {
    const container1 = document.getElementById('recipeContainer1');
    const container2 = document.getElementById('recipeContainer2');
    if (!container1 || !container2) return;

    const halfLength = Math.ceil(steps.length / 2);
    const leftColumn = steps.slice(0, halfLength);
    const rightColumn = steps.slice(halfLength);

    container1.innerHTML = leftColumn.map(s => `<p>${s}</p>`).join('');
    container2.innerHTML = rightColumn.map(s => `<p>${s}</p>`).join('');
}

// Main recipe update function
function updateRecipe(quantity) {
    const ingredientsList = document.getElementById('ingredientsList');
    if (!ingredientsList) return;

    let html = '';
    for (const [ingredient, grams] of Object.entries(sestavine)) {
        const isDecimal = sestavineDecimal.includes(ingredient);
        const adjustedQuantity = grams * quantity;
        let displayQuantity = isDecimal ? 
            parseFloat(adjustedQuantity.toFixed(1)) : 
            Math.round(adjustedQuantity);
        
        let isQuantityTerm = false;
        
        // Handle quantity-based ingredients
        for (const quantityTerm of Object.keys(quantityPlurals)) {
            if (ingredient.startsWith(quantityTerm + ' ')) {
                isQuantityTerm = true;
                const parts = ingredient.split(' ');
                const quantityType = parts[0];
                const actualIngredient = parts.slice(1).join(' ');
                
                const formattedQuantity = formatDecimal(displayQuantity);
                const adjustedText = adjustPlural(displayQuantity, quantityType);
                html += `<li><strong>${formattedQuantity}</strong> ${adjustedText} ${actualIngredient}</li>`;
                break;
            }
        }

        if (!isQuantityTerm) {
            const formattedQuantity = formatDecimal(displayQuantity);
            
            if (ingredient in foodPlurals) {
                const adjustedText = adjustPlural(displayQuantity, ingredient);
                html += `<li><strong>${formattedQuantity}</strong> ${adjustedText}</li>`;
            } else {
                const unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
                html += `<li><strong>${formattedQuantity}</strong>${unit} ${ingredient}</li>`;
            }
        }
    }
    ingredientsList.innerHTML = html;

    // Update recipe steps
    let steps = [];
    for (let step of postopek) {
        for (const [ingredient, grams] of Object.entries(sestavine)) {
            const classname = ingredient.replace(/\s/g, '_');
            const isDecimal = sestavineDecimal.includes(ingredient);
            let adjustedQuantity = grams * quantity;
            let displayValue = isDecimal ? 
                parseFloat(adjustedQuantity.toFixed(1)) : 
                Math.round(adjustedQuantity);
            
            const formattedQuantity = formatDecimal(displayValue);

            if (ingredient.split(' ')[0] in quantityPlurals) {
                const parts = ingredient.split(' ');
                const quantityType = parts[0];
                const actualIngredient = parts.slice(1).join(' ');
                const adjustedText = adjustPlural(displayValue, quantityType);
                
                step = step.replace(
                    new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g'),
                    `<strong>${formattedQuantity} ${adjustedText} ${actualIngredient}</strong>`
                );
            } else if (ingredient in foodPlurals) {
                const adjustedText = adjustPlural(displayValue, ingredient);
                step = step.replace(
                    new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g'),
                    `<strong>${formattedQuantity} ${adjustedText}</strong>`
                );
            } else {
                const unit = sestavineMl.includes(ingredient) ? 'ml' : 'g';
                step = step.replace(
                    new RegExp(`<strong class="ingredient-quantity ${classname}">([^<]+)<\/strong>`, 'g'),
                    `<strong>${formattedQuantity}${unit} ${ingredient}</strong>`
                );
            }
        }
        steps.push(step);
    }
    distributeSteps(steps);
}

// Quantity adjustment functions
function adjustQuantity(adjustment) {
    const quantityInput = document.getElementById('steviloOseb');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity = Math.max(1, currentQuantity + adjustment);
    quantityInput.value = currentQuantity;
    updateQuantityText();
}

// Time calculation function
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

// Calculation trigger
function multiplyBy() {
    const quantity = parseInt(document.getElementById('steviloOseb').value);
    updateRecipe(quantity);
    updateTime(quantity);
}

// Notes rendering
function renderNotes(notes) {
    const notesContainer = document.getElementById('notesContainer');
    if (notesContainer) {
        notesContainer.innerHTML = notes !== "0" 
            ? `<br><div class="box"><center>* - <em><u>${notes}</u></em></center></div>`
            : '';
    }
}

// Event listeners
document.getElementById('minusButton').addEventListener('click', function(e) {
    e.preventDefault();
    adjustQuantity(-1);
});

document.getElementById('plusButton').addEventListener('click', function(e) {
    e.preventDefault();
    adjustQuantity(1);
});

// Initial setup
document.addEventListener('DOMContentLoaded', function() {
    updateQuantityText();
    updateRecipe(zacetnaKolicina);
    updateTime(zacetnaKolicina);
    document.getElementById('steviloOseb').value = zacetnaKolicina;
    renderNotes(opombe);
});