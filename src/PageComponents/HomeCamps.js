import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick"; // React Slick for the slider functionality
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ApiContext } from '../Context/ApiContext';
import campImg from '../Assests/images/camp.jpg'

// React Slick settings for the slider
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  rtl: true,
  centerPadding: "5px",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1.5,
        slidesToScroll: 1,
      },
    },
  ],
};

export default function HomeCamps() {
  const { camps, loading, error } = useContext(ApiContext);

  const sortedCamps = camps
    .sort((a, b) => b.numOfFamilies - a.numOfFamilies)
    .slice(0, 10);
console.log(camps);

  return (
    <section className="lg:w-[90%] w-[96%] mx-auto my-[6%] text-right overflow-hidden">
      <div className='flex justify-between flex-nowrap items-center flex-row mt-5'>
          <NavLink to={'/camps'} className='group flex items-end text-[#E26629] hover:text-[#A6B78D] duration-300 text-xl'>
            <span className='opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-300 inline-block'>
              <FontAwesomeIcon icon={faArrowLeft} size='2xs' className='-mb-1 mr-1'/>
            </span>المزيد
          </NavLink>
        <h2 className="lg:text-2xl md:text-xl text-lg font-semibold text-[#E26629] mb-[2%]">المخيمات الأعلى سكاناً</h2>
      </div>

      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <Slider {...sliderSettings}>
          {sortedCamps.map((camp, index) => (
            <Link to={`/camp/${camp.id}`} state={{ camp }}  key={index} className="p-1 md:p-2 lg:p-3">
              <div className="relative bg-opacity-80 shadow-md h-[200px] md:h-[300px] group overflow-hidden hover:cursor-pointer">
                {/* Image Section */}
                <div className="h-2/3 bg-cover bg-center group-hover:scale-105 duration-300 relative" style={{ backgroundImage: `url(${camp.ImageUrl || campImg})` }}>
                  <div className='bg-black opacity-40 absolute top-0 left-0 right-0 bottom-0 group-hover:opacity-20 duration-200'></div>
                </div>

                <div className="h-1/3 text-right flex text-[#E26629] border-l-4 border-[#E26629] group-hover:border-[#A6B78D] group-hover:text-[#A6B78D] duration-150">
                  {/* Camp Details Section */}
                  <div className='w-[20%] text-center self-center'>
                      <p className='text-xl'>{camp.numOfFamilies}</p>
                      <p className='md:text-xl'>عائلة </p>
                  </div>
                  <div className="w-[80%] mt-3 mr-3 ">
                    <h3 className="md:text-xl text-lg font-bold">{camp.name}</h3>
                    <p className="md:text-base text-sm text-gray-600 mb-5">الموقع: {camp.location}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      )}
    </section>
  );
}
