import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../../UserContext';
import { apiUrl } from '../../config/BeApiEndpoint';
import './HomeSiteRole.css';

const HomeSiteRole = () => {
    const { user } = useUser();
    const siteCode = user?.siteCode;
    const [site, setSite] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [siteData, setSiteData] = useState({
        siteCode: '',
        siteName: '',
        byShip: '',
        byAir: '',
        otherInfo: ''
    });

    const formRef = useRef();

    const handleEditSite = () => {
        setShowEditForm(true);
        setSiteData({
            siteCode: site.site_code,
            siteName: site.siteName,
            byShip: site.byShip,
            byAir: site.byAir,
            otherInfo: site.otherInfo
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSiteData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!siteData.siteName || !siteData.byShip || !siteData.byAir) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/Site/${siteCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(siteData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            setSite(data.data);
            setShowEditForm(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin site: ", error);
        }
    };

    useEffect(() => {
        const fetchSite = async () => {
            try {
                const response = await fetch(`${apiUrl}/Site/${siteCode}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                setSite(data.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin site: ", error);
            }
        };

        if (siteCode) {
            fetchSite();
        }
    }, [siteCode]);

    return (
        <div className='home-site-role'>
            {showEditForm && <div className='overlay'></div>}
            <div >
                <h1>Chào mừng tới trang quản trị</h1>
                <div>
                    <h2>Thông tin site</h2>
                    <table className='site-table'>
                        <tbody>
                            <tr>
                                <th>Mã site</th>
                                <td>{site.site_code}</td>
                            </tr>
                            <tr>
                                <th>Tên site</th>
                                <td>{site.siteName}</td>
                            </tr>
                            <tr>
                                <th>Vận chuyển bằng thuyền</th>
                                <td>{site.byShip} ngày</td>
                            </tr>
                            <tr>
                                <th>Vận chuyển bằng máy bay</th>
                                <td>{site.byAir} ngày</td>
                            </tr>
                            <tr>
                                <th>Thông tin khác</th>
                                <td>{site.otherInfo}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button onClick={handleEditSite}>Chỉnh sửa</button>
                </div>
                {showEditForm && (
                    <div>
                        <h2>Chỉnh sửa thông tin site</h2>
                        <form className='edit-site-form' ref={formRef} onSubmit={handleSubmit}>
                            <label htmlFor='siteName'>Tên site:</label>
                            <input type='text' id='siteName' name='siteName' value={siteData.siteName} onChange={handleInputChange} />
                            <label htmlFor='byShip'>Vận chuyển bằng thuyền (ngày):</label>
                            <input type='number' id='byShip' name='byShip' value={siteData.byShip} onChange={handleInputChange} />
                            <label htmlFor='byAir'>Vận chuyển bằng máy bay (ngày):</label>
                            <input type='number' id='byAir' name='byAir' value={siteData.byAir} onChange={handleInputChange} />
                            <label htmlFor='otherInfo'>Thông tin khác:</label>
                            <textarea id='otherInfo' name='otherInfo' value={siteData.otherInfo} onChange={handleInputChange}></textarea>
                            <button type='submit'>Lưu</button>
                            <button style={{ background: "red" }} type='button' onClick={() => setShowEditForm(false)}>Hủy</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomeSiteRole;
