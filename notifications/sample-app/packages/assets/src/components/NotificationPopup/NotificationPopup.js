import React, { useState } from 'react';
import './NotificationPopup.scss';
import moment from 'moment';

const NotificationPopup = ({ data, setting = {} }) => {
  const [visible, setVisible] = useState(true);

  // Default values for data
  const defaultData = {
    firstName: 'John Doe',
    city: 'New York',
    country: 'United States',
    productName: 'Puffer Jacket With Hidden Hood',
    timestamp: Date.now(),
    productImage: 'https://plus.unsplash.com/premium_photo-1682125177822-63c27a3830ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2hvZXN8ZW58MHx8MHx8fDA%3D'
  };
  console.log(setting.position);
  // Use default values if data is null or undefined
  const currentData = data || defaultData;
  const timeAgo = moment(currentData.timestamp).fromNow();

  if (!visible) return null;

  return (
    <div className={`wrapper fadeInUp animated ${setting.desktopPosition}`}>
      <div className="product">
        <div className="card-container">
          <button className="close-button" onClick={() => setVisible(false)}>
            &times;
          </button>
          <a href="#" className="product-link">
            <div
              className="product-image"
              style={{
                backgroundImage: `url(${currentData.productImage})`
              }}
            ></div>
            <div className="content">
              <div className="customer-title">
                {currentData.firstName} in {currentData.city}, {currentData.country}
              </div>
              <div className="subtitle">purchased {currentData.productName}</div>
              <div className="footer">
                {setting.hideTimeAgo ? '' : timeAgo}{' '}
                <span className="uni-blue">
                  <i className="fa fa-check" aria-hidden="true" /> by Avada
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
