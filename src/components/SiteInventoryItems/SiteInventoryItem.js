import React, { useState, useMemo } from 'react';
import './SiteInventoryItem.css';
import { apiUrl } from '../../config/BeApiEndpoint';

import { useLocation } from 'react-router-dom';

const SiteInventoryItem = ({ data }) => {
  const [expandedSite, setExpandedSite] = useState(null);
  const [orderForm, setOrderForm] = useState({ show: false, item: null });
  const location = useLocation();

  const merchandiseList = useMemo(() => location.state?.merchandiseList || [], [location.state?.merchandiseList]);



  const groupedData = data.reduce((acc, currentItem) => {
    const { site_code } = currentItem.site;
    if (!acc[site_code]) {
      acc[site_code] = [];
    }
    acc[site_code].push(currentItem);
    return acc;
  }, {});

  const toggleExpandedSite = (siteCode) => {
    if (expandedSite === siteCode) {
      setExpandedSite(null); // Đóng bảng merchandise nếu đã mở
    } else {
      setExpandedSite(siteCode); // Mở bảng merchandise nếu chưa mở
    }
  };

  const handleOrderSubmit = (item) => {
    setOrderForm({ show: true, item });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { quantityOrdered, deliveryMeans, deliveryDate } = event.target.elements;

    try {
      const response = await fetch(`${apiUrl}/OrderList/siteCode/${orderForm.item.site.site_code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "siteCode": orderForm.item.site.site_code,
          "merchandiseCode": orderForm.item.inventory.merchandiseCode,
          "quantity": quantityOrdered.value,
          "unit": orderForm.item.inventory.unit,
          "deliveryMeans": deliveryMeans.value,
          "deliveryDate": deliveryDate.value
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order.');
      }


      // Đóng form
      alert('Đặt hàng thành công!');
      setOrderForm({ show: false, item: null });
    } catch (error) {
      console.error('Error submitting order:', error);
      // Xử lý lỗi nếu cần
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
    }
  };

  const handleCloseForm = () => {
    setOrderForm({ show: false, item: null });
  };

  const getDeliveryDate = (merchandiseCode) => {
    const merchandise = merchandiseList.find(item => item.merchandise_code === merchandiseCode);
    return merchandise ? merchandise.deliveryDate : new Date().toISOString().split('T')[0];
  };
  const getQuantity = (merchandiseCode) => {
    const merchandise = merchandiseList.find(item => item.merchandise_code === merchandiseCode);
    return merchandise ? merchandise.quantity : 1;
  };

  return (
    <div className='site-inventory-item'>
      {Object.keys(groupedData).map(siteCode => (
        <div key={siteCode}>
          <table className='main-table'>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Code</th>
                <th style={{ width: "100px" }}>Site Name</th>
                <th style={{ width: "60px" }}>By Ship</th>
                <th style={{ width: "60px" }}>By Air</th>
                <th>Other Info</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => toggleExpandedSite(siteCode)} style={{ cursor: 'pointer' }}>
                <td>{groupedData[siteCode][0].site.site_code}</td>
                <td>{groupedData[siteCode][0].site.siteName}</td>
                <td>{groupedData[siteCode][0].site.byShip}</td>
                <td>{groupedData[siteCode][0].site.byAir}</td>
                <td>{groupedData[siteCode][0].site.otherInfo}</td>
              </tr>
            </tbody>
          </table>
          {expandedSite === siteCode && (
            <table className='sub-table'>
              <thead>
                <tr>
                  <th>Inventory ID</th>
                  <th>Merchandise Code</th>
                  <th>In Stock Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {groupedData[siteCode].map(item => (
                  <tr key={item.inventory.inventory_id}>
                    <td>{item.inventory.inventory_id}</td>
                    <td>{item.inventory.merchandiseCode}</td>
                    <td>{item.inventory.inStockQuantity}</td>
                    <td>{item.inventory.unit}</td>
                    <td>
                      <button onClick={() => handleOrderSubmit(item)} className='order-submit-btn'>Đặt hàng</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {orderForm.show && (
        <div className='order-form-container'>
          <form onSubmit={handleFormSubmit}>
            <button type='button' className='close-btn' onClick={handleCloseForm}>X</button>
            <h2>Đặt hàng</h2>
            <div className='order-form'>
              <label>Site Code: </label>
              <label style={{ color: "#0b81f8", fontWeight: "bolder" }}>{orderForm.item.site.site_code}</label>
              <label>Merchandise Code: </label>
              <label style={{ color: "#0b81f8", fontWeight: "bolder" }}>{orderForm.item.inventory.merchandiseCode}</label>
            </div>
            <div className='order-form'>
              <label>Quantity ordered: </label>
              <input type='number' name='quantityOrdered' 
              defaultValue={getQuantity(orderForm.item.inventory.merchandiseCode)}
              max={orderForm.item.inventory.inStockQuantity}
              required />
              <label>Delivery means: </label>
              <select name='deliveryMeans' required>
                <option value='By Ship'>By Ship</option>
                <option value='By Air'>By Air</option>
              </select>
              </div>
              <div>
              <label>Delivery Date: </label>
              <input type='date' name='deliveryDate' 
              defaultValue={getDeliveryDate(orderForm.item.inventory.merchandiseCode)}
              required />
              <button type='submit'>Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SiteInventoryItem;
