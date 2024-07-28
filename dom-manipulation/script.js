// Define an array to store quote objects
let quotes = [
  { text: "Believe you can and you're halfway there.", category: "Inspirational" },
  { text: "The only way to do great work is to love what you do.", category: "Motivational" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
  // Add more quotes as needed
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>Category: ${quote.category}</p><p>Quote: ${quote.text}</p>`;
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
  showRandomQuote();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Initialize the application
createAddQuoteForm();
showRandomQuote();

// Add event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
