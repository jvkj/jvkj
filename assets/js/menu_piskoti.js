// Menu items as an array of objects
const simpleMenuItems = [
    { label: "Skalce", href: "#" },
    { label: "Ipsum Adipiscing", href: "#" },
    { label: "Tempus Magna", href: "#" },
    { label: "Feugiat Veroeros", href: "#" }
];

// Function to generate the specified <li> structure
function generateSimpleMenuItems() {
    const fragment = document.createDocumentFragment();

    simpleMenuItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="${item.href}">${item.label}</a>`;
        fragment.appendChild(listItem);
    });

    return fragment;
}

// Insert the generated menu items into a container
function insertSimpleMenuItems(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const menuItems = generateSimpleMenuItems();
        container.appendChild(menuItems);
    }
}

// Initialize menu when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    insertSimpleMenuItems("menu-piskoti"); // Replace "menu-container" with your container's ID
});