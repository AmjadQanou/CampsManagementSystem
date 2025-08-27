import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { TokenContext } from "../../TokenContext";

export default function EditReliefRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [relief, setRelief] = useState({
    name: "",
    quantity: 0,
    itemId: 0,
    campManagerId: 0,
    orgManagerId: 0,
    distributionCriteriaId: 0,
    IsRecived: false,
  });

  const [getcamp, setCamp] = useState({
    campId: 0,
  });

  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [camps, setCamps] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [cers, setCers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    await Promise.all([
      fetchItems(),
      fetchCamps(),
      fetchOrgs(),
      fetchCriteria(),
    ]);
    await fetchRelief();
  }

  async function fetchItems() {
    const res = await fetch("https://camps.runasp.net/item", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) setItems(await res.json());
  }

  async function postNotification() {
    const notification = {
      message: `${relief.name} تم رفع التوثيق للمساعدة `,
      senderId: parseInt(relief.campManagerId),
      receiverId: parseInt(relief.orgManagerId),
    };
    console.log(notification);

    const resp = await fetch("https://camps.runasp.net/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notification),
    });
  }

  async function fetchCamps() {
    const res = await fetch("https://camps.runasp.net/camp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) setCamps(await res.json());
  }

  async function PostDistributionDoc(url) {
    try {
      const formData = new FormData();
      const fileInput = document.getElementById("file");
      formData.append("file", fileInput.files[0]);
      formData.append("reliefRegisterId", id);

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log("Document Created:", data);
        if (data.id != 0) {
          postNotification();
        }
        return data.id;
      } else throw new Error("Error posting document: " + resp.status);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function fetchOrgs() {
    const res = await fetch("https://camps.runasp.net/organization", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) setOrgs(await res.json());
  }

  async function fetchCriteria() {
    const res = await fetch("https://camps.runasp.net/distributioncriteria", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) setCers(await res.json());
  }

  async function fetchRelief() {
    const res = await fetch(`https://camps.runasp.net/reliefregister/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setRelief({
        quantity: data.quantity,
        name: data.name,
        itemId: data.itemId,
        campManagerId: data.campManagerId,
        orgManagerId: data.orgManagerId,
        distributionCriteriaId: data.distributionCriteriaId,
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setRelief((prev) => ({ ...prev, [name]: value }));
  }
  function hundleRefChange(event) {
    const conc = event.target;
    setCamp((prev) => ({ ...prev, [conc.name]: conc.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    PostDistributionDoc("https://camps.runasp.net/distributiondocumentation");

    if (!relief.quantity || relief.quantity <= 0) {
      Swal.fire({
        icon: "warning",
        title: "خطأ في الكمية",
        text: "يرجى إدخال كمية صحيحة",
      });
      return;
    }
    if (user.role == "OrganizationManager") {
      const campRes = await fetch(
        `https://camps.runasp.net/camp/${getcamp.campId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!campRes.ok)
        throw new Error(`Failed to fetch camp ${getcamp.campId}`);

      const campData = await campRes.json();
      relief.campManagerId = campData.campManagerId;
      console.log(user.id);

      relief.orgManagerId = user.id;
    }
    try {
      const res = await fetch(`https://camps.runasp.net/reliefregister/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(relief),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التعديل",
          text: "تم تعديل بيانات المساعدة بنجاح",
          confirmButtonText: "رجوع",
        });
        navigate("..");
      } else {
        Swal.fire({
          icon: "error",
          title: "فشل التعديل",
          text: "حدث خطأ أثناء التعديل",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ في الشبكة",
        text: "تعذر الاتصال بالخادم",
      });
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تعديل بيانات المساعدة
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              الاسم
            </label>
            <input
              onChange={handleChange}
              type="text"
              required
              name="name"
              value={relief.name}
              disabled={user.role == "CampManager"}
              id="name"
              placeholder="ادخل الاسم"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              الكمية
            </label>
            <input
              type="number"
              name="quantity"
              value={relief.quantity}
              disabled={user.role == "CampManager"}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ادخل الكمية"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              النوع
            </label>
            <select
              name="itemId"
              value={relief.itemId}
              disabled={user.role == "CampManager"}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">اختر النوع</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              المخيم
            </label>
            <select
              name="campId"
              disabled={user.role == "CampManager"}
              value={getcamp.campId}
              onChange={hundleRefChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">اختر المخيم</option>
              {camps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white text-end">
              معيار التوزيع
            </label>
            <select
              name="distributionCriteriaId"
              disabled={user.role == "CampManager"}
              value={relief.distributionCriteriaId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">اختر معيار</option>
              {cers.map((c) => (
                <option key={c.id} value={c.id}>
                  عدد الأسرة: {c.minimumFamilySize} - مستوى:{" "}
                  {c.vulnerabilityLevel}
                </option>
              ))}
            </select>
          </div>
          <hr className="h-[1.7px] w-full bg-gray-300  text-gray-300 mt-[60px] mb-[60px]" />
          <div>
            <label
              for="file"
              class="block mb-2 text-end text-sm font-medium text-gray-900 dark:text-white"
            >
              توثيق التوزيع
            </label>
            <input
              type="file"
              name="file"
              id="file"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder=""
              required=""
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              📝 تعديل بيانات المساعدة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
