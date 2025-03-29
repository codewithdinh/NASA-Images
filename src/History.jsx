import React from "react";

const History = ({ history }) => {
  return (
    <div>
      <h3>Previously Displayed Images</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {history.map((item, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h4>{item.title}</h4>
            {item.mediaType === "video" ? (
              <iframe
                width="200"
                height="150"
                src={item.url}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img src={item.url} alt={item.title} style={{ width: "100%" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;