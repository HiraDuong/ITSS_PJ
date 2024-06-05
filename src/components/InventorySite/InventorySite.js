import React, { useEffect } from "react";
import "../../css/PageGlobal.css";
import "./InventorySite.css";
import { useUser } from "../../UserContext";
import { apiUrl } from "../../config/BeApiEndpoint";
import { useState } from "react";
const InventorySite = () => {
    
    const {user} = useUser();
    const [inventory, setInventory] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    // get inventory of 
    const getInventory = async () => {
        try {
            const response = await fetch(`${apiUrl}/Inventory/siteCode/${user.siteCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                setErrorMessage('Failed to fetch inventory.');
                throw new Error('Failed to fetch inventory.');
            }

            const data = await response.json();
            setInventory(data.data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setErrorMessage('Error fetching inventory.');
        }
    };
    useEffect(() => {
        getInventory();
    })
    return (
        <div className="inventory-site">
            <h1>Site : {user.siteCode}  Inventory</h1>
            <table>
                <thead>
                    <tr>
                        <th style={{width:"40px"}}>No</th>
                        <th style={{width:"40px"}}>Merchandise Code</th>
                        <th style={{width:"100px"}}>Merchandise Name</th>
                        <th style={{width:"60px"}}>Unit</th>
                        <th style={{width:"60px"}}>In Stock Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item, index) => (
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.a.merchandiseCode}</td>
                            <td>{item.b}</td>
                            <td>{item.a.unit}</td>
                            <td>{item.a.inStockQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};
export default InventorySite;