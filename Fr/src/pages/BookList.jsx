import React, { useState, useEffect } from 'react';
import { fetchBooks, fetchGenre, fetchBookByGenre } from '../services/api';// Assuming you import the API methods here

const BookList = () => {
  const [genres, setGenres] = useState([]); // Store the list of genres
  const [books, setBooks] = useState([]);   // Store the list of books based on the selected genre
  const [selectedGenre, setSelectedGenre] = useState(''); // Store the currently selected genre

  const getAllBooks = () => {
    fetchBooks().then(setBooks).catch(error => {
      console.error('Error fetching books:', error);
      setBooks([]);  // Optionally handle errors by setting an empty array
    });
  }

  // Fetch genres when the component mounts
  useEffect(() => {
    getAllBooks();
    const loadGenres = async () => {
      const genreData = await fetchGenre();
      setGenres(genreData);
    };
    loadGenres();
  }, []);

  // Fetch books by selected genre when a genre is clicked
  const handleGenreClick = async (genre) => {
    setSelectedGenre(genre);
    const booksData = await fetchBookByGenre(genre); // Fetch books from the API based on genre
    setBooks(booksData); // Update the books state with the fetched books
  };

  return (
    <div>
      <h2>Genres</h2>
      <ul>
        <li><button onClick={() => getAllBooks()}>All Books</button></li>
        {genres.map((genre) => (
              <li key={genre}>
                <button onClick={() => handleGenreClick(genre)}>{genre}</button>
              </li>
        ))}
            
          </ul >

      <h2>Books in {selectedGenre} Genre</h2>
      <ul>
        {books.length > 0 ? (
          books.map((book) => <li key={book.id}>{book.title}</li>)
        ) : (
          <li>No books available for this genre</li>
        )}
      </ul>
    </div>
  );
};

export default BookList;