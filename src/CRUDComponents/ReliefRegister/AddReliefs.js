import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../TokenContext";
export default function AddReliefs() {
  const [item, setItems] = useState([]);
  const [camp, setCamps] = useState([]);
  const [org, setOrg] = useState([]);
  const [cer, setCer] = useState([]);
  const navigate = useNavigate();
  const [reliefRegister, setRefg] = useState({
    quantity: 0,
    itemId: 0,
    name: "",
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

  useEffect(() => {
    GetItems("http://camps.runasp.net/item");
    GetCamps("http://camps.runasp.net/camp");
    GetOrgannizations("http://camps.runasp.net/organization");
    GetCer("http://camps.runasp.net/distributioncriteria");
  }, []);

  async function postNotification() {
    const notification = {
      message: `  ${org.name} وصلتك مساعدة من مؤسسة  `,
      senderId: parseInt(1),
      receiverId: parseInt(reliefRegister.campManagerId),
    };
    console.log(notification);

    const resp = await fetch("http://camps.runasp.net/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(notification),
    });
  }

  async function hundleSubmit(e) {
    e.preventDefault();

    // 5. إنشاء المساعدة
    console.log(getcamp);

    const campRes = await fetch(
      `http://camps.runasp.net/camp/${getcamp.campId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!campRes.ok) throw new Error(`Failed to fetch camp ${getcamp.campId}`);

    const campData = await campRes.json();
    reliefRegister.campManagerId = campData.campManagerId;
    console.log(user.id);

    reliefRegister.orgManagerId = user.id;
    console.log(reliefRegister);
    const reliefResp = await fetch("http://camps.runasp.net/reliefregister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reliefRegister),
    });

    console.log("Response status:", reliefResp.status);
    if (reliefResp.ok) {
      const reliefData = await reliefResp.json();
      console.log("Relief Created:", reliefData);
      await postNotification();
      Swal.fire({
        icon: "success",
        title: "تم التسجيل",
        text: "تم تسجيل المساعدة بنجاح ✅",
        confirmButtonText: "موافق",
      }).then(
        setRefg({
          quantity: 0,
          itemId: 0,
          campId: 0,
          orgId: 0,
          distributionCriteriaId: 0,
          distributionDocId: 0,
        }),
        navigate("..")
      );
    } else {
      const errorText = await reliefResp.text();
      console.error("❌ Failed to create relief. Status:", reliefResp.status);
      console.error("Response body:", errorText);

      Swal.fire({
        icon: "error",
        title: "فشل التسجيل",
        text: "فشل في تسجيل المساعدة ❌",
        confirmButtonText: "حسنًا",
      });

      console.log(reliefRegister);
    }
  }
  function hundleRefChange(event) {
    const conc = event.target;
    setRefg((prev) => ({ ...prev, [conc.name]: conc.value }));
  }

  function hundleChange(event) {
    const conc = event.target;
    setCamp((prev) => ({ ...prev, [conc.name]: conc.value }));
  }

  async function GetItems(url) {
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setItems(data);
      } else throw new Error("Error " + resp.status);
    } catch (er) {
      console.error(er);
    }
  }

  async function GetCer(url) {
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setCer(data);
        reliefRegister.distributionCriteriaId =
          data[data.length - 1].id.toString();
      } else throw new Error("Error " + resp.status);
    } catch (er) {
      console.error(er);
    }
  }

  async function GetCamps(url) {
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setCamps(data);
      } else throw new Error("Error " + resp.status);
    } catch (er) {
      console.error(er);
    }
  }

  async function GetOrgannizations(url) {
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        setOrg(data);
      } else throw new Error("Error " + resp.status);
    } catch (er) {
      console.error(er);
    }
  }

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          تسجيل مساعدة
        </h2>
        <form onSubmit={hundleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              الاسم
            </label>
            <input
              onChange={hundleRefChange}
              type="text"
              required
              min={1}
              name="name"
              id="name"
              placeholder="ادخل الاسم"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              الكمية
            </label>
            <input
              onChange={hundleRefChange}
              type="number"
              required
              min={1}
              minLength={1}
              name="quantity"
              id="quantity"
              placeholder="ادخل الكمية"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="ItemId"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              النوع
            </label>
            <select
              onChange={hundleRefChange}
              required
              value={reliefRegister.itemId}
              name="itemId"
              id="ItemId"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option key="-1" value="-1" disabled>
                اختر تصنيف
              </option>
              {item.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="campId"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              المخيم
            </label>
            <select
              id="campId"
              required
              onChange={hundleChange}
              value={reliefRegister.campId}
              name="campId"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option key="-1" value="-1" disabled>
                اختر مخيم
              </option>
              {camp.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sel"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
            >
              المعايير
            </label>
            <select
              id="sel"
              required
              name="distributionCriteriaId"
              value={reliefRegister.distributionCriteriaId}
              onChange={hundleRefChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option disabled value="">
                اختر معيار
              </option>
              {cer.map((x) => (
                <option key={x.id} value={x.id}>
                  عدد الأسرة: {x.minimumFamilySize}, المستوى:{" "}
                  {x.vulnerabilityLevel}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ➕ تسجيل المساعدة
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
