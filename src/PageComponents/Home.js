import React, { useContext, useEffect, useState } from 'react'
import HomeSlider from './HomeSlider'
import about1 from '../Assests/images/aboutsection1.jpg'
import about2 from '../Assests/images/aboutsection2.jpg'
import  users from '../Assests/icons/organizationIcon.png';
import  services from '../Assests/icons/servicesIcon.png';
import  tent from '../Assests/icons/tentIcon.png';
import Contactform from './Contactform'
import HomeCamps from './HomeCamps';
import HomeOrganizations from './HomeOrganizations';
import Recentnews from './Recentnews';
import { useRef } from 'react';
import { ApiContext } from '../Context/ApiContext';



const Card = ({ icon, title, type }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(0);
  const cardRef = useRef(null);
  const { camps, organizations, news } = useContext(ApiContext);

  const getCounter = () => {
    if (type === 'camps' && camps) {
      return camps.length;
    } else if (type === 'organizations' && organizations) {
      return organizations.length;
    } else if (type === 'news' && news) {
      return news.length;
    }
    return 0;
  };

  const finalCount = getCounter();

  // Observe card visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  // Animate counter after scale transition (1s delay)
  useEffect(() => {
    if (isVisible && displayedCount === 0 && finalCount > 0) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayedCount((prev) => {
            const next = prev + 1;
            if (next >= finalCount) {
              clearInterval(interval);
            }
            return next;
          });
        }, 30); 
      }, 1000); 

      return () => clearTimeout(timeout);
    }
  }, [isVisible, finalCount]);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-1000 transform ${isVisible ? 'scale-100' : 'scale-50'} h-56 w-56 rounded-full p-4 bg-white text-[#E26629] text-center relative bg-gradient-to-tl from-[#A6B78D] to-transparent shadow-inner`}
      style={{
        background: 'linear-gradient(70deg, rgba(226, 102, 41, 0.6) 0%, rgba(245, 245, 245, 1) 50%, rgba(166, 183, 141, 1) 100%)'
      }}
    >
      <div className="rounded-full shadow-2xl w-full h-full bg-white">
        <div className="h-16 w-16 p-3 bg-white border-4 border-[#A6B78D]/80 shadow-inner rounded-full">
          <img src={icon} className="w-full h-full" alt="icon" />
        </div>
        <p className="text-xl md:text-2xl font-semibold">{displayedCount}</p> {/* Animated counter */}
        <p className="text-xl md:text-2xl font-bold">{title}</p>
      </div>
    </div>
  );
};



export default function Home() {
  const [aboutVisible, setAboutVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);
  return (
    <>
      <HomeSlider />

      {/* جزئية اللينكات */}
      <section className="lg:w-[90%] w-[96%] mx-auto my-[6%] flex flex-wrap md:flex-nowrap justify-around gap-10 md:gap-5 lg:gap-12 ">
        <Card icon={services} title="خبر" type="news" />
        <Card icon={users} title="مؤسسة" type="organizations" />
        <Card icon={tent} title="مخيم" type="camps" />
      </section>

      {/* جزئية من نحن */}
      <section className='bg-[#F5F5F5] pb-12 my-8 overflow-hidden text-base'>
        <div className="lg:w-[90%] w-[96%] mx-auto pt-10 lg:pb-10 pb-5">
          <h3 className="text-[#E26629] text-3xl text-center my-7 font-bold">!! من نحن</h3>
          <div
            ref={aboutRef}
            className={`flex flex-wrap-reverse gap-6 justify-between items-center text-end transition-all duration-1000 ${
              aboutVisible ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'
            }`}
          >
            {/* Text Content Section */}
            <div className="w-full md:w-[45%] text-[#E26629] text-xl my-3 pt-3 px-3">
              <p>نحن فريق متخصص في تطوير الأنظمة الرقمية نسعى لتقديم حلول مبتكرة لتحسين أداء المخيمات وتقديم الخدمات الإنسانية بفعالية </p>
              
              {/* Mission */}
              <div className="flex flex-row justify-end items-center mt-8 mb-6">
                <h4 className="text-2xl font-bold">مهمتنا</h4>
                <div className="h-4 w-4 bg-[#E26629] rounded-full mx-2"></div>
              </div>
              <p>تحسين أداء المخيمات وتقديم المساعدات الإنسانية بكفاءة عبر نظام متكامل وسهل الاستخدام </p>

              {/* Vision */}
              <div className="flex flex-row justify-end items-center mt-8 mb-6">
                <h4 className="text-2xl font-bold">رؤيتنا</h4>
                <div className="h-4 w-4 bg-[#E26629] rounded-full mx-2"></div>
              </div>
              <p>عالم خال من المعاناة حيث يتمكن كل فرد ان يعيش بأمان وكرامة ونؤمن بأهمية التضامن والعمل الجماعي لتحقيق التغيير الاجابي في المجتمعات المتضررة </p>
            </div>

            {/* Image Section */}
            <div className="relative flex justify-end w-full md:w-[45%] mb-10 md:mb-0">
              <div className="z-10 border-[#A6B78D] border-2 rounded-lg md:w-full w-[80%]">
                <img src={about1} alt="About 1" className="object-cover rounded-lg w-full h-full" />
              </div>

              {/* Second Image with absolute positioning */}
              <div className="absolute top-[65%] md:-left-[20%] left-0 z-20 border-[#A6B78D] border-2 rounded-lg w-[60%] md:w-[50%]">
                <img src={about2} alt="About 2" className="object-cover rounded-lg lg:h-[200px] md:h-[150px] h-[120px] w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>


      <HomeCamps/>
      <HomeOrganizations/>
      <Recentnews/>

      <Contactform/>

    </>
  )
}
