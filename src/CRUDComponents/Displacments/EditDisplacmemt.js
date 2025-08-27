import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { TokenContext } from "../../TokenContext";

export default function EditDisplacement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [allcamps, setallCamps] = useState([]);

  const [dps, setDps] = useState();
  const [memberfamily, setMemberfamily] = useState([]);

  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  // let token=localStorage.getItem("token")
  const { token } = useContext(TokenContext);

  useEffect(() => {
    GetDisplacementById(`http://camps.runasp.net/displacement/${id}`);
    GetCamps("http://camps.runasp.net/camp");
    GetAllCamps("http://camps.runasp.net/DisCamps");
  }, [0]);

  useEffect(() => {
    if (camps.length > 0) {
      if (camps[0].id == displacement.campIdFrom) {
        console.log(" not Editable");

        setEdit(false);
      } else {
        setEdit(true);
        console.log("Editable");
      }
    }
  }, [camps.length]);

  const [displacement, setDisplacement] = useState({
    reason: "",
    dpsId: "",
    campIdTo: "",
    campIdFrom: "",
    approved: "",
  });

  function handleRefChange(event) {
    const { name, value, type, checked } = event.target;
    setDisplacement((pre) => ({
      ...pre,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function delDp() {
    await fetch(`http://camps.runasp.net/dps/${dps.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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
    console.log(displacement);

    const response = await fetch(`http://camps.runasp.net/displacement/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(displacement),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل الانتقال بنجاح ✏️",
        confirmButtonText: "رجوع",
      }).then(async () => {
        if (edit) {
          console.log("inedit");

          if (displacement.approved) {
            const dp = { ...dps, campId: displacement.campIdTo };

            await fetch(`http://camps.runasp.net/dps/${dp.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(dp),
            });

            if (memberfamily.length > 0) {
              for (let o of memberfamily) {
                const member = { ...o, campId: displacement.campIdTo };
                await fetch(`http://camps.runasp.net/dps/${member.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(member),
                });
              }
            }
          }
        }
        // navigate('..');
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء التعديل",
      });
    }
  }

  async function GetAllCamps(url) {
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
        setallCamps(data);
      }
    } catch (error) {
      console.error(error);
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
        setCamps(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
        console.log(data);

        setDps(data);
        const res = await fetch(
          `http://camps.runasp.net/dps/byidentification2/${data.identificationnumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let family = await res.json();
        setMemberfamily(family);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function GetDisplacementById(url) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDisplacement(data);
        console.log(data);

        GetDps(`http://camps.runasp.net/dps/${data.dpsId}`);
      } else {
        console.error("حدث خطأ في تحميل بيانات الانتقال");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="text-center text-gray-700">جارٍ تحميل البيانات...</p>;

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-2xl text-center font-bold text-gray-900 dark:text-white">
          تعديل الانتقال
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
                disabled={edit}
                onChange={handleRefChange}
                type="text"
                name="reason"
                value={displacement.reason}
                id="reason"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                disabled={edit}
                id="dps"
                name="dpsId"
                value={displacement.dpsId}
                onChange={handleRefChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="" disabled>
                  اختر شخص
                </option>

                {dps && (
                  <option key={dps.id} value={dps.id}>
                    {dps.fname}
                    {dps.lname}
                  </option>
                )}
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
                disabled={edit}
                id="campTo"
                name="campIdTo"
                value={displacement.campIdTo}
                onChange={handleRefChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="" disabled>
                  اختر المخيم الجديد
                </option>
                {edit
                  ? camps.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))
                  : allcamps.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {edit ? (
            <div className="flex items-center gap-3 mt-4">
              <input
                onChange={handleRefChange}
                type="checkbox"
                name="approved"
                checked={displacement.approved}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded mt-5"
              />
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                تفعيل
              </label>
            </div>
          ) : (
            ""
          )}

          <hr className="h-[1.7px] w-full bg-gray-300 mt-[60px] mb-[60px]" />
          <button
            type="submit"
            className="inline-flex bg-blue-700 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
          >
            حفظ
          </button>
        </form>
      </div>
    </section>
  );
}
