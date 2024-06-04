import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config/BeApiEndpoint';
import { useUser } from '../UserContext';
import '../css/PageGlobal.css';
import '../css/Cart.css';

import { useNavigate } from 'react-router-dom';
const Cart = () => {
    const { user } = useUser();
    const [cartList, setCartList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();
    
    const getCart = async () => {
        try {
            const response = await fetch(`${apiUrl}/Cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
              
                if (!data) {
                    setErrorMessage(`Không tìm thấy thông tin giỏ hàng`);
                } else {
                    setCartList(data);
                }
            } else {
                setErrorMessage(data.message || `Lỗi khi lấy thông tin giỏ hàng`);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setErrorMessage('Có lỗi xảy ra khi lấy thông tin giỏ hàng.');
        }
    }

    useEffect(() => {
        getCart();
    })

    const handleCancelOrder = async (orderListId) => {
        try {
            await fetch(`${apiUrl}/Cart/updateStatus/${orderListId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(() => {});
            
            alert('Hủy đơn hàng thành công');
        } catch (error) {
            console.error('Error cancel order:', error);
            setErrorMessage('Có lỗi xảy ra khi hủy đơn hàng.');
        }
        getCart();
    }
    if (user?.role !== 0) {
        return (
            <div>Bạn không có quyền truy cập</div>
        );
    }
    return (
    <div className='cart'>
      <h1>Cart</h1>
      <div>
        Danh sách đơn hàng đã đặt
        <table>
            <thead>
                <tr>
                <th>Mã đơn hàng</th>
                <th>Mã Site</th>
                <th>Mã mặt hàng</th>
                <th>Số lượng</th>
                <th>Ngày giao hàng dự kiến</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {cartList.map((item) => (
                    <tr key={item.orderListId}>
                    <td>{item.orderListId}</td>
                    <td>{item.siteCode}</td>
                    <td>{item.merchandiseCode}</td>
                    <td>{item.quantity}</td>
                    <td>{new Date(item.deliveryDate).toISOString().split("T")[0]}</td>
                    <td>{
                    item.status === 0 ? "Đã đặt hàng" :
                    item.status === 1 ? "Đã giao hàng" :
                    item.status === 2 ? "Đã kiểm hàng" : 
                    item.status === 3 ? "Đã hủy" : ""
                    }</td>
                    <td>
                    {
                        item.status === 0 && <button
                        onClick={()=> handleCancelOrder(item.orderListId)}
                        >Hủy hàng</button>
                    }
                    {
                        item.status === 1 && <button onClick={()=>{
                            navigate('/inventory', { state: { orderListId: item.orderListId } });
                        }}>Kiểm hàng</button>
                    }
                    {
            
                    }
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>
      {
        errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>
      }
    </div>
    
  );
}
export default Cart;