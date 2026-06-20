import React from "react";
import Header from "./Header";

export default function PlaceholderView({ 
  title, 
  subtitle, 
  headerIcon, 
  placeholderTitle, 
  placeholderDesc, 
  placeholderIcon 
}) {
  return (
    <div className="view-section">
      <Header title={title} subtitle={subtitle} icon={headerIcon} />
      
      <div className="placeholder-view">
        <div className="placeholder-icon">
          {placeholderIcon || (
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
        </div>
        <h2>{placeholderTitle}</h2>
        <p>{placeholderDesc}</p>
      </div>
    </div>
  );
}
