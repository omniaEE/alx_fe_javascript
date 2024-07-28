let quotes = [];
let selectedCategory = "all";
const apiUrl = "https://jsonplaceholder.typicode.com/quotes"; // Replace with your mock API URL

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [];
        fetch(apiUrl)
           .then(response => response.json())
           .then(data => {
                quotes = data;
                saveQuotes();
            });
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

// Function to simulate periodic data fetching from the server
function syncData() {
    fetch(apiUrl)
       .then(response => response.json())
       .then(data => {
            const serverQuotes = data;
            const localQuotes = quotes;
            const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
            quotes = mergedQuotes;
            saveQuotes();
            notifyUser("Data synced successfully!");
        })
       .catch(error => {
            console.error("Error syncing data:", error);
            notifyUser("Error syncing data. Please try again later.");
        });
}

// Function to merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes];
    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(quote => quote.id === serverQuote.id);
        if (localQuote) {
            // Conflict resolution: server's data takes precedence
            mergedQuotes[mergedQuotes.indexOf(localQuote)] = serverQuote;
        } else {
            mergedQuotes.push(serverQuote);
        }
    });
    return mergedQuotes;
}

// Function to notify user of data sync or conflict resolution
function notifyUser(message) {
    const notificationElement = document.getElementById("notification");
    notificationElement.textContent = message;
    notificationElement.style.display = "block";
    setTimeout(() => {
        notificationElement.style.display = "none";
    }, 3000);
}

// Call loadQuotes when the page loads
window.onload = loadQuotes;

// Add event listener to category filter dropdown
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// Simulate periodic data fetching every 5 minutes
setInterval(syncData, 300000);
