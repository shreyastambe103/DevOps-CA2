import React, { useEffect, useState } from 'react';
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useLoaderData, useParams } from 'react-router-dom';

const EditBooks = () => {
  const {id} = useParams();
  const loadedData = useLoaderData();
  const [bookTitle, setBookTitle] = useState(loadedData.bookTitle || '');
  const [authorName, setAuthorName] = useState(loadedData.authorName || '');
  const [imageURL, setImageURL] = useState(loadedData.imageUrl || '');
  const [category, setCategory] = useState(loadedData.category || '');
  const [bookDescription, setBookDescription] = useState(loadedData.bookDescription || '');
  const [bookPDFURL, setBookPDFURL] = useState(loadedData.bookPdfUrl || '');

  const bookCategories = [
    "Fiction", "Non-Fiction", "Mystery", "Programming", "Science Fiction",
    "Fantasy", "Horror", "Bibliography", "Autobiography", "Biography",
    "History", "Self-help", "Memoir", "Business", "Children Books",
    "Travel", "Religion", "Art and Design"
  ];

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Handle book submission
  const handleBookUpdate = (event) => {
    event.preventDefault();
    
    const updateBookObj = { 
      bookTitle,
      authorName,
      imageURL,
      category,
      bookDescription,
      bookPDFURL
    };
    // console.log(bookObj);

    // update book data to db
    fetch(`http://localhost:5500/book/${id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateBookObj)
    }).then(res=>res.json()).then(data=>{
      alert("Book updated successfully!!!")
      form.reset();
     })
    
  };

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Update the Book</h2>
      <form onSubmit={handleBookUpdate} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
        {/* First row */}
        <div className='flex gap-8'>
          {/* Book name */}
          <div className='lg:w-1/2'>
            <Label htmlFor="bookTitle" value="Book Title" />
            <TextInput
              id="bookTitle"
              type="text"
              placeholder="Enter book name"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              required
            />
          </div>
          {/* Author details */}
          <div className='lg:w-1/2'>
            <Label htmlFor="authorName" value="Author Name" />
            <TextInput
              id="authorName"
              type="text"
              placeholder="Enter author name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Second row */}
        <div className='flex gap-8'>
          {/* Book image */}
          <div className='lg:w-1/2'>
            <Label htmlFor="imageUrl" value="Book Image URL" />
            <TextInput
              id="imageUrl"
              type="text"
              placeholder="Book image URL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              required
            />
          </div>
          {/* Category */}
          <div className='lg:w-1/2'>
            <Label htmlFor="inputState" value="Book Category" />
            <Select
              id='inputState'
              name='categoryName'
              className='w-full rounded'
              value={category}
              onChange={handleCategoryChange}
            >
              {bookCategories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </div>
        </div>
        
        {/* Book description */}
        <div>
          <Label htmlFor="bookDescription" value="Book Description" />
          <Textarea
            id="bookDescription"
            name="bookDescription"
            placeholder="Enter Description..."
            value={bookDescription}
            onChange={(e) => setBookDescription(e.target.value)}
            required
            rows={4}
            className='w-full'
          />
        </div>
        
        {/* Book PDF link */}
        <div>
          <Label htmlFor="bookPdfUrl" value="Book PDF URL" />
          <TextInput
            id="bookPdfUrl"
            name='bookPdfUrl'
            type="text"
            placeholder="URL"
            value={bookPDFURL}
            onChange={(e) => setBookPDFURL(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <Button type="submit" className='mt-5'>Update</Button>
      </form>
    </div>
  );
}

export default EditBooks;
