import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";

export default function EditReliefRequests() {
  const [org, setOrg] = useState([]);
  const [camp, setCamp] = useState();

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reliefRequest, setReliefRequest] = useState({
    message: "",
    status: "",
    reliefType: "",
    neededQuantity: 0,
    campManagerId: 0,
    orgId: [],
  });

  // const token = localStorage.getItem("token");
  const { token } = useContext(TokenContext);

  useEffect(() => {
    GetReliefRequest(`https://camps.runasp.net/reliefrequest/${id}`);
    GetOrganizations("https://camps.runasp.net/organization");
    GetCamps("https://camps.runasp.net/camp");
    if (user.role == "CampManager") {
      reliefRequest.campManagerId = user.id;
    }
  }, []);

  async function GetReliefRequest(url) {
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
        setReliefRequest(data);
      } else throw new Error("error " + resp.status);
    } catch (er) {
      console.error(er);
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
      } else throw new Error("error " + resp.status);
    } catch (er) {
      console.error(er);
    }
  }

  async function GetCamps(url) {
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
        setCamp(data);
      } else throw new Error("error " + resp.status);
    } catch (er) {
      console.error(er);
    }
  }

  function handleRefChange(event) {
    const { name, value, type, options } = event.target;

    if (type === "select-multiple") {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setReliefRequest((prev) => ({ ...prev, orgId: selected }));
    } else {
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let resp = await fetch(`https://camps.runasp.net/reliefrequest/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reliefRequest),
      });
      if (resp.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التحديث بنجاح!",
          text: "تم تحديث الطلب بنجاح 🎉",
          confirmButtonText: "رجوع",
        });
        navigate("..");
      } else throw new Error("error " + resp.status);
    } catch (er) {
      Swal.fire({
        icon: "success",
        title: "حدث خطأ!",
        text: "حدث خطأ أثناء إرسال الطلب.",
        confirmButtonText: "رجوع",
      });
      console.error(er);
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#A6B78D] mb-8">
          تعديل طلب المساعدة
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
              value={reliefRequest.message}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              value={reliefRequest.reliefType}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              value={reliefRequest.status}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              value={reliefRequest.neededQuantity}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#A6B78D] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          {user.role == "SystemManager" ? (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                اختر مخيم
              </label>
              <select
                required
                name="campManagerId"
                value={reliefRequest.campManagerId}
                onChange={handleRefChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">اختر مخيم</option>
                {camp.map((x) => (
                  <option key={x.campManagerId} value={x.campManagerId}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ""
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              اختر المؤسسات
            </label>
            <select
              name="orgId"
              required
              value={reliefRequest.orgId}
              onChange={handleRefChange}
              multiple
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
              💾 تحديث طلب المساعدة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
