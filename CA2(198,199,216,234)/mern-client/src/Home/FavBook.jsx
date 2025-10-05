import React from 'react'
import FavBookImg from '../assets/banner-books/favoritebook.jpg'
import { Link } from 'react-router-dom'
const FavBook = () => {
  return (
    <div className='px-4 lg:px-24 my-20 flex flex-col md:flex-row justify-between items-center gap-12'>
        <div className='md:w-1/2'>
            <img src={FavBookImg} alt='' className='rounded md:w-10/12'/>
        </div>
        <div className='md:w-1/2 space-y-6'>
            <h2 className='text-5xl font-bold my-5 md:w-3/4 leading-snug'>Find your Favorite <span className='text-blue-700'>Book Here!</span></h2>
            <p className='mb-10 text-lg md:w-5/6'>Discover a wide variety of books that suit your interests! Whether you're looking for thrilling adventures, heartwarming stories, or insightful non-fiction, we have something for everyone. Dive into the world of captivating narratives, intriguing characters, and unforgettable journeys. Explore, choose, and enjoy your next great read today!</p>
            <div className='flex flex-col sm:flex-row justify-between gap-6 md:w-3/4 my-14'>
                <div>
                    <h3 className='text-3xl font-bold'>800+</h3>
                    <p className='text-base'>Book Listing</p>
                </div>
                <div>
                    <h3 className='text-3xl font-bold'>550+</h3>
                    <p className='text-base'>Registered users</p>
                </div>
                <div>
                    <h3 className='text-3xl font-bold'>12000+</h3>
                    <p className='text-base'>Downloads</p>
                </div>
            </div>

            <Link to="/shop" className='mt-12 block'><button className='bg-blue-700 text-white font-semibold px-5 py-2 rounded hover:bg-black transition-all duration-300'>Explore more</button></Link>
        </div>
    </div>
  )
}

export default FavBook