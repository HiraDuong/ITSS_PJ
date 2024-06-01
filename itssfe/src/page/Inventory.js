import React, { useState, useEffect } from 'react';
import "../css/PageGlobal.css";
import "../css/Inventory.css";
import { useUser } from '../UserContext';
import { apiUrl } from '../config/BeApiEndpoint';

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

    // check inventory 
    const checkInventory = async (orderListId) => {
        try {
            const response = await fetch(`${apiUrl}/Cart/checkInventory/${orderListId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setErrorMessage('Failed to update order status.');
                throw new Error('Failed to update order status.');
            }

            const data = await response.json();
            if (data.status === "error") {
                setErrorMessage(data.message);
            } else {
                alert(`Kiểm hàng đơn hàng ${orderListId} thành công!`);
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

    if (user?.role !== 0) {
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
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn vị</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {cartList.length > 0 ? cartList.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.productName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                            <td>
                                <button onClick={() => { checkInventory(item.orderListId) }} className="btn btn-primary">Kiểm hàng</button>
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
