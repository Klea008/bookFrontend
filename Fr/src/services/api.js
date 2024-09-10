const API_BASE_URL = 'https://db-book.vercel.app';

export const fetchBooks = async () => {
     const response = await fetch(`${API_BASE_URL}/all-books`);
     const data = await response.json();
     return data.books;  // Access the books array directly
};

export const fetchGenre= async () => {
     const response = await fetch(`${API_BASE_URL}/genres/`);
     const data = await response.json();
     return data.genres;  // Access the books array directly
}

export const fetchBookByGenre = async (genre) => {
     const response = await fetch(`${API_BASE_URL}/booksByGenre/?genre=${genre}`);
     const data = await response.json();
     return data.books;  
}

export const fetchLimitBookByGenre = async (genre, page = 1, limit = 10) => {
     try {
          const response = await fetch(`${API_BASE_URL}/bookbyGenreLimit/?genre=${genre}&page=${page}&limit=${limit}`);

          if (!response.ok) {
               throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();

          // Ensure the API response includes pagination info
          return {
               books: data.books,
               totalPages: data.pagination.totalPages // Assuming your API returns this
          };

     } catch (error) {
          console.error("Failed to fetch books:", error);
          // Handle error appropriately, e.g., show an error message to the user
          return { books: [], totalPages: 0 };  // Returning empty array and zero pages on error
     }
};

export const fetchLimitBooks = async (page = 1, limit = 10) => {
     try {
          const response = await fetch(`${API_BASE_URL}/limited-books?page=${page}&limit=${limit}`);

          if (!response.ok) {
               throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();

          // Ensure the API response includes pagination info
          return {
               books: data.books,
               totalPages: data.pagination.totalPages // Assuming your API returns this
          };

     } catch (error) {
          console.error("Failed to fetch books:", error);
          // Handle error appropriately, e.g., show an error message to the user
          return { books: [], totalPages: 0 };  // Returning empty array and zero pages on error
     }
};

export const fetchLimitSortedBooks = async (page = 1, limit = 10, genre, sortBy, order) => {
     try {
          const response = await fetch(`${API_BASE_URL}/bookSortLimit/?limit=${limit}&page=${page}&sortBy=${sortBy}&order=${order}&genre=${genre}`);

          if (!response.ok) {
               throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();

          // Ensure the API response includes pagination info
          return {
               books: data.books,
               totalPages: data.pagination.totalPages // Assuming your API returns this
          };

     } catch (error) {
          console.error("Failed to fetch books:", error);
          // Handle error appropriately, e.g., show an error message to the user
          return { books: [], totalPages: 0 };  // Returning empty array and zero pages on error
     }
};

export const fetchBookById = async (id) => {
     const response = await fetch(`${API_BASE_URL}/book/${id}`);
     const data = await response.json();
     return data.book;
};

export const fetchSortedBooks = async (genre, sortBy, order) => {
     const response = await fetch(`${API_BASE_URL}/bookSort?sortBy=${sortBy}&order=${order}&genre=${genre}`);
     const data = await response.json();

     console.log(data.books); 
     return data.books;
};

export const fetchSearchedBook = async (searchQuery) => {
     const response = await fetch(`${API_BASE_URL}/bookSearch/?query=${searchQuery}`);
     const data = await response.json();

     console.log(data.books);
     return data.books;
};

export const addBook = async (newBook) => {
     console.log(JSON.stringify(newBook))
     const response = await fetch(`${API_BASE_URL}/add-book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBook),
     });
     if (!response.ok) throw new Error('Failed to add book');
     const data = await response.json();
     console.log(data.message)
     return data;
};

export const updateBook = async (updatedBook) => {
     console.log(JSON.stringify(updatedBook))
     const response = await fetch(`${API_BASE_URL}/update-book/${updatedBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBook),
     });
     if (!response.ok) throw new Error('Failed to update book');
     const data = await response.json();
     console.log(data.message)
     return data;
};

export const deleteBooks = async (bookIds) => {
     const response = await fetch(`${API_BASE_URL}/delete-book/${bookIds}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
     });
     if (!response.ok) throw new Error('Failed to delete books');
     const data = await response.json();
     console.log(data.message)
     return data;
};

export const deleteManyBooks = async (bookIds) => {
     console.log(bookIds);
     const response = await fetch(`${API_BASE_URL}/delete-books`, {
          method: 'DELETE',
          headers: {
               'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: bookIds }), // Send the array of selected book IDs
     });

     if (!response.ok) throw new Error('Failed to delete books');

     const data = await response.json();
     console.log(data.message);
     return data;
};