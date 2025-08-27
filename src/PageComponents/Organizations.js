import React, { useState, useContext } from "react";
import { Link,NavLink, useNavigate } from "react-router-dom";
import { ApiContext } from '../Context/ApiContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOption, setSearchOption] = useState("name");
  const [isError, setIsError] = useState(false);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const { organizations } = useContext(ApiContext);

  console.log(organizations)
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const matchedOrgs = organizations.filter((org) => {
        if (searchOption === "name") {
          return org.name?.toLowerCase().includes(query.toLowerCase());
        } else if (searchOption === "category") {
          return org.category?.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      });

      if (matchedOrgs.length > 0) {
        setIsError(false);
        setFilteredOrgs(matchedOrgs);
      } else {
        setIsError(true);
        setFilteredOrgs([]);
      }
    } else {
      setIsError(false);
      setFilteredOrgs([]);
    }
  };

  return (
    <section className="mt-24">
      {/* Search Section */}
      <div className="w-[96%] md:w-[50%] lg:w-[40%] mx-auto text-right">
        <div className="flex justify-center items-center p-2 lg:p-3 rounded-3xl bg-[#A6B78D]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث عن منظمة"
              value={searchQuery}
              onChange={handleSearch}
              className={`p-3 mx-1 rounded-3xl text-right text-[#E26629] w-full ${isError ? 'focus:outline-red-600' : 'focus:outline-[#A6B78D]'}`}
            />
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
              className="p-1 mx-1 text-right focus:bg-[#A6B78D] w-[45%] md:w-[35%] lg:w-[25%] absolute top-1/2 left-2 transform -translate-y-1/2 shadow-lg bg-[#E26629] hover:bg-[#E26629]/90 duration-300 text-white font-semibold rounded-full px-6 py-2"
              style={{direction:'rtl'}}>
              <option value="name">الاسم</option>
              <option value="category">نوع المساعدة</option>
            </select>
          </div>
          <FontAwesomeIcon icon={faSearch} size="2x" className="p-2 text-white" />
        </div>
      </div>

      {/* Display Organizations */}
      <div className="mt-12 lg:w-[90%] w-[96%] mx-auto my-[6%]">
        {searchQuery && filteredOrgs.length === 0 ? (
          <p className="text-center text-red-500 h-[40vh] w-full">لا توجد نتائج تطابق البحث.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" style={{direction:'rtl'}}>
            {(searchQuery ? filteredOrgs : organizations).map((org, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-10 group relative bg-[#F5F5F5] hover:bg-[#A6B78D] shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <img src={org.file} alt="Organization" className="h-full w-full rounded-lg saturate-[0.34] group-hover:saturate-100 duration-300" />

                <div className="py-2 text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-[#E26629] mb-2 group-hover:text-white">{org.name}</h3>
                  <p className="text-base text-gray-600 mb-2 group-hover:text-white">{org.location}</p>
                  <p className="text-base text-gray-600 group-hover:text-white">نوع المساعدة: {org.category}</p>
                </div>
                <Link
                  to={`/organization/${org.id}`}
                  state={{ org }} // Pass the org data to the destination
                  className='px-2 py-1 bg-white text-[#E26629] hover:text-[#A6B78D] shadow-xl rounded-lg absolute left-[-100%] group-hover:left-4 transition-all duration-700 bottom-3'
                >
                  عرض التفاصيل
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
