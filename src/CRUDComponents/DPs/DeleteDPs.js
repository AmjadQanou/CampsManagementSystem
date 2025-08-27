import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TokenContext } from "../../TokenContext";
import { Await, useNavigate, useParams } from "react-router-dom";

export default function DeleteDPs() {
  const { id } = useParams();
  const navigate = useNavigate();
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);
  const [dp, setDp] = useState();

  async function GetDps(url) {
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
        await setDp(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    async function fetchData() {
      await GetDps(`http://camps.runasp.net/dps/${id}`);
      await console.log(dp);
    }

    fetchData();
  }, [0]);

  useEffect(() => {
    const confirmAndDelete = async () => {
      //  Swal.fire({
      //       title: 'هل أنت متأكد؟',
      //       text: "لا يمكنك التراجع بعد الحذف!",
      //       icon: 'warning',
      //       showCancelButton: true,
      //       confirmButtonColor: '#d33',
      //       cancelButtonColor: '#3085d6',
      //       confirmButtonText: 'نعم، احذفه',
      //       cancelButtonText: 'إلغاء'
      //     });

      if (id) {
        try {
          const response = await fetch(`http://camps.runasp.net/dps/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            console.log(dp);

            await Swal.fire({
              icon: "success",
              title: "تم الحذف",
              text: "تم حذف لحالة بنجاح.",
              confirmButtonText: "حسنًا",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "خطأ أثناء الحذف",
            text: error.message || "حدث خطأ غير متوقع",
          });
          console.error(error);
        }
      }
    };
    confirmAndDelete();
  }, [id]);

  useEffect(() => {
    async function del() {
      if (dp) {
        await fetch(
          `http://camps.runasp.net/dps/by-identification/${dp.identificationnumber}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("..");
      }
    }

    if (dp.parentId == 0) {
      del();
    }
  }, [dp]);

  return null; // لا حاجة لعرض شيء في ا
}
