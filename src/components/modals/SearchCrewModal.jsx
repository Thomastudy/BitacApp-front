import React, { useState } from "react";
import axios from "../../config/axios";
import "./SearchCrewModal.css";

const SearchCrewModal = ({
  onClose,
  onSelectCrewMember,
  onSelectGuestCrew,
  guestNedded = true,
  
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Search for registered crew members
  const searchCrewMembers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `/api/sessions/search?username=${query}`
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error searching crew members:", error);
      setSearchResults([]);
    }
  };

  // Handle input changes
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchCrewMembers(query);
  };

  // Handle selecting a registered crew member
  const handleSelectMember = (member) => {
    onSelectCrewMember(member);
    onClose();
  };

  // Handle adding as guest
  const handleAddAsGuest = () => {
    onSelectGuestCrew(searchQuery);
    onClose();
  };

  return (
    <div className="search-crew-overlay">
      <div className="search-crew-modal">
        <div className="search-header">
          <input
            type="text"
            placeholder="Agregar tripulante..."
            value={searchQuery}
            onChange={handleSearchInput}
            autoFocus
          />
          <button type="button" onClick={onClose} className="close-search">
            ×
          </button>
        </div>

        <div className="search-results">
          {/* Show registered users first */}
          {searchResults.map((member) => (
            <div
              key={member._id}
              className="search-result-item"
              onClick={() => handleSelectMember(member)}
            >
              <div className="member-info">
                <span className="username">@{member.userName}</span>
                <span className="name">
                  {member.first_name} {member.last_name}
                </span>
              </div>
            </div>
          ))}

          {/* Show "Add as guest" option when query exists */}
          {guestNedded === true && searchQuery && (
            <div className="guest-option">
              <div className="search-result-item" onClick={handleAddAsGuest}>
                <div className="member-info">
                  <span className="username">Agregar por nombre</span>
                  <span className="name">"{searchQuery}"</span>
                </div>
              </div>
            </div>
          )}

          {/* Show no results message */}
          {searchQuery && searchResults.length === 0 && !searchQuery.trim() && (
            <div className="no-results">No results found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchCrewModal;
