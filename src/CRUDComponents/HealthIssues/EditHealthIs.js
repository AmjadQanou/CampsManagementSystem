import React, { useContext, useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";
export default function EditHealthIs() {
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();

  const { id } = useParams();
  const [healthIssues, setHealthIssues] = useState({
    name: "",
    type: "",
  });
  useEffect(() => {
    console.log(id);
    GetHealthIs(`http://camps.runasp.net/healthisuues/${id}`);
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    // إرسال البيانات
    const response = await fetch(`http://camps.runasp.net/healthisuues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(healthIssues),
    });

    // بعد نجاح الإضافة
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل المشكلة بنجاح 🎉",
        confirmButtonText: "رجوع",
      }).then(() => {});
    } else {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ!",
        text: "يرجى المحاولة لاحقًا",
      });
      navigate("..");
    }
  }
  function hundleChange(event) {
    const conc = event.target;
    setHealthIssues((pre) => ({ ...pre, [conc.name]: conc.value }));
  }
  async function GetHealthIs(url) {
    try {
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        let data = await resp.json();
        setHealthIssues(data);
        console.log(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    <section class="bg-white dark:bg-gray-900">
      <div class="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          تعديل مشكلة صحية
        </h2>
        <form action="post">
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ادخل الاسم
              </label>
              <input
                onChange={hundleChange}
                value={healthIssues.name}
                type="text"
                name="name"
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="ادخل الاسم"
                required
              />
            </div>
            <div class="sm:col-span-2">
              <label
                for="type"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ادخل النوع
              </label>
              <input
                onChange={hundleChange}
                value={healthIssues.type}
                type="text"
                name="type"
                id="type"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="ادخل النوع"
                required
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            تعديل
          </button>
        </form>
      </div>
    </section>
  );
}
