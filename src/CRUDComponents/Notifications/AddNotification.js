import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider";

export default function AddNotification() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [receiverType, setReceiverType] = useState("");
  const [receiverList, setReceiverList] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  // تحميل بيانات الأشخاص بناءً على نوعهم
  useEffect(() => {
    if (!receiverType) return;

    let url = "";
    if (receiverType === "CampManager")
      url = "http://camps.runasp.net/allcampmanagers";
    else if (receiverType === "OrgManager")
      url = "http://camps.runasp.net/organizationmanager";
    else if (receiverType === "DP") url = "http://camps.runasp.net/dps";

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReceiverList(data))
      .catch((err) => console.error(err));
    console.log(receiverList);
  }, [receiverType.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notification = {
      message,
      senderId: parseInt(user.id),
      receiverId: parseInt(receiverId),
    };

    const res = await fetch("http://camps.runasp.net/notification", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });

    if (res.ok) {
      Swal.fire("تم الإرسال", "تم إرسال الإشعار بنجاح ✅", "success");
      setMessage("");
      setReceiverType("");
      setReceiverList([]);
    } else {
      console.log(notification);
      Swal.fire("فشل", "حدث خطأ أثناء إرسال الإشعار ❌", "error");
    }
  };
  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4"
      dir="rtl"
    >
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 w-full max-w-3xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-[#DC7F56] mb-8">
          ✉️ إرسال إشعار
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              نوع المستلم
            </label>
            <select
              value={receiverType}
              onChange={(e) => {
                setReceiverType(e.target.value);
                setReceiverId("");
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">-- اختر نوع المستلم --</option>
              {user.role === "SystemManager" && (
                <>
                  <option value="OrgManager">مدير مؤسسة</option>
                  <option value="CampManager">مدير مخيم</option>
                  <option value="DP">شخص نازح</option>
                </>
              )}
              {user.role === "CampManager" && (
                <>
                  <option value="OrgManager">مدير مؤسسة</option>
                  <option value="CampManager">مدير مخيم</option>
                </>
              )}
              {user.role === "OrganizationManager" && (
                <option value="CampManager">مدير مخيم</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              المستلم
            </label>
            <select
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="">-- اختر المستلم --</option>
              {receiverList.length > 0 &&
                receiverList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fname} {r.lname}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
              نص الإشعار
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-[#DC7F56] focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows="5"
              placeholder="اكتب نص الإشعار هنا..."
              required
            ></textarea>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#DC7F56] hover:bg-[#c46b45] text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300"
            >
              ✉️ إرسال الإشعار
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
