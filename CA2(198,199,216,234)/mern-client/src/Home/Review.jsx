import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import {FaStar} from 'react-icons/fa6';
import StarRating from '../Home/StarRating';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

//import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';
import { Avatar } from "flowbite-react";
import proPic from '../assets/banner-books/profile.jpg'

const Review = () => {
  return (
    <div className='my-12 px-4 lg:px-24' style={{backgroundColor: '#f29ad8' }}>
        <h2 className='text-5xl font-bold text-center mb-10 leading-snug' style={{color:'#542245'}}>Reviews</h2>
        <div>
        <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide className='shadow-2xl bg-white py-8 px-4 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
            <StarRating rating={4} /> 
                <div className='mt-7'>
                    <p className='mb-5'>"I loved the concept of choosing different lives and exploring the 'what ifs.' It’s a beautiful reminder that every choice we make matters, even the little ones. 
                      Haig’s writing felt comforting, and the book itself was surprisingly uplifting, considering the deep subject matter. A bit predictable toward the end, but a great read overall!"</p>
                    <Avatar  alt="avatar of Jese" img={proPic} rounded className='w-10 mb-4' />
                    <h5 className='text-lg font-medium'>Sarah M.</h5>
                    <p className='text-base'>"The Midnight Library" by Matt Haig</p>
                </div>

            </div>
        </SwiperSlide>
        <SwiperSlide  className='shadow-2xl bg-white py-8 px-4 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
            <StarRating rating={5} /> 
                <div className='mt-7'>
                    <p className='mb-5'>"This book captivated me with its rich descriptions of the marshlands and its unusual heroine, Kya. Owens does a brilliant job blending mystery with coming-of-age themes, and the twist at the end left me in complete shock. 
                      It’s haunting, beautiful, and will stay with you long after the final page."</p>
                    <Avatar  alt="avatar of Jese" img={proPic} rounded className='w-10 mb-4' />
                    <h5 className='text-lg font-medium'>Michael L.</h5>
                    <p className='text-base'>"Where the Crawdads Sing" by Delia Owens</p>
                </div>

            </div>
        </SwiperSlide>
        <SwiperSlide  className='shadow-2xl bg-white py-8 px-4 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <StarRating rating={3} />
                <div className='mt-7'>
                    <p className='mb-5'>"It was a fun read, but the hype set my expectations too high. The unique interview format took some getting used to, but once I did, the story flowed pretty quickly. I enjoyed the rock-and-roll vibes and complex relationships, but I wanted more depth in some of the character arcs. 
                      A good read, especially if you’re into music history."</p>
                    <Avatar  alt="avatar of Jese" img={proPic} rounded className='w-10 mb-4' />
                    <h5 className='text-lg font-medium'>Marco R.</h5>
                    <p className='text-base'>"Daisy Jones & The Six" by Taylor Jenkins Reid</p>
                </div>

            </div>
        </SwiperSlide>
        <SwiperSlide  className='shadow-2xl bg-white py-8 px-4 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
            <StarRating rating={5} />
                <div className='mt-7'>
                    <p className='mb-5'> "Circe is one of those books you don’t want to end. The writing is beautiful, and Miller breathes new life into Greek mythology, focusing on a lesser-known character who has always fascinated me. Circe’s journey from outcast to powerful figure resonated deeply. 
                      It’s a slow burn, but if you love lyrical prose and mythology, it’s a must-read."</p>
                    <Avatar  alt="avatar of Jese" img={proPic} rounded className='w-10 mb-4' />
                    <h5 className='text-lg font-medium'>Alex K.</h5>
                    <p className='text-base'>"Circe" by Madeline Miller</p>
                </div>

            </div>
        </SwiperSlide>
      </Swiper>
        </div>
    </div>
  )
}

export default Review