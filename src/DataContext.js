import { use, useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { TokenContext } from "./TokenContext";

export let DataContext = createContext();
export function DataContextProvider(props) {
  const { token } = useContext(TokenContext);

  const [Camps, setCamps] = useState();
  const [CampManagers, setCampManagers] = useState();
  const [displacments, setDisplacments] = useState();

  useEffect(() => {
    async function GetAll() {
      await getCamps("https://camps.runasp.net/allcamp");
      //  await getCampManagers("https://camps.runasp.net/campmanagers")
      //  await getDisplacments("https://camps.runasp.net/displacement")
    }
    GetAll();
  }, [0]);

  async function getCamps(url) {
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
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  async function getCampManagers(url) {
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
        setCampManagers(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  async function getDisplacments(url) {
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
        setDisplacments(data);
      } else throw new Error("error" + resp.status);
    } catch (er) {
      console.error(er);
      return null;
    }
  }

  return (
    <DataContext.Provider value={{ Camps, CampManagers, displacments }}>
      {props.children}
    </DataContext.Provider>
  );
}
