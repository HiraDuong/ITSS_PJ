import React, { useEffect, useState, useCallback } from 'react';
import "../css/PageGlobal.css";
import "../css/CheckOrder.css";
import { useUser } from '../UserContext';
import { apiUrl } from '../config/BeApiEndpoint';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const CheckOrder = () => {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/OrderList/siteCode/status/${user.siteCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders.');
            }

            const data = await response.json();
            setOrders(data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [user.siteCode]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/itss');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(new Date(), str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            client.subscribe('/topic/orders', () => {
                fetchOrders();
            });
        };

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [fetchOrders]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleOrderStatusUpdate = async (orderListId) => {
        try {
            const response = await fetch(`${apiUrl}/OrderList/updateStatus/orderListId/${orderListId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update order status.');
            }

            if (stompClient) {
                stompClient.publish({
                    destination: '/topic/orders',
                    body: 'New order has been updated',
                });
            }

            alert('Đã cập nhật trạng thái đơn hàng!');
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (user?.role !== 1) {
        return (
            <div>
                <h1>404 Not Found</h1>
            </div>
        );
    }

    return (
        <div className='check-order'>
            <h1>Check Order</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order List ID</th>
                        <th>Site Code</th>
                        <th>Merchandise Code</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Delivery Means</th>
                        <th>Delivery Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan='9'>No orders</td>
                        </tr>
                    ) : (
                        orders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.orderListId}</td>
                                <td>{order.siteCode}</td>
                                <td>{order.merchandiseCode}</td>
                                <td>{order.quantity}</td>
                                <td>{order.unit}</td>
                                <td>{order.deliveryMeans}</td>
                                <td>
                                    {typeof order.deliveryDate === 'string'
                                        ? new Date(order.deliveryDate).toISOString().split('T')[0]
                                        : order.deliveryDate.toISOString().split('T')[0]}
                                </td>
                                <td>{order.status}</td>
                                <td>
                                    <button onClick={() => handleOrderStatusUpdate(order.orderListId)}>Đã gửi</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CheckOrder;
