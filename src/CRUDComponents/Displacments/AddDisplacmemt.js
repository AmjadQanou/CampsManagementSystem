import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  campService,
  displacementService,
  dpService,
} from "../../services/apiService";

export default function AddDisplacement() {
  const [camps, setCamps] = useState([]);
  const [ca, setCa] = useState();
  const [dps, setDps] = useState([]);
  const navigate = useNavigate();

  const [displacement, setDisplacement] = useState({
    reason: "",
    dpsId: "",
    campIdTo: "",
    campIdFrom: "",
    approved: false,
  });

  useEffect(() => {
    GetAllCamps();
    GetDps();
    GetCamps();
  }, []);

  function handleRefChange(event) {
    const { name, value } = event.target;
    setDisplacement((pre) => ({ ...pre, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (displacement.campIdFrom === displacement.campIdTo) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه!",
        text: "لا يمكن أن يكون المخيم الجديد نفس المخيم الحالي",
      });
      return;
    }

    displacement.campIdFrom = ca[0].id;

    try {
      await displacementService.create(displacement);

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة!",
        text: "تم إضافة الانتقال بنجاح 🎉",
        confirmButtonText: "رجوع",
      }).then(() => {
        setDisplacement({
          reason: "",
          dpsId: "",
          approved: false,
          campIdTo: "",
          campIdFrom: "",
        });
        navigate("..");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ!",
        text: "يرجى المحاولة لاحقًا",
      });
    }
  }

  async function GetCamps() {
    try {
      const resp = await campService.getAll();
      setCa(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetAllCamps() {
    try {
      const resp = await campService.getAllOtherCamps();
      setCamps(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetDps() {
    try {
      const resp = await dpService.getParents();
      setDps(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-2xl text-center font-bold text-gray-900 dark:text-white">
          إضافة انتقال جديد
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="reason"
                className="block mb-2 text-sm font-medium text-end text-gray-900 dark:text-white"
              >
                سبب الانتقال
              </label>
              <input
                onChange={handleRefChange}
                type="text"
                name="reason"
                value={displacement.reason}
                id="reason"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="اكتب السبب"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dps"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                الشخص النازح
              </label>
              <select
                id="dps"
                required
                name="dpsId"
                value={displacement.dpsId}
                onChange={handleRefChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="" disabled>
                  اختر شخص
                </option>
                {dps.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.fname}
                    {x.lname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="campTo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                المخيم الجديد
              </label>
              <select
                id="campTo"
                required
                name="campIdTo"
                value={displacement.campIdTo}
                onChange={handleRefChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="" disabled>
                  اختر المخيم الجديد
                </option>
                {camps.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="h-[1.7px] w-full bg-gray-300 mt-[60px] mb-[60px]" />

          <button
            type="submit"
            className="inline-flex bg-blue-700 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
          >
            إضافة
          </button>
        </form>
      </div>
    </section>
  );
}
