import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ApiContext } from "../Context/ApiContext";

export default function Recentnews() {
  const { news, loading, error } = useContext(ApiContext);

  const topNews = news.slice(0, 4);

  return (
    <section className="lg:w-[90%] w-[96%] mx-auto my-[6%] text-right">
      <div className="flex justify-between items-center flex-row mt-5">
        <NavLink
          to="/announcment"
          className="group flex items-end text-[#E26629] hover:text-[#A6B78D] duration-300 text-base"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-block">
            <FontAwesomeIcon
              icon={faArrowLeft}
              size="2xs"
              className="-mb-1 mr-1"
            />
          </span>
          المزيد
        </NavLink>
        <h2 className="lg:text-2xl md:text-xl text-lg font-semibold text-[#E26629] md:mb-3">
          أخر المستجدات
        </h2>
      </div>

      {loading ? (
        <p>جاري تحميل البيانات...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
          {topNews.map((item) => (
            <div
              key={item.id}
              className="flex items-center lg:flex-nowrap flex-wrap p-5 pb-0 bg-[#A6B78D]/90 rounded-lg shadow-lg hover:shadow-xl relative"
            >
              {/* Image Section */}
              <div className="w-[40%] h-auto absolute -top-4 -bottom-4 right-4">
                <div
                  className="h-full bg-cover bg-center rounded-lg shadow-2xl"
                  style={{
                    backgroundImage: `url(http://camps.runasp.net/Uploads/${item.file})`,
                  }}
                ></div>
              </div>

              {/* Content Section */}
              <div className="w-[60%] py-2 pr-7 pl-0 text-right text-white">
                <p className="text-lg font-semibold mb-2 text-[#E26629]">
                  {item.title}
                </p>
                <p className="text-sm mb-4">
                  بتاريخ: {new Date(item.date).toLocaleDateString("ar-EG")}
                </p>
                <p className="text-base mb-2">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
