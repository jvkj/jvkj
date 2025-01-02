// Function to generate the specified <li> structure
function generateSimpleMenuItems(menuItems) {
    const fragment = document.createDocumentFragment();

    menuItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="${item.href}">${item.label}</a>`;
        fragment.appendChild(listItem);
    });

    return fragment;
}

// Function to insert menu items into a specified <ul> container
function insertSimpleMenuItems(containerId, menuItems) {
    const container = document.getElementById(containerId);
    if (container) {
        const menuFragment = generateSimpleMenuItems(menuItems);
        container.appendChild(menuFragment);
    }
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
    const sladko = [
        { label: "Muffini - ČOKOLADNI", href: "#" },
        { label: "Palačinke - AMERIŠKE", href: "ameriske_palacinke.html" },
        { label: "Palačinke - NAVADNE", href: "#" },
    ];

    const piskoti = [
        { label: "Krhki piškoti", href: "#" },
        { label: "Skalce", href: "#" },
    ];
    
    const slano = [
        { label: "Lorem Dolor", href: "#" },
    ];

    const omake = [
        { label: "Tunina omaka", href: "#" },
        { label: "Zelenjavna omaka", href: "#" },
    ];
    
    const ostalo = [
        { label: "Liker - BANANIN", href: "#" },
        { label: "Liker - INGVERJEV", href: "#" },
    ];

    // Insert menu1 into the first <ul> container
    insertSimpleMenuItems("menu-sladko", sladko);

    // Insert menu2 into another <ul> container
    insertSimpleMenuItems("menu-piskoti", piskoti);

    // Insert menu3 into the first <ul> container
    insertSimpleMenuItems("menu-slano", slano);

    // Insert menu4 into another <ul> container
    insertSimpleMenuItems("menu-omake", omake);

    // Insert menu5 into the first <ul> container
    insertSimpleMenuItems("menu-ostalo", ostalo);
});