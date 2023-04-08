const API_KEY ='AIzaSyDEFDvcvVdgYvlc-j6x3YUBCkxHyc-H5h4';
const list=document.getElementById("result");
let favorites = [];
let currentPage = 1;
let maxResults=4;
let currentQuery = '';




  async  function searchBooks(query){
    const startIndex = (currentPage - 1) * maxResults;
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=AIzaSyDEFDvcvVdgYvlc-j6x3YUBCkxHyc-H5h4`)  
          .then(response => response.json())
          .then(data => {
            list.innerHTML ='';
            if (data.items !== undefined && data.items !== null) {
              displayResults(data.items, data.totalItems);
              console.log(data.items)
            }
          });
  }
  function selectChoice(){
    
    var searchT = document.getElementById("search-by");
    var searchType = searchT.value;
    var searchTerm = document.getElementById('search-term').value;
    if (searchTerm === '') {
      displayError();
      return;
    }
    let query='';
    if (searchType === 'title') {
      query+= `intitle:${searchTerm}`;
    } else if (searchType === 'author') {
      query+= `inauthor:${searchTerm}`;
    }
    currentQuery=query;
    searchBooks(query);
  }
  function displayError() {
    alert("search term can not be empty!")
  }
  function addToFavorites(book) {
    favorites.push(book);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  if (localStorage.getItem('favorites')) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
  }





  function displayResults(results, totalItems) {
  list.innerHTML = '';

  results.forEach((item) => {
    const li = document.createElement('li');
               
                const title = item.volumeInfo.title;
                const author = item.volumeInfo.authors?.[0] || 'Unknown author';
                const img = item.volumeInfo.imageLinks?.thumbnail;
                const link = item.volumeInfo.previewLink;
                
                li.innerHTML = `
                <div class="book">
                  <img src="${img}" onclick="window.open('${item.volumeInfo.infoLink}', '_blank');" >
                  <div class="more" style="align:left;">
                    <p class="title" >the title : <br> ${title}</p>
                    <a href="${link}" target="_blank" class="link">Read the book</a>
                    <p class="author">the author : <br> ${author}</p>
                    <button class="favorite-button">Add to Favorites</button>
                  </div>
                </div>
                  
                `;
                const bookContainer = li.querySelector('.book');
                const addToFavoritesButton = bookContainer.querySelector('.favorite-button');
                addToFavoritesButton.classList.add('favorite-button');
                addToFavoritesButton.addEventListener('click', () => {
                  addToFavorites(item);
                  addToFavoritesButton.innerHTML = '<i class="fa-solid fa-heart icon" style="color: #f90101;"></i>';
                });

                list.appendChild(li);
                console.log(li);
                bookContainer.appendChild(addToFavoritesButton);
                list.appendChild(bookContainer); 
  });

  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  
  const prevButton = document.createElement('button');
  prevButton.classList.add('btnn');
  prevButton.innerText = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    currentPage--;
    searchBooks(currentQuery);
  });
  pagination.appendChild(prevButton);

  const pageText = document.createElement('span');
  pageText.innerText = `Page ${currentPage} of ${Math.ceil(totalItems / maxResults)}`;
  pagination.appendChild(pageText);

  const nextButton = document.createElement('button');
  nextButton.classList.add('btnn');
  nextButton.innerText = 'Next';
  nextButton.disabled = currentPage === Math.ceil(totalItems / maxResults);
  nextButton.addEventListener('click', () => {
    currentPage++;
    searchBooks(currentQuery);
  });
  pagination.appendChild(nextButton);

  list.appendChild(pagination);
}