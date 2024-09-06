import React, { useState, useEffect } from 'react';
import {
     fetchBooks,
     fetchGenre,
     fetchBookByGenre,
     fetchSortedBooks,
     fetchSearchedBook,
     addBook, updateBook,
     deleteManyBooks
} from '../services/api'; // Ensure these are correctly implemented
import { useDarkMode } from '../App'; // Import the useDarkMode hook

const LHome = () => {
     const [searchQuery, setSearchQuery] = useState('');

     const [books, setBooks] = useState([]);
     const [genres, setGenre] = useState([]);

     const [selectedGenre, setSelectedGenre] = useState('All');
     const [selectedSort, setSelectedSort] = useState('');

     const [selectedBooks, setSelectedBooks] = useState([]); // For multi-select

     const [showAddModal, setShowAddModal] = useState(false);
     const [showUpdateModal, setShowUpdateModal] = useState(false);

     const [bookToUpdate, setBookToUpdate] = useState(null);
     const { darkMode, toggleDarkMode } = useDarkMode(); // Use context


     const getAllBooks = () => {
          fetchBooks().then(setBooks).catch(error => {
               console.error('Error fetching books:', error);
               setBooks([]);  // Optionally handle errors by setting an empty array
          });
     }

     const getAllGenres = () => {
          fetchGenre().then(setGenre).catch(error => {
               console.error('Error fetching genres:', error);
               setGenre([]);
               console.log(genres)// Optionally handle errors by setting an empty array
          });
     }

     useEffect(() => {
          getAllBooks();
          getAllGenres();
     }, []);

     const handleSearch = async (query) => {
          setSearchQuery(query);

          if (!query) {
               getAllBooks();
          }
          else { // Fetch books by the selected genre
               const booksSearch = await fetchSearchedBook(query);
               if (booksSearch) {
                    setBooks(booksSearch);
               } else { 
                    getAllBooks();
               }
          }


     };

     const handleGenreClick = async (genre) => {
          setSelectedGenre(genre);

          if (genre === 'All') {
               // Fetch all books if "All of them" is selected
               const allBooks = await fetchBooks();
               setBooks(allBooks);
          } else {
               // Fetch books by the selected genre
               const booksByGenre = await fetchBookByGenre(genre);
               setBooks(booksByGenre);
          }
     };

     const handleSortClick = async (sortBy) => {
          setSelectedSort(sortBy);

          // Fetch books by the selected genre
          const booksSort = await fetchSortedBooks(selectedGenre, sortBy, "desc");
          setBooks(booksSort);

     };

     const handleBookClick = (book) => {
          setSelectedBooks(prevSelectedBooks =>
               prevSelectedBooks.includes(book._id)
                    ? prevSelectedBooks.filter(id => id !== book._id)
                    : [...prevSelectedBooks, book._id]
          );
     };

     const handleDeleteBooks = () => {
          if (window.confirm('Are you sure you want to delete the selected books?')) {
               deleteManyBooks(selectedBooks)
                    .then(() => {
                         // Update the state by filtering out the deleted books
                         setBooks(prevBooks => prevBooks.filter(book => !selectedBooks.includes(book._id)));

                         // Clear the selected books
                         setSelectedBooks([]);

                         // Optionally, fetch all books again to ensure the UI is up-to-date
                         if (!selectedGenre) { getAllBooks(); }
                         else { handleGenreClick(selectedGenre) }
                    })
                    .catch(error => {
                         console.error('Error deleting books:', error);
                    });
          }
     };

     const handleAddBook = (newBook) => {
          addBook(newBook).then((addedBook) => {
               setBooks(prevBooks => [...prevBooks, addedBook]);
               setShowAddModal(false);
               if (!selectedGenre) { getAllBooks(); }
               else { handleGenreClick(selectedGenre) }
          }).catch(error => {
               console.error('Error adding book:', error);
          });
     };

     const handleUpdateBook = (updatedBook) => {
          updateBook(updatedBook).then((book) => {
               setBooks(prevBooks => prevBooks.map(b => b._id === book._id ? book : b));
               setShowUpdateModal(false);
               setBookToUpdate(null);
               if (!selectedGenre) { getAllBooks(); }
               else { handleGenreClick(selectedGenre) }
          }).catch(error => {
               console.error('Error updating book:', error);
          });
     };

     return (
          <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : ''}`}>
               {/* Navigation Menu */}
               <nav className="bg-gray-800 text-white p-4">
                    <div className="container mx-auto flex justify-between items-center">
                         <div className="text-lg font-bold">BookStore</div>
                         <div className="flex flex-grow justify-center">
                              <input
                                   type="text"
                                   placeholder="Search books..."
                                   value={searchQuery}
                                   onChange={(e) => handleSearch(e.target.value)}
                                   className="border border-gray-300 dark:border-gray-600 rounded p-2 w-1/2 bg-transparent dark:text-white text-sm"
                              />
                         </div>
                         <button
                              onClick={toggleDarkMode}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                         >
                              {darkMode ? 'Light Mode' : 'Dark Mode'}
                         </button>
                    </div>
               </nav>

               <main className="flex-1 p-6">
                    <div className="container mx-auto">
                         {/* Filter and Sort */}
                         <div className="flex flex-col md:flex-row md:justify-between mb-6">

                              <div className="flex items-center space-x-4 mb-4 md:mb-0">

                                   <select
                                        value={selectedGenre}
                                        onChange={(e) => handleGenreClick(e.target.value)}  // Use a callback function
                                        className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-transparent dark:text-white text-sm"
                                   >
                                        <option // Add a key prop
                                             value={"All"}  // Use the genre as the value
                                             className="bg-white dark:bg-gray-900 text-black dark:text-white"
                                        >
                                             ALL OF THEM
                                        </option>
                                        {genres.map((genre, index) => (
                                             <option
                                                  key={index}  // Add a key prop
                                                  value={genre}  // Use the genre as the value
                                                  className="bg-white dark:bg-gray-900 text-black dark:text-white"
                                             >
                                                  {genre}
                                             </option>

                                        ))}
                                   </select>

                                   {<select
                                        value={selectedSort}
                                        onChange={(e) => handleSortClick(e.target.value)}
                                        className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-transparent dark:text-white text-sm"
                                   >
                                        <option value="title" className='bg-white dark:bg-gray-900 text-black dark:text-white'>Sort by Title</option>
                                        <option value="date" className='bg-white dark:bg-gray-900 text-black dark:text-white'>Sort by Date</option>
                                   </select>}
                                   <button
                                        onClick={() => setShowAddModal(true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                   >
                                        Add Book
                                   </button>
                                   <button
                                        onClick={handleDeleteBooks}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                        disabled={selectedBooks.length === 0}
                                   >
                                        Delete Selected
                                   </button>
                              </div>
                         </div>

                         {/* Books Grid */}
                         <section>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                   {books.length > 0 ? (
                                        books.map((book) =>
                                             <div
                                                  key={book._id}
                                                  className={`relative cursor-pointer ${selectedBooks.includes(book._id) ? 'border-4 border-blue-500' : ''}`}
                                                  onClick={() => handleBookClick(book)}
                                             >
                                                  <img
                                                       src={book.coverImage}
                                                       alt={book.title}
                                                       className="w-full h-full rounded-lg shadow-lg object-cover"
                                                  />
                                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
                                                       {book.title}
                                                  </div>
                                                  <button
                                                       onClick={(e) => {
                                                            e.stopPropagation(); // Prevent triggering selection
                                                            setBookToUpdate(book);
                                                            setShowUpdateModal(true);
                                                       }}
                                                       className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                                  >
                                                       Edit
                                                  </button>
                                             </div>)
                                   ) : (
                                        <li>No books available for this genre</li>
                                   )}
                              </div>
                         </section>
                    </div>
               </main>

               <footer className="bg-gray-800 text-white p-4 text-center">
                    <p>&copy; 2023 BookStore. All rights reserved.</p>
               </footer>

               {/* Add Book Modal */}
               {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 text-sm">
                         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-6 max-h-screen overflow-y-auto">
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 ">Add New Book</h2>
                              <form
                                   onSubmit={(e) => {
                                        e.preventDefault();
                                        const newBook = {
                                             title: e.target.title.value,
                                             author: e.target.author.value,
                                             genre: e.target.genre.value,
                                             publicationYear: e.target.publicationYear.value,
                                             coverImage: e.target.coverImage.value,
                                             description: e.target.description.value,
                                             availability: e.target.availability.value,
                                             isbn: e.target.isbn.value,
                                        };
                                        handleAddBook(newBook);
                                   }}
                              >
                                   <div className="grid grid-cols-2 gap-2">
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Title</label>
                                             <input
                                                  type="text"
                                                  name="title"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Author</label>
                                             <input
                                                  type="text"
                                                  name="author"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Genre</label>
                                             <input
                                                  type="text"
                                                  name="genre"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Publication Year</label>
                                             <input
                                                  type="number"
                                                  name="publicationYear"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Cover Image URL</label>
                                             <input
                                                  type="url"
                                                  name="coverImage"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">ISBN</label>
                                             <input
                                                  type="text"
                                                  name="isbn"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="col-span-2 mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Description</label>
                                             <textarea
                                                  name="description"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full h-24 focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             ></textarea>
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Availability</label>
                                             <select
                                                  name="availability"
                                                  className="border border-gray-300 dark:border-gray-400 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             >
                                                  <option value="In Stock" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">In Stock</option>
                                                  <option value="Out of Stock" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Out of Stock</option>
                                             </select>
                                        </div>

                                        <div className="flex justify-end space-x-4 mt-4">
                                             <button
                                                  type="submit"
                                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 "
                                             >
                                                  Add Book
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => setShowAddModal(false)}
                                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:ring focus:ring-gray-500 focus:outline-none transition duration-300"
                                             >
                                                  Cancel
                                             </button>
                                        </div>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}




               {/* Update Book Modal */}
               {showUpdateModal && bookToUpdate && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 text-sm">
                         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl mx-6 max-h-screen overflow-y-auto">
                              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Update Book</h2>
                              <form
                                   onSubmit={(e) => {
                                        e.preventDefault();
                                        const updatedBook = {
                                             _id: bookToUpdate._id,
                                             title: e.target.title.value,
                                             author: e.target.author.value,
                                             genre: e.target.genre.value,
                                             publicationYear: e.target.publicationYear.value,
                                             coverImage: e.target.coverImage.value,
                                             description: e.target.description.value,
                                             availability: e.target.availability.value,
                                             isbn: e.target.isbn.value,
                                        };
                                        handleUpdateBook(updatedBook);
                                   }}
                              >
                                   <div className="grid grid-cols-2 gap-2">
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium ">Title</label>
                                             <input
                                                  type="text"
                                                  name="title"
                                                  defaultValue={bookToUpdate.title}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Author</label>
                                             <input
                                                  type="text"
                                                  name="author"
                                                  defaultValue={bookToUpdate.author}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Genre</label>
                                             <input
                                                  type="text"
                                                  name="genre"
                                                  defaultValue={bookToUpdate.genre}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Publication Year</label>
                                             <input
                                                  type="number"
                                                  name="publicationYear"
                                                  defaultValue={bookToUpdate.publicationYear}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Cover Image URL</label>
                                             <input
                                                  type="url"
                                                  name="coverImage"
                                                  defaultValue={bookToUpdate.coverImage}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">ISBN</label>
                                             <input
                                                  type="text"
                                                  name="isbn"
                                                  defaultValue={bookToUpdate.isbn}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             />
                                        </div>
                                        <div className="col-span-2 mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Description</label>
                                             <textarea
                                                  name="description"
                                                  defaultValue={bookToUpdate.description}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full h-24 focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             ></textarea>
                                        </div>
                                        <div className="mb-2">
                                             <label className="block text-gray-600 dark:text-gray-300 mb-1 text-sm font-medium">Availability</label>
                                             <select
                                                  name="availability"
                                                  defaultValue={bookToUpdate.availability}
                                                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:ring focus:ring-blue-500 focus:outline-none transition duration-300 bg-transparent dark:text-white"
                                                  required
                                             >
                                                  <option value="In Stock" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">In Stock</option>
                                                  <option value="Out of Stock" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Out of Stock</option>
                                             </select>
                                        </div>
                                        <div className="flex justify-end space-x-4 mt-4">
                                             <button
                                                  type="submit"
                                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-500 focus:outline-none transition duration-300"
                                             >
                                                  Update Book
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => setShowUpdateModal(false)}
                                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:ring focus:ring-gray-500 focus:outline-none transition duration-300"
                                             >
                                                  Cancel
                                             </button>
                                        </div>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default LHome;
