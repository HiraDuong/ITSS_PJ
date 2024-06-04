import React, { useState, useEffect } from 'react';
import "../css/PageGlobal.css";
import "../css/Inventory.css";
import { useUser } from '../UserContext';
import { apiUrl } from '../config/BeApiEndpoint';
import InventorySite from '../components/InventorySite/InventorySite';

const Inventory = () => {
    const { user } = useUser();
    const [cartList, setCartList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // get list order with status = 1:
    const getCartStatus1 = async () => {
        try {
            const response = await fetch(`${apiUrl}/Cart/status/1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setErrorMessage('Failed to fetch orders.');
                throw new Error('Failed to fetch orders.');
            }

            const data = await response.json();
         
                setCartList(data.data || []);
     
        } catch (error) {
            console.error('Error fetching orders:', error);
            setErrorMessage('Error fetching orders.');
        }
    };

    const checkInventory = async (item) => {
        try {
            // Thay đổi trạng thái đơn hàng thành 2
            const response = await fetch(`${apiUrl}/Cart/checkInventory/${item.orderListId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to update order status.');
            }
    
            const data = await response.json();
            if (data.status === "error") {
                throw new Error(data.message);
            } else {
                alert(`Kiểm hàng đơn hàng ${item.orderListId} thành công!`);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setErrorMessage('Error updating order status.');
        }
    
        try {
            // Cập nhật kho hàng trang web
            const response = await fetch(`${apiUrl}/Inventory/siteCode/${item.siteCode}/merchandiseCode/${item.merchandiseCode}/orderQuantity/${item.quantity}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
              
            });
    
            if (!response.ok) {
                throw new Error('Failed to update order status.');
            }
    
            const data = await response.json();
            if (data.status === "error") {
                throw new Error(data.message);
            } else {
                alert(`Cập nhật kho hàng thành công!`);
                getCartStatus1();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setErrorMessage('Error updating order status.');
        }
    };
    
    useEffect(() => {
        getCartStatus1();
    }, []);

    if (user?.role === 1) {
        return <InventorySite />;
    }
    else if (user?.role !== 0){
        return (
            <div className="page-container">
                <h1>Bạn không có quyền truy cập</h1>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>Kiểm hàng</h1>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã sản phẩm</th>
                        <th>Mã Site</th>
                        <th>Số lượng</th>
                        <th>Đơn vị</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {cartList.length > 0 ? cartList.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.merchandiseCode}</td>
                            <td>{item.siteCode}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                            <td>
                                <button onClick={() => { checkInventory(item) }} className="btn btn-primary">Kiểm hàng</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Không có đơn hàng nào cần kiểm hàng.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
};

export default Inventory;
