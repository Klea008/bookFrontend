const API_BASE_URL = 'https://db-book.vercel.app';

export const fetchBooks = async () => {
     const response = await fetch(`${API_BASE_URL}/all-books`);
     const data = await response.json();
     return data.books;  // Access the books array directly
};

export const fetchBookById = async (id) => {
     const response = await fetch(`${API_BASE_URL}/book/${id}`);
     const data = await response.json();
     return data.book;
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