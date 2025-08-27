import React, { useState, useEffect } from "react";

const DistributionDocs = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  let token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://camps.runasp.net/DocswithReliefs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDocs(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  //  تجميع التوثيقات حسب رقم المساعدة
  const groupedDocs = docs.reduce((acc, doc) => {
    if (!acc[doc.reliefRegisterId]) {
      acc[doc.reliefRegisterId] = {
        quantity: doc.quantity,
        docs: [],
      };
    }

    acc[doc.reliefRegisterId].docs.push({
      imageUrl: doc.imageUrl,
      date: doc.date,
    });

    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h1>توثيقات المساعدات</h1>

      {Object.entries(groupedDocs).map(([reliefId, data]) => (
        <div
          key={reliefId}
          style={{
            border: "2px solid #ccc",
            borderRadius: "8px",
            marginBottom: "30px",
            padding: "15px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>رقم المساعدة: {reliefId}</h2>
          <p>
            <strong>الكمية:</strong> {data.quantity}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {data.docs.map((doc, index) => (
              <div
                key={index}
                style={{
                  margin: "10px",
                  width: "220px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                  {doc.date}
                </p>
                <img
                  src={doc.imageUrl}
                  alt="توثيق"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DistributionDocs;
