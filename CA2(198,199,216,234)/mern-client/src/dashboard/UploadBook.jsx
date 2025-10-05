
import React, { useState } from 'react'
import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { Textarea } from "flowbite-react";
const UploadBook = () => {
  const bookCategories=[
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Programming",
    "Science Fiction",
    "Fantasy",
    "Horror",
    "Bibliography",
    "Autobiography",
    "Biography",
    "History",
    "Self-help",
    "Memoir",
    "Business",
    "Children Books",
    "Travel",
    "Religion",
    "Art and Design"
  ]
  const [selectedBookCategory, setSelectedBookCategory]=useState(bookCategories[0])

  const handleChangeSelectedValue=()=>{
    //console.log(event.target.value);
    setSelectedBookCategory(event.target.value)
  }
  //handle book submission
  const handleBookSubmit=(event)=>{
     event.preventDefault();
     const form=event.target;
     const bookTitle=form.bookTitle.value;
     const authorName=form.authorName.value;
     const imageUrl=form.imageUrl.value;
     const category=form.categoryName.value;
     const bookDescription=form.bookDescription.value;
     const bookPdfUrl=form.bookPdfUrl.value;
     //console.log(bookTitle)
     const bookObj={
      bookTitle,authorName,imageUrl,category,bookDescription,bookPdfUrl
     }
     console.log(bookObj)

     //send data to db
     fetch("http://localhost:5500/upload-book",{
      method:"POST",
      headers:{
        "Content-type":"application/json",
      },
      body: JSON.stringify(bookObj)
     }).then(res=>res.json()).then(data=>{
      alert("Book uploaded successfully!!!")
      form.reset();
     })
  }
  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Upload a Book</h2>
        <form onSubmit={handleBookSubmit} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
          {/*first row*/}
            <div className='flex gap-8'>
              {/*book name*/}
                <div className='lg:w-1/2'>
                    <div className="mb-2 block">
                        <Label htmlFor="bookTitle" value="Book Title" />
                    </div>
                    <TextInput id="bookTitle" type="text" placeholder="Enter book name" required />
                  </div>
                  {/*author details*/}
                  <div className='lg:w-1/2'>
                    <div className="mb-2 block">
                        <Label htmlFor="authorName" value="Author Name" />
                    </div>
                    <TextInput id="authorName" type="text" placeholder="Enter author name" required />
                  </div>
            </div>
            {/*2nd row*/}
            <div className='flex gap-8'>
              {/*book image*/}
                <div className='lg:w-1/2'>
                    <div className="mb-2 block">
                        <Label htmlFor="imageUrl" value="Book Image URL" />
                    </div>
                    <TextInput id="imageUrl" type="text" placeholder="Book image URL" required />
                  </div>
                  {/*category*/}
                  <div className='lg:w-1/2'>
                    <div className="mb-2 block">
                        <Label htmlFor="inputState" value="Book Category" />
                    </div>

                    <Select id='inputState' name='categoryName' className='w-full rounded' value={selectedBookCategory}
                    onChange={handleChangeSelectedValue}>
                        {
                          bookCategories.map((option)=> <option key={option} value={option}>{option}</option>)
                        }
                    </Select>
                  </div>
            </div>
            {/*book desc*/}
            <div>
                <div className="mb-2 block">
                   <Label htmlFor="bookDescription" value="Book Description" />
                </div>
                <Textarea id="bookDescription" name="bookDescription" placeholder="Enter Description..." required rows={4} className='w-full'/>
                
            </div>
            {/*book pdf link*/}
            <div>
               <div className="mb-2 block">
                <Label htmlFor="bookPdfUrl" value="Book PDF URL" />
               </div>
               <TextInput id="bookPdfUrl" name='bookPdfUrl' type="text" placeholder="URL" required />
            </div>
            {/*Submit*/}
            <Button type="submit" className='mt-5'>Upload Book</Button>
        </form>
    </div>

  )
}
export default UploadBook
