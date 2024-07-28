// Define an array to store quote objects
let quotes = [];

// Simulate server interaction using JSONPlaceholder API
const apiUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiUrl);
    const serverQuotes = await response.json();
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Function to post quotes to the server
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

// Function to periodically fetch and sync quotes
setInterval(syncQuotes, 30000); // Sync every 30 seconds

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
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Initialize the application
loadQuotes();
createAddQuoteForm();
updateCategories();
loadLastSelectedFilter();
