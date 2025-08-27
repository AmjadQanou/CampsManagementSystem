import React from 'react';
import Contactform from './Contactform';
import aboutus1 from '../Assests/images/aboutus1.jpg'
import aboutus2 from '../Assests/images/aboutus2.jpg'
import aboutus3 from '../Assests/images/aboutus3.jpg'



export default function AboutUs() {
  return (
    <>

    <section className='lg:w-[90%] w-[96%] mx-auto mt-28 flex justify-between md:flex-nowrap flex-wrap items-center'>
    <div className='ImgSection relative md:w-[40%] w-full'>
      <div className='floating w-[200px] h-[200px] lg:w-[350px] lg:h-[350px] rounded-full shadow-2xl'>
        <img src={aboutus1} className='h-full w-full rounded-full' />
      </div>
      <div className='floating-delay-1 w-[150px] h-[150px] lg:w-[250px] lg:h-[250px] absolute lg:right-10 right-4 top-[30%] rounded-full shadow-2xl'>
        <img src={aboutus2} className='h-full w-full rounded-full' />
      </div>
      <div className='floating-delay-2 w-[170px] h-[170px] lg:w-[320px] lg:h-[320px] lg:ml-12 lg:mt-5 ml-8 mt-3 rounded-full shadow-2xl'>
        <img src={aboutus3} className='h-full w-full rounded-full' />
      </div>
    </div>
      <div className='ContentSection text-[#E26629] text-right md:w-[55%]'>
      <h2 className="text-2xl font-bold mb-2">!!من نحن </h2>
        <p className="mb-6">نحن فريق متخصص في تطوير الأنظمة الرقمية نسعى لتقديم حلول مبتكرة لتحسين أداء المخيمات وتقديم الخدمات الإنسانية بفعالية </p>
        <h3 className="text-xl font-semibold mb-2">مهمتنا</h3>
        <p className='mb-6'>تحسين أداء المخيمات وتقديم المساعدات الإنسانية بكفاءة عبر نظام متكامل وسهل الاستخدام </p>
        <h3 className="text-xl font-semibold mb-2">رؤيتنا</h3>
        <p className='mb-6'>عالم خال من المعاناة حيث يتمكن كل فرد ان يعيش بأمان وكرامة ونؤمن بأهمية التضامن والعمل الجماعي لتحقيق التغيير الاجابي في المجتمعات المتضررة </p>
        <h3 className="text-xl font-semibold mb-2">كيفية التواصل معنا</h3>
        <p className='mb-6'>:بإمكانك التواصل معنا عبر</p>
        <ul className='list-disc space-y-2 pr-7' style={{direction:'rtl'}}>
          <li>إتصال هاتفي: 00970 8 2864750</li>
          <li>فاكس: 00970 8 2860019</li>
          <li>hopehands@gmail.com :إرسال إيميل على</li>
          <li>بزيارة موقعنا : قطاع غزة -شارع الرشيد -فندق الروتس</li>
        </ul>
      </div>
    </section>  

    <Contactform/>    
    </>
  );
}
