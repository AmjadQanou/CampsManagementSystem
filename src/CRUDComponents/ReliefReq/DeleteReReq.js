import React, { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TokenContext } from "../../TokenContext";

export default function DeleteReReq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(TokenContext);

  useEffect(() => {
    const confirmDelete = window.confirm(
      "هل أنت متأكد أنك تريد حذف هذا الطلب؟"
    );

    if (!confirmDelete) {
      navigate("/reliefreq");
      return;
    }

    const deleteRequest = async () => {
      try {
        const response = await fetch(
          `http://camps.runasp.net/reliefrequest/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert("تم حذف الطلب بنجاح!");
          navigate("/reliefreq");
        } else {
          const errorText = await response.text();
          alert(`فشل في الحذف: ${errorText}`);
        }
      } catch (error) {
        alert("حدث خطأ أثناء الحذف: " + error.message);
        console.error(error);
      }
    };

    deleteRequest();
  }, [id, navigate]);

  return null; // لا حاجة لعرض شيء في الصفحة
}
