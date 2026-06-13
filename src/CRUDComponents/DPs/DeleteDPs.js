import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { dpService } from "../../services/apiService";

export default function DeleteDPs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dp, setDp] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const resp = await dpService.getById(id);
        setDp(resp.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!dp) return;

    const confirmAndDelete = async () => {
      try {
        await dpService.delete(id);

        await Swal.fire({
          icon: "success",
          title: "تم الحذف",
          text: "تم حذف لحالة بنجاح.",
          confirmButtonText: "حسنًا",
        });

        if (dp.parentId === 0) {
          await dpService.deleteByIdentification(dp.identificationnumber);
        }

        navigate("..");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ أثناء الحذف",
          text: error?.response?.data || "حدث خطأ غير متوقع",
        });
        console.error(error);
      }
    };

    confirmAndDelete();
  }, [dp]);

  return null;
}
