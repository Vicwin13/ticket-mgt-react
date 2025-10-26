import './TicketCard.css';

import React from 'react';

const TicketCard = ({ title = 'Total Tickets', content, image }) => {
  const getImageSrc = () => {
    if (!image) return '';

    // Map image names to their paths
    const images = {
      'ticket.svg': '/ticket.svg',
      'open.svg': '/open.svg',
      'tick.svg': '/tick.svg',
    };

    return images[image] || '';
  };

  return (
    <div className="card">
        <div className="card-head">
          <h2>{title}</h2>
          {image && (
            <div className="icon">
              <img src={getImageSrc()} alt="icon" />
            </div>
          )}
        </div>
        <div className="card-body">
          <p>{content}</p>
        </div>
    </div>
  );
};

export default TicketCard;