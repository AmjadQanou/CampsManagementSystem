import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-2xl font-semibold text-[#E26629]">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-[#A6B78D] sm:text-7xl">
             الصفحة غير موجودة 
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            عذراً , لم نستطيع إيجاد الصفحة التي تبحث عنها .
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink
              to={'/'}
              className="rounded-md text-[#E26629] px-3.5 py-2.5 text-sm font-semibold shadow-xs hover:bg-[#F5F5F5] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 "
            >
              العودة للرئيسية 
            </NavLink>
          </div>
        </div>
      </main>
    </>
  )
}
