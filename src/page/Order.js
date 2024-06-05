import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { useLocation } from 'react-router-dom';
import { apiUrl } from '../config/BeApiEndpoint';
import SiteInventoryItem from '../components/SiteInventoryItems/SiteInventoryItem';
import { useMemo } from 'react';
const Order = () => {
    const { user } = useUser();
    const location = useLocation();
    const [inventoryAndSitesList, setInventoryAndSitesList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const merchandiseList = useMemo(() => location.state?.merchandiseList || [], [location.state?.merchandiseList]);


    console.log("Order merchandiseList", merchandiseList);

    const getInventoryAndSites = async (merchandiseCode, deliverDate,quantity) => {
        try {
            const response = await fetch(`${apiUrl}/Inventory/merchandiseCode/inStockQuantity/deliverDate/quantityOrder/${merchandiseCode}/${deliverDate}/${quantity}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                const resultData = data.data;
                if (!resultData) {
                    setErrorMessage(`Không tìm thấy thông tin hàng hóa và kho hàng với mã hàng hóa: ${merchandiseCode}`);
                } else {
                    setInventoryAndSitesList(prevList => [...prevList, ...resultData]);
                }
            } else {
                setErrorMessage(data.message || `Lỗi khi lấy thông tin hàng hóa và kho hàng với mã hàng hóa: ${merchandiseCode}`);
            }
        } catch (error) {
            console.error('Error fetching inventory and sites:', error);
            setErrorMessage('Có lỗi xảy ra khi lấy thông tin hàng hóa và kho hàng.');
        }
    };

    useEffect(() => {
        // Gọi API khi component được render
        merchandiseList.forEach(merchandise => {
            console.log("merchandise", merchandise.deliveryDate);
            getInventoryAndSites(merchandise.merchandise_code, merchandise.deliveryDate,merchandise.quantity);
        });
    }, [merchandiseList]);

    return (
        <div>
            {user?.role === 0 ? (
                <div>
                    <h1>Order</h1>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <SiteInventoryItem data={inventoryAndSitesList} />
                </div>
            ) : null}
        </div>
    );
};

export default Order;
