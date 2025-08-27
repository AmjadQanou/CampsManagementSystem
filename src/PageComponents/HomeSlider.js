import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'; 
import { ApiContext } from '../Context/ApiContext';
import Slider from "react-slick";
import hero1 from "../Assests/images/hero1.jpg";
import hero2 from "../Assests/images/hero2.jpeg";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AutoPlay() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isError, setIsError] = useState(false); 
  const [filteredCamps, setFilteredCamps] = useState([]); 
  const navigate = useNavigate(); 

  const { camps } = useContext(ApiContext);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2500,
    cssEase: "linear",
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const matchedCamps = camps.filter(
        (camp) =>
          camp.name.toLowerCase().includes(query.toLowerCase()) ||
          camp.location.toLowerCase().includes(query.toLowerCase())
      );

      if (matchedCamps.length > 0) {
        setIsError(false);
        setFilteredCamps(matchedCamps);
      } else {
        setIsError(true);
        setFilteredCamps([]);
      }
    } else {
      setIsError(false);
      setFilteredCamps([]); 
    }
  };

  const handleSearchAction = () => {
    if (filteredCamps.length > 0) {
      navigate('/camps', { state: { filteredCamps } });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Slider Section */}
      <div className="slider-container">
        <Slider {...settings}>
          <div className="relative w-full h-screen">
            <img src={hero1} alt="Slide 1" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 md:right-10 text-white w-[95%] mx-auto text-end">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                تمكين المجتمعات النازحة
              </h1>
              <p className="mb-6 text-lg md:text-xl">
                تحويل الحياة من خلال حلول فعالة
              </p>
              <div className="inline-flex justify-center   items-center w-[90%] md:w-[40%] p-2 lg:p-3 rounded-3xl bg-[#A6B78D] ">
                <div className="relative w-full   ">
                <input
                  type="text"
                  placeholder="ابحث باسم المخيم أو المنطقة..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`p-3 mx-1 rounded-3xl text-right  text-[#E26629] w-full ${isError ? 'focus:outline-red-600' : 'focus:outline-[#A6B78D]'}`}
                />
                <button
                    onClick={handleSearchAction}
                    className="absolute bottom-1 left-2 transform -translate-y-1/2 shadow-lg bg-[#E26629] hover:bg-[#E26629]/90 duration-300  text-white font-semibold rounded-full px-6 py-2"
                  >بحث</button>
                </div>
                <FontAwesomeIcon
                  icon={faSearch}
                  size="2x"
                  className="p-2 mb-7"
                />
              </div>
              {isError && <p className="text-red-500 text-base">لا يوجد مخيم أو منطقة بهذا الاسم</p>}
            </div>
          </div>

          <div className="relative w-full h-screen">
            <img src={hero2} alt="Slide 2" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 md:left-10 left-3 text-white w-[95%] mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                إعادة الأمل للمجتمعات المنكوبة
              </h1>
              <p className="mb-6 text-lg md:text-xl">
                مستقبل أفضل من خلال مشاريع فعّالة
              </p>
              <div className="inline-flex justify-center  items-center w-[90%] md:w-[40%] p-2 lg:p-3 rounded-3xl bg-[#A6B78D] ">
                <div className="relative w-full  ">
                <input
                  type="text"
                  placeholder="ابحث باسم المخيم أو المنطقة..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={`p-3 mx-1 rounded-3xl text-right  text-[#E26629] w-full ${isError ? 'focus:outline-red-600' : 'focus:outline-[#A6B78D]'}`}
                />
                <button
                    onClick={handleSearchAction}
                    className="absolute bottom-1 left-2 transform -translate-y-1/2 shadow-lg bg-[#E26629] hover:bg-[#E26629]/90 duration-300  text-white font-semibold rounded-full px-6 py-2"
                  >بحث</button>
                </div>
                <FontAwesomeIcon
                  icon={faSearch}
                  size="2x"
                  className="p-2 mb-4 "
                />
              </div>
              {isError && <p className="text-red-500 text-base">لا يوجد مخيم أو منطقة بهذا الاسم</p>}
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default AutoPlay;
