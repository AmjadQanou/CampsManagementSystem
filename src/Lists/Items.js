import React, { useContext, useEffect, useState } from "react";
import Table from "../CRUDComponents/Table";
import { AuthContext } from "../AuthProvider";
import { TokenContext } from "../TokenContext";

export default function Items() {
  const { token } = useContext(TokenContext);

  const [items, setItems] = useState();
  const [query, setQuery] = useState("");
  const [hidebtn, sethidebtn] = useState(false);
  const [hideactions, sethideActions] = useState(false);
  const { user } = useContext(AuthContext);
  console.log(query);

  const columnsToExclude = ["reliefRegisters"];
  useEffect(() => {
    if (user.role == "CampManager") {
      sethideActions(true);
      sethidebtn(true);
    }
    const delayDebounce = setTimeout(() => {
      GetItems(
        `http://camps.runasp.net/item?query=${encodeURIComponent(query)}`
      );
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);
  // let token=localStorage.getItem("token")

  // const handleDelete = async (id) => {
  //   try {
  //     await fetch(`http://camps.runasp.net/item/${id}`, {
  //       method: 'DELETE',
  //     });
  //     setItems((prev) => prev.filter((dp) => dp.id !== id));
  //   } catch (error) {
  //     console.error('Failed to delete DP:', error);
  //     alert('حدث خطأ أثناء الحذف. الرجاء المحاولة مرة أخرى.');
  //   }
  // };

  async function GetItems(url) {
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
        setItems(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }
  return (
    items && (
      <div>
        <Table
          tableName={"مساعدات"}
          list={items}
          columnsToExclude={columnsToExclude}
          searchValue={query}
          setSearchValue={setQuery}
          hidebtn={hidebtn}
          hideactions={hideactions}
        />
      </div>
    )
  );
}
