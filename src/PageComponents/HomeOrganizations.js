import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ApiContext } from '../Context/ApiContext';

export default function HomeOrganizations() {
  const { organizations, loading, error } = useContext(ApiContext);

  return (
    <section className="lg:w-[90%] w-[96%] mx-auto my-[6%] text-right">
      <div className="flex justify-between flex-nowrap items-center flex-row mt-5">
        <NavLink to={'/organizations'} className='group flex items-end text-[#E26629] hover:text-[#A6B78D] duration-300 text-lg'>
          <span className='opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-300 inline-block'>
            <FontAwesomeIcon icon={faArrowLeft} size='2xs' className='-mb-1 mr-1'/>
          </span>المزيد
        </NavLink>
        <h2 className="lg:text-2xl text-xl font-semibold text-[#E26629] mb-[2%]">المؤسسات الشريكة</h2>
      </div>

      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mt-6">
          {organizations.slice(0, 6).map((org, index) => (
            <div key={index} className="relative group flex flex-col items-center p-4 bg-[#F5F5F5] rounded-lg hover:shadow-[#A6B78D]/60 shadow-lg border-t-2 hover:border-[#A6B78D]/30  transition-all duration-300">
              {/* Floating Circle for Organization Image */}
              <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 md:w-[120px] md:h-[120px] w-[100px] h-[100px] group-hover:scale-105 duration-300 bg-center rounded-full bg-contain border-4 border-[#F5F5F5] shadow-lg" 
                style={{ backgroundImage: `url(${org.file})` }}>
              </div>
              
              {/* Card Body with Organization Details */}
              <div className="mt-[70px]  w-full">
                <h3 className="text-2xl text-[#E26629] font-bold mb-2">{org.name}</h3>
                <p className="text-base text-gray-600 mb-2">{org.category} : التصنيف</p>
                <p className="text-base text-gray-600 mb-4">{org.location} :الموقع</p>
              </div>
              <Link 
                to={`/organization/${org.id}`} 
                state={{ org }}  // This is how you're passing the state
                className="text-[#E26629] hover:underline hover:text-[#A6B78D] duration-200 mt-2 inline-block"
              >
                عرض التفاصيل
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
