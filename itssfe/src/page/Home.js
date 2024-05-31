import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import "../css/PageGlobal.css";
import "../css/Home.css";
import { Link, useNavigate } from 'react-router-dom';
import SearchMerchandise from '../components/SearchMerchandise/SearchMerchandise';
import MerchandiseItem from '../components/MerchandiseItem/MerchandiseItem';
import * as XLSX from 'xlsx';
import HomeSiteRole from '../components/HomeSiteRole/HomeSiteRole';

const Home = () => {
    const { user } = useUser();
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const [merchandiseList, setMerchandiseList] = useState([]);
    const [deliveryDates, setDeliveryDate] = useState({});  
    const [quantities, setQuantities] = useState({});
    

    useEffect(() => {
        console.log("merchandiseList", merchandiseList);
    }, [merchandiseList]);

    const addMerchandiseToList = (merchandise) => {
        if (merchandise.deliveryDate) {
            if (merchandiseList.some(item => item.merchandise_code === merchandise.merchandise_code)) {
                alert('Mặt hàng này đã được thêm vào danh sách.');
            } else {
                setMerchandiseList((prevList) => [...prevList, merchandise]);
                alert('Đã thêm mặt hàng vào danh sách.');
            }
        } else {
            alert('Vui lòng nhập ngày giao hàng!');
        }
    };

    const deleteMerchandiseToList = (merchandise) => {
        setMerchandiseList((prevList) => prevList.filter(item => item.merchandise_code !== merchandise.merchandise_code));
    };

    const handleDeliveryDateChange = (merchandiseCode, value) => {
        setDeliveryDate((prevValues) => ({ ...prevValues, [merchandiseCode]: value }));
    };
    const handleQuantityChange = (merchandiseCode, value) => {
        // Chuyển đổi giá trị từ chuỗi sang số nguyên
        const quantity = parseInt(value);
    
        // Kiểm tra xem giá trị nhập vào có phải là một số nguyên hợp lệ hay không
        if (!isNaN(quantity) && Number.isInteger(quantity) && quantity >= 1) {
            // Nếu là số nguyên hợp lệ, cập nhật state của quantities
            setQuantities((prevValues) => ({ ...prevValues, [merchandiseCode]: quantity }));
        } else {
            // Nếu không phải là số nguyên hợp lệ, xử lý theo nhu cầu của bạn, ví dụ:
            // Có thể hiển thị thông báo lỗi
            console.error('Giá trị nhập vào không hợp lệ');
        }
    }
    const handleSubmit = () => {
        const ws = XLSX.utils.json_to_sheet(merchandiseList);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Merchandise List');
        XLSX.writeFile(wb, 'merchandise_list.xlsx');
        alert('Đã tạo danh sách và lưu vào file Excel');
        navigate('/order', { state: { merchandiseList: merchandiseList } });
        
    };
    
    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay

  

    if (user?.role === 1) {
        return <HomeSiteRole/>
    }

    if (user?.role === 0) {
        return (
            <div className='home-page'>
                <SearchMerchandise setSearchResults={setSearchResults} />
                <div>
                    <p>Search Results:</p>
                    {searchResults.length > 0 ? (
                        searchResults.map((merchandise) => (
                            <div className='merchandise-item-list' key={merchandise.merchandise_code}>
                                <MerchandiseItem merchandise={merchandise} />
                                <button className='add-btn' onClick={() => {
                                    const deliveryDate = deliveryDates[merchandise.merchandise_code]||today;
                                    const merchandiseOrder = {
                                        ...merchandise,
                                        deliveryDate: deliveryDate,
                                        quantity: quantities[merchandise.merchandise_code]||1
                                    };
                                    addMerchandiseToList(merchandiseOrder);
                                }}>Thêm</button>
                                <button className='delete-btn' onClick={() => deleteMerchandiseToList(merchandise)}>Xóa</button>
                                <input
                                    type='date'
                                    min={today} // Đặt ngày nhỏ nhất là ngày hôm nay
                                    value={deliveryDates[merchandise.merchandise_code]||today}
                                    onChange={(e) => handleDeliveryDateChange(merchandise.merchandise_code, e.target.value)}
                                />
                                <input
                                    type='number'
                                    
                                    value={quantities[merchandise.merchandise_code]||1}
                                    onChange={(e) => handleQuantityChange(merchandise.merchandise_code, e.target.value)}
                                    />
                            </div>
                        ))
                    ) : (
                        <p>Không tìm thấy kết quả.</p>
                    )}
                    <button className='submit-btn' onClick={handleSubmit}>Hoàn tất</button>
                </div>
            </div>
        );
    }

    if (user === null) {
        return (
            <div>
                <h1>Bạn cần đăng nhập</h1>
                <Link to="/login">Đăng nhập</Link>
            </div>
        );
    }

    return null;
}

export default Home;
