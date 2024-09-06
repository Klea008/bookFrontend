import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


// Function to fetch books from API with pagination
export const fetchBooks = async (page = 1, limit = 10) => {
     try {
          const response = await fetch(`http://localhost:3000/limited-books?page=${page}&limit=${limit}`);

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

const PaginatedBooks = () => {
     const [books, setBooks] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
     const [limit] = useState(3); // Number of books per page
     const [loading, setLoading] = useState(false);

     const getBooks = async (page) => {
          setLoading(true);
          try {
               const data = await fetchBooks(page, limit);
               setBooks(data.books);
               setTotalPages(data.totalPages);
          } catch (error) {
               console.error('Error fetching books:', error);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          getBooks(currentPage);
     }, [currentPage]);

     const handlePageChange = (page) => {
          if (page > 0 && page <= totalPages) {
               setCurrentPage(page);
          }
     };

     return (
          
          <div className="container mx-auto mt-4">
               <h1 className="text-2xl font-bold mb-4">Books</h1>
               <NavLink to="/about" className="text-emerald-500">About</NavLink>
               {loading ? (
                    <p>Loading...</p>
               ) : (
                    <div>
                         <ul>
                              {books.map((book) => (
                                   <li key={book._id} className="border-b py-2">
                                        <h2 className="text-xl">{book.title}</h2>
                                        <p>{book.author}</p>
                                   </li>
                              ))}
                         </ul>

                         <div className="pagination mt-4 flex justify-center">
                              <button
                                   onClick={() => handlePageChange(currentPage - 1)}
                                   disabled={currentPage === 1}
                                   className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                              >
                                   Previous
                              </button>
                              <span className="px-4 py-2">
                                   Page {currentPage} of {totalPages}
                              </span>
                              <button
                                   onClick={() => handlePageChange(currentPage + 1)}
                                   disabled={currentPage === totalPages}
                                   className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
                              >
                                   Next
                              </button>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default PaginatedBooks;
