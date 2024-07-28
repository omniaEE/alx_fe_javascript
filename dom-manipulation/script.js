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
    const quoteList = document.getElementById("quoteDisplay");
    quoteList.innerHTML = "";

    if (selectedCategory === "all") {
        quotes.forEach(quote => {
            const quoteElement = document.createElement("li");
            quoteElement.innerHTML = quote.text;
            quoteList.appendChild(quoteElement);
        });
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        filteredQuotes.forEach(quote => {
            const quoteElement = document.createElement("li");
            quoteElement.innerHTML = quote.text;
            quoteList.appendChild(quoteElement);
        });
    }
    saveSelectedCategory();
}

// Function to save selected category to local storage
function saveSelectedCategory() {
    localStorage.setItem("selectedCategory", selectedCategory);
}

// Function to restore last selected category when the page loads
function restoreSelectedCategory() {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
        selectedCategory = storedCategory;
        document.getElementById("categoryFilter").value = selectedCategory;
        filterQuotes();
    }
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }
}

// Function to export quotes to JSON file
function exportQuotes() {
    const quotesJson = JSON.stringify(quotes);
    const blob = new Blob([quotesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const
