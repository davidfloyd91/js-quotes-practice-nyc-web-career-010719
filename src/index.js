const quotesUrl = "http://localhost:3000/quotes";
const quotesDiv = document.querySelector("#quote-list");
const newForm = document.querySelector("#new-quote-form");
const newQuote = newForm.querySelector("#new-quote");
const newAuthor = newForm.querySelector("#author");
const deleteButton = quotesDiv.querySelector(".btn-danger");
let everyQuote = [];

newForm.addEventListener("submit", e => {
  e.preventDefault();
  addQuote(newQuote.value, newAuthor.value);
});

quotesDiv.addEventListener("click", e => {
  let blockQuote = e.target.parentNode;
  if (!!(e.target.innerText.match(/Likes/))) {
    let quote = everyQuote.find(q => {
      return q.id == blockQuote.querySelector(".mb-0").id.slice(1);
    });
    likeQuote(quote);
  } else if (!!(e.target.innerText.match(/Delete/))) {
    let quote = everyQuote.find(q => {
      return q.id == blockQuote.querySelector(".mb-0").id.slice(1);
    });
    console.log(blockQuote.parentNode);
    wreckQuote(quote, blockQuote.parentNode);
  };
});

function displayQuotes(quotes) {
  quotes.forEach(q => {
    renderQuote(q);
  });
};

function getQuotes() {
  fetch(quotesUrl)
  .then(resp => resp.json())
  .then(allQuotes => {
    displayQuotes(allQuotes);
    allQuotes.forEach(q => {
      everyQuote.push(q);
    });
  })
};

function addQuote(quote, author) {
  fetch(quotesUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote: quote,
        likes: 0,
        author: author
      })
  })
  .then(response => response.json())
  .then(q => {
    renderQuote(q);
    everyQuote.push(q);
  })
};

function likeQuote(quote) {
  fetch(`${quotesUrl}/${quote.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
        likes: quote.likes + 1
      })
  })
  .then(response => response.json())
  .then(q => addALike(q))
  .then(quote.likes += 1)
};

function wreckQuote(quote, element) {
  fetch(`${quotesUrl}/${quote.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
  .then(q => wreckLocalQuote(q, element))
};

function addALike(quote) {
  likesButton = quotesDiv.querySelector(`#x${quote.id}`).parentNode.querySelector(".btn-success");
  likesButton.innerText = likesButton.innerText.replace(/(\d+)/, match => parseInt(match) + 1);
};

function wreckLocalQuote(quote, element) {
  element.innerHTML = "";
  element.style.display = "none";
  index = everyQuote.findIndex(i => i == quote);
  everyQuote.splice(index, 1);
  console.log(everyQuote);
};

function renderQuote(quote) {
  quotesDiv.innerHTML +=`
    <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0" id='x${quote.id}'>${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: ${quote.likes}</button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>
  `
};

getQuotes();
