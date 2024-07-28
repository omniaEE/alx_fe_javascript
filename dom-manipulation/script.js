let quotes = [];
let selectedCategory = "all";

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [
            { text: "Believe you can and you're halfway there.", category: "Inspirational" },
            { text: "The only way to do great work is to love what you do.", category: "Motivational" },
            { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
            // Add more quotes as needed
        ];
        saveQuotes();
    }
    populateCategories();
    restoreSelectedCategory();
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate categories
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
    `;
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.text = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";

    if (selectedCategory === "all") {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = randomQuote.text;
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.textContent = randomQuote.text;
    }
    saveSelectedCategory();
}

// Function to save selected category to local storage
function saveSelectedCategory() {
    localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
}

// Function to restore last selected category when the page loads
function restoreSelectedCategory() {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
        document.getElementById("categoryFilter").value = storedCategory;
        filterQuotes();
    }
}

// Call loadQuotes when the page loads
window.onload = loadQuotes;

// Add event listener to category filter dropdown
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
