import React from 'react'
import BannerCard from '../Home/BannerCard'

const Banner = () => {
  return (
    <div className='px-4 lg:px-24 bg-teal-100 flex items-center' style={{backgroundColor:'#f29ad8'}}>
        <div className='flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40'>
            {/*left side*/}
            <div className='md:w-1/2 space-y-8 h-full'>
                <h2 className='text-5xl font-bold leading-snug text-black'>Buy and Sell Your Books <span className='text-pink-800'>for the Best Prices</span></h2>
                <p className='md:w-4/5'>Find the best prices on a wide range of books, from textbooks to novels. Whether you’re looking to sell your used books or buy something new, our platform offers the best deals to help you save money and find exactly what you need. Join our community of readers and book lovers and enjoy a seamless, budget-friendly book-buying experience!</p>
                
            </div>

            {/*right side*/}
            <div>
                <BannerCard/>
            </div>
        </div>
    </div>
  )
}

export default Banner