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



/ Function to post quotes to the server
async function postQuotesToServer(quotes) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes),
    });
    const serverResponse = await response.json();
    return serverResponse;
  } catch (error) {
    console.error("Error posting quotes to server:", error);
    return [];
  }
}

// Function to sync local quotes with server quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = quotes;
  const mergedQuotes = [...localQuotes];

  // Check for new quotes from the server
  serverQuotes.forEach(serverQuote => {
    const existingQuote = localQuotes.find(quote => quote.text === serverQuote.text);
    if (!existingQuote) {
      mergedQuotes.push(serverQuote);
    }
  });

  // Check for conflicts and resolve them
  mergedQuotes.forEach(quote => {
    const serverQuote = serverQuotes.find(serverQuote => serverQuote.text === quote.text);
    if (serverQuote && serverQuote.category!== quote.category) {
      // Conflict resolution: server's data takes precedence
      quote.category = serverQuote.category;
      console.log(`Conflict resolved: updated quote category to ${quote.category}`);
    }
  });

  // Update local storage and quotes array
  quotes = mergedQuotes;
  saveQuotes();

  // Notify user of updates or conflicts
  const notificationElement = document.getElementById("notification");
  notificationElement.innerHTML = `Quotes synced with server. ${mergedQuotes.length} quotes in total.`;
  if (mergedQuotes.some(quote => quote.conflictResolved)) {
    notificationElement.innerHTML += " Conflicts resolved.";
  }
}

let quotes = [];
let selectedCategory = "all";
const apiUrl = "https://jsonplaceholder.typicode.com/quotes"; // Replace with your mock API URL

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
// Initialize the application
loadQuotes();
createAddQuoteForm();
updateCategories();
loadLastSelectedFilter();
