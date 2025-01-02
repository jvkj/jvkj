// Initialize page content
function inputParameters() {
    document.getElementById("naslovRecepta").textContent = naslov;
    document.getElementById("naslovKolicina").textContent = kolicina;
    document.getElementById("naslovStrani").textContent = `${naslov} - ${stran}`;
    document.getElementById("prepTime").textContent = `${prep}″`;
    
document.getElementById("foto").innerHTML = `<img src="../images/${photo}" alt="">`;
    
}

// Populate and update ingredients list and recipe section
function populateIngredientsAndRecipe(osebe) {
    const ingredientsList = document.getElementById("ingredientsList");
    ingredientsList.innerHTML = ""; // Clear existing list

    for (const key in ingredients) {
        const multiplier = ingredients[key];
        const value = Math.ceil(osebe * multiplier);

        // Add ingredient to the list
        const listItem = document.createElement("li");
        if (key === "jajce") {
            const { quantity, name } = formatEggs(value);
            listItem.innerHTML = `<strong>${quantity}</strong> ${name}`;
            updateRecipeValues(key, quantity, name); // Update recipe section for eggs
        } else {
            listItem.innerHTML = `<strong>${value}g</strong> ${key}`;
            updateRecipeValues(key, value); // Update recipe section for other ingredients
        }
        ingredientsList.appendChild(listItem);
    }
}

// Update recipe section with second ingredient constants
function updateRecipeValues(key, value, name = null) {
    const normalizedKey = key.replace(/\s+/g, "_"); // Normalize keys with spaces
    const keyElement = document.getElementById(normalizedKey); // Handle main ingredient (e.g., pecilnega_praška)
    const key2Element = document.getElementById(`${normalizedKey}2`); // Handle secondary ingredient in the recipe section

    if (name) {
        // Handle eggs (jajce) specifically
        if (keyElement) {
            keyElement.textContent = `${value} ${name}`;
        }
        const quantityElement = document.getElementById(`${normalizedKey}2Quantity`);
        const nameElement = document.getElementById(`${normalizedKey}2Name`);
        if (quantityElement && nameElement) {
            quantityElement.textContent = value;
            nameElement.textContent = name;
        }
    } else {
        // Handle other ingredients
        if (keyElement) {
            keyElement.textContent = `${value}g`;
        }
        if (key2Element) {
            key2Element.textContent = `${value}g`;
        }
    }
}

// Calculate and update ingredient quantities
function multiplyBy() {
    const osebe = parseFloat(document.getElementById("steviloOseb").value) || 1;
    populateIngredientsAndRecipe(osebe);
}

// Format eggs quantity and name
function formatEggs(quantity) {
    if (quantity === 1) return { quantity: "1", name: "jajce" };
    if (quantity === 2) return { quantity: "2", name: "jajci" };
    if (quantity === 3 || quantity === 4) return { quantity: `${quantity}`, name: "jajca" };
    return { quantity: `${quantity}`, name: "jajc" };
}

// Handle increment and decrement buttons
function setupIncrementDecrement() {
    const minusButton = document.querySelector(".fa-caret-down");
    const plusButton = document.querySelector(".fa-caret-up");
    const numberInput = document.getElementById("steviloOseb");

    minusButton.addEventListener("click", (event) => {
        event.preventDefault();
        let currentValue = parseInt(numberInput.value, 10) || 1;
        if (currentValue > 1) {
            numberInput.value = currentValue - 1;
           // multiplyBy(); // Update dynamically
        }
    });

    plusButton.addEventListener("click", (event) => {
        event.preventDefault();
        let currentValue = parseInt(numberInput.value, 10) || 0;
        numberInput.value = currentValue + 1;
        //multiplyBy(); // Update dynamically
    });
}

// Initialize the page
function init() {
    inputParameters();
    setupIncrementDecrement();
    multiplyBy();
//    foto();
}


// Run init when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);