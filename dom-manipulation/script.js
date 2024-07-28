// Define an array to store quote objects
let quotes = [];

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

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>Category: ${quote.category}</p><p>Quote: ${quote.text}</p>`;
  // Save the last viewed quote to session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Function to create and add a new quote form
function createAddQuoteForm() {
  const addQuoteForm = document.createElement("div");
  addQuoteForm.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(addQuoteForm);
}

// Function to add a new quote to the quotes array and update the DOM
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  updateCategories();
  showRandomQuote();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Function to update the categories in the dropdown menu
function updateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `<p>Category: ${quote.category}</p><p>Quote: ${quote.text}</p>`;
    quoteDisplay.appendChild(quoteElement);
  });
  // Save the last selected filter to local storage
  localStorage.setItem("lastSelectedFilter", selectedCategory);
}

// Function to load the last selected filter from local storage
function loadLastSelectedFilter() {
  const lastSelectedFilter = localStorage.getItem("lastSelectedFilter");
  if (lastSelectedFilter) {
    document.getElementById("categoryFilter").value = lastSelectedFilter;
    filterQuotes();
  }
}

// Initialize the application
loadQuotes();
createAddQuoteForm();
updateCategories();
loadLastSelectedFilter();

// Add event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add event listener to the "Export to JSON" button
document.getElementById("exportToJson").addEventListener("click", exportToJson);

// Add event listener to the file input for importing quotes
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
