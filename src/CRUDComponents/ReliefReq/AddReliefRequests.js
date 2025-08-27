import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../TokenContext";

export default function AddReliefRequests() {
  const [org, setOrg] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [reliefRequest, setReliefRequest] = useState({
    message: "",
    status: "",
    reliefType: "",
    neededQuantity: 0,
    campManagerId: 0,
    orgId: 0,
  });

  // let token = localStorage.getItem('token');
  const { token } = useContext(TokenContext);

  useEffect(() => {
    GetOrganizations("http://camps.runasp.net/organization");
    reliefRequest.campManagerId = user.id;
  }, []);

  function handleRefChange(event) {
    const { name, value, type, options } = event.target;

    if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setSelectedOrgs(selectedOptions);
    } else {
      setReliefRequest((prev) => ({ ...prev, [name]: value }));
    }

    if (
      (name === "neededQuantity" || name === "campManagerId") &&
      Number(value) <= 0
    ) {
      event.target.value = "";
      event.target.placeholder = "الرقم يجب أن يكون أكبر من صفر";
      setReliefRequest((prev) => ({ ...prev, [name]: "" }));
    } else {
      event.target.placeholder = "";
      setReliefRequest((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (selectedOrgs.length > 0) {
      try {
        for (let orgId of selectedOrgs) {
          const requestData = {
            ...reliefRequest,
            orgId: orgId,
          };
          await PostReliefRequest(
            "http://camps.runasp.net/reliefrequest",
            requestData
          );
        }
        Swal.fire({
          icon: "success",
          title: "تمت الإضافة!",
          text: "تم إضافة الطلب بنجاح 🎉",
          confirmButtonText: "رجوع",
        });
        navigate("..");
      } catch (error) {
        console.error("Error during POST request:", error);
        Swal.fire({
          icon: "success",
          title: "حدث خطأ!",
          text: "حدث خطأ أثناء إرسال الطلب.",
          confirmButtonText: "رجوع",
        });
      }
    } else {
      alert("من فضلك اختر مؤسسة واحدة على الأقل");
    }
  }

  async function PostReliefRequest(url, data) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        const responseData = await resp.json();
        return responseData;
      } else {
        throw new Error("Error: " + resp.status);
      }
    } catch (error) {
      console.error("Post request error:", error);
      throw error;
    }
  }

  async function GetOrganizations(url) {
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
        setOrg(data);
      } else {
        throw new Error("Error: " + resp.status);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#A6B78D] mb-8">
          إضافة طلب مساعدة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الرسالة
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="message"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل رسالتك"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              نوع المساعدة
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="reliefType"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل نوع المساعدة"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الحالة
            </label>
            <input
              onChange={handleRefChange}
              type="text"
              name="status"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الحالة"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              الكمية المطلوبة
            </label>
            <input
              onChange={handleRefChange}
              type="number"
              name="neededQuantity"
              min={0}
              minLength={0}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الكمية"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              اختر المؤسسات
            </label>
            <select
              name="orgId"
              value={selectedOrgs}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.options)
                  .filter((option) => option.selected)
                  .map((option) => option.value);
                setSelectedOrgs(selectedValues);
              }}
              multiple
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="" disabled>
                اختر مؤسسة
              </option>
              {org.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ إرسال طلب المساعدة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
