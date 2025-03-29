import { useState } from "react";
import History from "./History";

import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  // State to hold the APOD data
  const [apodData, setApodData] = useState({
    author: "",
    title: "",
    url: "",
    date: "",
    mediaType: "",
  });

  // State to hold the list of banned attributes (e.g., titles or authors)
  const [banList, setBanList] = useState([]);

  const [history, setHistory] = useState([]); // State to store previously displayed APODs

  // Function to fetch a random APOD from the NASA API
  const fetchRandomApod = async () => {
    let data;
    let isBanned;
    let attempts = 0;
    const maxAttempts = 5;

    // Helper function to generate a random date between June 16, 1995, and today
    const getRandomDate = () => {
      const start = new Date(1995, 5, 16); // APOD API supports dates starting from June 16, 1995
      const end = new Date(); // Today's date
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      return randomDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    // Loop to fetch data until a non-banned result is found or the maximum attempts are reached
    do {
      const randomDate = getRandomDate(); // Generate a random date
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${ACCESS_KEY}&date=${randomDate}`);
      data = await response.json();
      console.log(data);

      // Check if the result is banned based on the title or author
      isBanned = banList.includes(data.title) || banList.includes(data.copyright || "Unknown");
      attempts++;
    } while (isBanned && attempts < maxAttempts);

    // If no suitable result is found after the maximum attempts, alert the user
    if (attempts >= maxAttempts) {
      alert("No suitable image found after multiple attempts. Please adjust your ban list.");
      return;
    }

    // Update the state with the fetched data
    setApodData({
      author: data.copyright || "Unknown",
      title: data.title,
      url: data.url,
      date: data.date,
      mediaType: data.media_type, // "image" or "video"
    });

    // Add the new APOD to the history
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        author: data.copyright || "Unknown",
        title: data.title,
        url: data.url,
        date: data.date,
        mediaType: data.media_type,
      },
    ]);
  };

  // Function to handle adding or removing attributes from the ban list
  const handleAttributeClick = (attribute) => {
    // Check if the attribute is already in the ban list
    if (banList.includes(attribute)) {
      // If it is, remove it from the ban list
      setBanList(banList.filter((item) => item !== attribute));
    } else {
      // If it isn't, add it to the ban list
      setBanList([...banList, attribute]);
    }
  };

  return (
    <>
      <h1>NASA APOD Viewer</h1>
      <div>
        <h2>Explore the Cosmos!</h2>
        {apodData.url && (
          <div className="apod-container">
            <h2>{apodData.title}</h2>
            <p onClick={() => handleAttributeClick(apodData.author)}>Author: {apodData.author}</p>
            <p onClick={() => handleAttributeClick(apodData.date)}>Date: {apodData.date}</p>
            {apodData.mediaType === "video" ? (
              <iframe
                width="560"
                height="315"
                src={apodData.url}
                title={apodData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img src={apodData.url} alt={apodData.title} />
            )}
          </div>
        )}
        <button onClick={fetchRandomApod}>Discover</button>
        <div className="ban-list">
          <h3>Ban List:</h3>
          <ul>
            {banList.map((item, index) => (
              <li key={index} onClick={() => handleAttributeClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* Render the History component only once */}
        <History history={history} />
      </div>
    </>
  );
}

export default App;
