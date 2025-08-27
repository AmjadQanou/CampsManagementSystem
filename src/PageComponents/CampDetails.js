import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, faUsers, faBath, faTint, faClipboardCheck,
  faUserTie, faEnvelope, faPhone, faBirthdayCake, faCampground
} from '@fortawesome/free-solid-svg-icons';
import campImg from '../Assests/images/camp.jpg';
import Swal from 'sweetalert2';
import { TokenContext } from '../TokenContext';
import { ApiContext } from '../Context/ApiContext';


export default function CampDetails() {
  const location = useLocation();
  const {camp} = location.state ||{};
  const [activeTab, setActiveTab] = useState('camp');
  const {campManagers}=useContext(ApiContext)
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();

  if (!camp) return <p className="text-center text-red-600 mt-10">.بيانات المخيم غير متوفرة</p>;

  const occupancyRate = Math.min((camp.numOfFamilies / camp.capacity) * 100, 100);
  const manager = campManagers.find(mgr => mgr.id === camp.campManagerId);


  const handleJoinCamp = () => {
    if (token) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'أنت منضم بالفعل لمخيم آخر!',
        confirmButtonText: 'موافق',
        confirmButtonColor: '#3085d6'
      });
    } else {
      navigate('/dpregister');
    }
  };

  return (
    <motion.div
      className="max-w-6xl min-h-[60vh] mx-auto p-8 mt-24 mb-6 bg-white shadow-2xl rounded-2xl relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ direction: 'rtl' }}
    >
      {/* Tabs */}
      <div className="flex justify-center mb-8 gap-2 space-x-4">
        <button
          onClick={() => setActiveTab('camp')}
          className={`px-6 py-2 rounded-full font-semibold hover:shadow-lg duration-300 ${
            activeTab === 'camp' ? 'bg-[#E26629] text-white' : 'bg-[#F5F5F5] text-gray-700'
          }`}
        >
          معلومات المخيم
        </button>
        <button
          onClick={() => setActiveTab('manager')}
          className={`px-6 py-2 rounded-full font-semibold hover:shadow-lg duration-300 ${
            activeTab === 'manager' ? 'bg-[#E26629] text-white' : 'bg-[#F5F5F5] text-gray-700'
          }`}
        >
          بيانات المدير
        </button>
      </div>

      {activeTab === 'camp' ? (
        <div className="flex flex-col md:flex-row gap-10 text-right">
          <motion.div
            className="w-full md:w-1/2 h-80 object-cover rounded-2xl shadow-md bg-cover bg-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ backgroundImage: `url(${camp.imageUrl || campImg})` }}
          />

          <div className="flex-1 space-y-4 text-gray-700 text-lg">
            <h1 className="text-4xl font-bold text-[#E26629] mb-4">{camp.name}</h1>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} className="ml-2 text-[#E26629]" /> الموقع: {camp.location}</p>
            <p><FontAwesomeIcon icon={faUsers} className="ml-2 text-[#E26629]" /> عدد العائلات: {camp.numOfFamilies}</p>
            <p><FontAwesomeIcon icon={faBath} className="ml-2 text-[#E26629]" /> عدد الحمامات: {camp.numOfBaths}</p>
            <p><FontAwesomeIcon icon={faTint} className="ml-2 text-[#E26629]" /> عدد جالونات المياه: {camp.numOfWaterGallons}</p>
            <p><FontAwesomeIcon icon={faCampground} className="ml-2 text-[#E26629]" /> السعة: {camp.capacity} شخص</p>
            <p>
              <FontAwesomeIcon icon={faClipboardCheck} className="ml-2 text-[#E26629]" />
              حالة الاعتماد: 
              <span className={`ml-2 font-bold ${camp.approved ? 'text-[#A6B78D]-600' : 'text-red-600'}`}>
                {camp.approved ? 'معتمد' : 'غير معتمد'}
              </span>
            </p>

            {/* شريط السعة */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">نسبة الإشغال:</h2>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <motion.div
                  className="bg-blue-600 h-6 rounded-full"
                  style={{ width: `${occupancyRate}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${occupancyRate}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-right mt-2 text-gray-600">{occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-xl shadow-inner text-right space-y-4 text-gray-700 text-lg">
          <h2 className="text-3xl font-bold text-[#E26629] mb-6">مدير المخيم</h2>
          {manager ? (
            <>
              <p><FontAwesomeIcon icon={faUserTie} className="ml-2 text-[#E26629]" /> الاسم: {manager.fname} {manager.lname}</p>
              {token&&(<>
                <p><FontAwesomeIcon icon={faEnvelope} className="ml-2 text-[#E26629]" /> الإيميل: {manager.email}</p>
                <p><FontAwesomeIcon icon={faPhone} className="ml-2 text-[#E26629]" /> بيانات التواصل: {manager.contactInfo}</p>
              </>)}
            </>
          ) : (
            <p className="text-red-600">لا توجد بيانات لمدير المخيم.</p>
          )}
        </div>
      )}

      {/* زر الانضمام ثابت */}
      <div className="flex justify-start mt-2">
        <button
          onClick={handleJoinCamp}
          className="bg-[#E26629] hover:bg-[#A6B78D] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
        >
          الانضمام للمخيم
        </button>
      </div>
    </motion.div>
  );
}
