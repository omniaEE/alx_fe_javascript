let quotes = [];
let selectedCategory = "all";
const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Replace with your mock API URL

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        quotes = [];
        fetchQuotesFromServer();
    }
    populateCategories();
    restoreSelectedCategory();
}

// Function to fetch quotes from server
function fetchQuotesFromServer() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
            quotes = data;
            saveQuotes();
            notifyUser("Data fetched from server successfully!");
        })
      .catch(error => {
            console.error("Error fetching data from server:", error);
            notifyUser("Error fetching data from server. Please try again later.");
        });
}

// Function to post quotes to server
function postQuoteToServer(quote) {
    fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(quote),
        headers: {
            "Content-Type": "application/json"
        }
    })
      .then(response => response.json())
      .then(data => {
            quotes.push(data);
            saveQuotes();
            notifyUser("Quote posted to server successfully!");
        })
      .catch(error => {
            console.error("Error posting quote to server:", error);
            notifyUser("Error posting quote to server. Please try again later.");
        });
}

// Function to sync quotes with server
function syncQuotes() {
    fetchQuotesFromServer();
    setTimeout(syncQuotes, 300000); // Sync every 5 minutes
}

// Function to update local storage with server data and conflict resolution
function updateLocalStorageWithServerData(serverQuotes) {
    const localQuotes = quotes;
    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
    quotes = mergedQuotes;
    saveQuotes();
    notifyUser("Data synced successfully!");
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

// Start syncing quotes with server
syncQuotes();
