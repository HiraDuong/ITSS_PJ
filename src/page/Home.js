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
    const [inputValues, setInputValues] = useState({});  

    

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

    const handleInputChange = (merchandiseCode, value) => {
        setInputValues((prevValues) => ({ ...prevValues, [merchandiseCode]: value }));
    };

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
                                    const inputValue = inputValues[merchandise.merchandise_code]||today;
                                    const merchandiseOrder = {
                                        ...merchandise,
                                        deliveryDate: inputValue,
                                    };
                                    addMerchandiseToList(merchandiseOrder);
                                }}>Thêm</button>
                                <button className='delete-btn' onClick={() => deleteMerchandiseToList(merchandise)}>Xóa</button>
                                <input
                                    type='date'
                                    min={today} // Đặt ngày nhỏ nhất là ngày hôm nay
                                    value={inputValues[merchandise.merchandise_code]||today}
                                    onChange={(e) => handleInputChange(merchandise.merchandise_code, e.target.value)}
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
