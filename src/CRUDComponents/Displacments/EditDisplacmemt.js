import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import {
  campService,
  displacementService,
  dpService,
} from "../../services/apiService";

export default function EditDisplacement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camps, setCamps] = useState([]);
  const [allcamps, setallCamps] = useState([]);
  const [dps, setDps] = useState();
  const [memberfamily, setMemberfamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    GetDisplacementById();
    GetCamps();
    GetAllCamps();
  }, []);

  useEffect(() => {
    if (camps.length > 0) {
      if (camps[0].id === displacement.campIdFrom) {
        setEdit(false);
      } else {
        setEdit(true);
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

    try {
      await displacementService.update(id, displacement);

      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل الانتقال بنجاح ✏️",
        confirmButtonText: "رجوع",
      }).then(async () => {
        if (edit && displacement.approved) {
          const dp = { ...dps, campId: displacement.campIdTo };
          await dpService.update(dp.id, dp);

          if (memberfamily.length > 0) {
            for (let o of memberfamily) {
              const member = { ...o, campId: displacement.campIdTo };
              await dpService.update(member.id, member);
            }
          }
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء التعديل",
      });
    }
  }

  async function GetAllCamps() {
    try {
      const resp = await campService.getOtherCamps();
      setallCamps(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetCamps() {
    try {
      const resp = await campService.getAll();
      setCamps(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetDps(dpId) {
    try {
      const resp = await dpService.getById(dpId);
      const data = resp.data;
      setDps(data);

      const familyResp = await dpService.getByIdentification2(
        data.identificationnumber,
      );
      setMemberfamily(familyResp.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetDisplacementById() {
    try {
      const resp = await displacementService.getById(id);
      const data = resp.data;
      setDisplacement(data);
      await GetDps(data.dpsId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center flex-1 min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
      </div>
    );

  return (
    <section className="flex flex-col flex-1 w-full h-full bg-gray-50 items-center justify-center py-10">
      <div
        className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm p-6 w-full max-w-2xl"
        dir="rtl"
      >
        <h2 className="text-lg font-bold text-[#2D2926] border-b border-[#F0EDE9] pb-3 mb-6 text-center">
          تعديل الانتقال
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-[#7A706A] mb-1.5"
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
                className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2.5 text-sm text-[#2D2926] bg-white focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] transition disabled:bg-[#F9F7F4] disabled:text-[#B0A89E]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dps"
                className="block text-sm font-medium text-[#7A706A] mb-1.5"
              >
                الشخص النازح
              </label>
              <select
                disabled={edit}
                id="dps"
                name="dpsId"
                value={displacement.dpsId}
                onChange={handleRefChange}
                className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2.5 text-sm text-[#2D2926] bg-white focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] transition disabled:bg-[#F9F7F4] disabled:text-[#B0A89E]"
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
                className="block text-sm font-medium text-[#7A706A] mb-1.5"
              >
                المخيم الجديد
              </label>
              <select
                disabled={edit}
                id="campTo"
                name="campIdTo"
                value={displacement.campIdTo}
                onChange={handleRefChange}
                className="w-full border border-[#E8E4DE] rounded-lg px-3 py-2.5 text-sm text-[#2D2926] bg-white focus:outline-none focus:ring-2 focus:ring-[#A6B78D]/40 focus:border-[#A6B78D] transition disabled:bg-[#F9F7F4] disabled:text-[#B0A89E]"
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

          {edit && (
            <div className="flex items-center gap-3 bg-[#F9F7F4] border border-[#E8E4DE] rounded-lg px-3 py-2.5">
              <input
                onChange={handleRefChange}
                type="checkbox"
                name="approved"
                checked={displacement.approved}
                className="w-4 h-4 accent-[#A6B78D]"
              />
              <label className="text-sm font-medium text-[#2D2926]">
                تفعيل
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#F0EDE9]">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm rounded-lg text-white font-medium transition shadow-sm bg-[#A6B78D] hover:bg-[#8ca170] hover:shadow-md"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
