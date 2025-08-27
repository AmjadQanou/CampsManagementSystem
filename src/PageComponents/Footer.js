import { Link, NavLink } from 'react-router-dom';
import logo from '../Assests/images/logo without bg.png';
import { faPhone, faFax, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F5] shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Left Section - Contact Information */}
          <div className="text-[#E26629] text-right">
            <h3 className="font-semibold text-lg">وسائل التواصل</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="mr-3">هاتف: 00970 8 2864750</span>
                <FontAwesomeIcon icon={faPhone} size="x" className='text-[#A6B78D]'/>
              </li>
              <li>
                <span className="mr-3">فاكس: 00970 8 2860019</span>
                <FontAwesomeIcon icon={faFax} size="x" className='text-[#A6B78D]'/>
              </li>
              <li>
                <span className="mr-3">hopehands@gmail.com :إيميل</span>
                <FontAwesomeIcon icon={faEnvelope} size="x" className='text-[#A6B78D]'/>
              </li>
              <li>
                <span className="mr-3">قطاع غزة - شارع الرشيد -فندق الروتس</span>
                <FontAwesomeIcon icon={faMapMarkerAlt} size="x" className='text-[#A6B78D]'/>
              </li>
            </ul>
          </div>

          {/* Right Section - Links */}
          <div className="text-[#E26629] text-right">
            <h3 className="font-semibold text-lg">روابط</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to={'/aboutus'} className="text-base hover:text-[#A6B78D] hover:mr-2 duration-300">من نحن</Link></li>
              <li><Link to={'/camps'} className="text-base hover:text-[#A6B78D] hover:mr-2 duration-300"> مخيمتنا</Link></li>
              <li><Link to={'/organizations'} className="text-base hover:text-[#A6B78D] hover:mr-2 duration-300">مؤسساتنا</Link></li>
              <li><Link to={'/announcment'} className="text-base hover:text-[#A6B78D] hover:mr-2 duration-300"> أخر المستجدات</Link></li>
            </ul>
          </div>

          <div className='min-w-14 hidden lg:inline-block'></div>
          <NavLink to={"/"} className="-m-1.5 p-1.5 flex md:justify-end">
            <span className="sr-only">Hands Of Hands</span>
            <img
              alt="Logo"
              src={logo}
              className="h-24 w-auto"
            />
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
