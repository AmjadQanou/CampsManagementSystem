import axios from "axios";
import { createContext, useState, useEffect } from "react";

export let ApiContext = createContext();

export default function ApiContextProvider(props) {
  const [camps, setCamps] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [organizationManagers, setOrganizationManagers] = useState([]);
  const [campManagers, setCampManagers] = useState([]);
  const [reliefs, setReliefs] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch camps data
  const getCamps = async () => {
    try {
      const campsResponse = await axios.get(
        "http://camps.runasp.net/maincamps"
      );
      setCamps(campsResponse.data);
    } catch (error) {
      console.error("Error fetching camps:", error);
    }
  };

  // Fetch organizations data
  const getOrgs = async () => {
    try {
      const orgResponse = await axios.get(
        "http://camps.runasp.net/allorganization"
      );
      setOrganizations(orgResponse.data);
      console.log(orgResponse.data, "Organizations fetched");
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  // Fetch news data
  const getNews = async () => {
    try {
      const newsResponse = await axios.get(
        "http://camps.runasp.net/announcments"
      );
      setNews(newsResponse.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const getOrganizationManagers = async () => {
    try {
      const response = await axios.get(
        "http://camps.runasp.net/organizationmanager"
      );
      setOrganizationManagers(response.data);
      console.log(response.data, "Organization Managers fetched");
    } catch (error) {
      console.error("Error fetching organization managers:", error);
    }
  };
  const getCampManagers = async () => {
    try {
      const response = await axios.get("http://camps.runasp.net/campmanagers");
      setCampManagers(response.data);
      console.log(response.data, "camp Managers fetched");
    } catch (error) {
      console.error("Error fetching camp managers:", error);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      await getCamps();
      await getOrgs();
      await getOrganizationManagers();
      await getCampManagers();
      await getNews();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("حدث خطأ أثناء جلب البيانات. الرجاء المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        camps,
        news,
        organizations,
        organizationManagers,
        campManagers,
        loading,
        error,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
}
