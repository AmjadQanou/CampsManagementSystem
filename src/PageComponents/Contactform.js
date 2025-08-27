import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Contactform() {
  // Yup schema for validation
  const validationSchema = Yup.object({
    name: Yup.string().required('الاسم مطلوب'),
    email: Yup.string().email('البريد الإلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
    message: Yup.string().required('الرسالة مطلوبة'),
  });

  // Formik hook
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      emailjs
        .send(
          'service_ndi67qs', 
          'template_hzb2sq7', 
          values,               
          '---TiiqP5dzbA4Yyu'  
        )
        .then(
          (result) => {
            console.log('SUCCESS:', result.text);
            Swal.fire({
              title: 'تم إرسال النموذج بنجاح!',
              text: 'تم إرسال رسالتك بنجاح.',
              icon: 'success',
              confirmButtonText: 'موافق',
            });
          },
          (error) => {
            console.log('FAILED:', error.text);
            // Show error alert
            Swal.fire({
              title: 'فشل في إرسال الرسالة!',
              text: 'حدث خطأ أثناء إرسال الرسالة.',
              icon: 'error',
              confirmButtonText: 'موافق',
            });
          }
        );
    },
  });

  return (
    <section className="lg:w-[90%] w-[96%] mx-auto mt-[8%] mb-[5%] flex flex-wrap-reverse md:flex-nowrap">
      <div className="md:w-3/5 w-[96%] mx-auto bg-[#F5F5F5] px-[6%] py-[4%] text-end">
        <h2 className="lg:text-3xl text-2xl text-[#E26629] my-[2%]">تواصل معنا</h2>

        {/* Contact Form */}
        <form onSubmit={formik.handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="اسمك"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`text-sm w-full text-right mx-auto outline-none focus:border-[#A6B78D] border-2 rounded-3xl p-3 pl-9 mt-4 duration-300 ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </label>

          <label>
            <input
              type="text"
              placeholder="البريد الإلكتروني"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`text-sm w-full text-right outline-none focus:border-[#A6B78D] border-2 rounded-3xl p-3 pl-9 mt-7 duration-300 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </label>

          <label>
            <textarea
              placeholder="رسالتك"
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`text-sm w-full text-right min-h-[184px] outline-none focus:border-[#A6B78D] border-2 rounded-3xl p-3 pl-9 mt-4 duration-300 ${
                formik.touched.message && formik.errors.message ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-sm">{formik.errors.message}</p>
            )}
          </label>

          <button
            className="text-center text-xs font-bold tracking-[3px] bg-[#A6B78D] hover:bg-[#E26629] duration-500 text-white rounded-3xl w-[145px] p-4 mt-4"
            type="submit"
          >
            إرسال
          </button>
        </form>
      </div>

      <div className="md:w-2/5 w-[96%] mx-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.5283923470724!2d34.43602586467783!3d31.524792992515053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd78aa4218da09%3A0x560181d6a6238266!2sRoots%20Hotel!5e0!3m2!1sen!2sil!4v1745080483595!5m2!1sen!2sil"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
