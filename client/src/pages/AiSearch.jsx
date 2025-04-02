import React, { useState } from "react";
import axios from "axios";
import { Navbar } from "../components";

const AiSearch = () => {
  const [code, setCode] = useState(""); // Input search term (code)
  const [searchResults, setSearchResults] = useState(null); // Results from the backend
  const [isLoading, setIsLoading] = useState(false); // Loading state for search
  const [error, setError] = useState(null); // Error handling state

    const handleSearch = async () => {
      console.log(code)
    const response = await axios.post("http://localhost:5001/AiSearch", {
        code,
        
    });
    setSearchResults(response.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar /> {/* Assuming this is your navigation bar component */}
      <div style={{ maxWidth: "100%", marginTop: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Code Input */}
          <input
            type="text"
            placeholder="Enter code here..."
            value={code}
            onChange={(e) => {
              console.log("Code updated:", e.target.value); // Log updated code on change
              setCode(e.target.value);
            }}
            style={{
              padding: "10px",
              width: "70%",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              marginLeft: "10px",
              backgroundColor: "#ff5722",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Display Results */}
        <div
          style={{
            width: "100%",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minHeight: "300px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          {/* Display any errors */}
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h4>Search Results:</h4>
              {searchResults && searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((result, index) => (
                    <li key={index}>{result}</li> // Display each result (can adjust based on the response format)
                  ))}
                </ul>
              ) : (
                <p>No results found for the given code.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSearch;
