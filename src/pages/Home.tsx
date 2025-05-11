import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [userId, setUserId] =useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(userId)
        if(userId==='9999'){
            navigate('/ceo');
        }else{
            navigate('/admin');
        }
        
        
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // 실제 로그인 로직은 없음 (가정)
        
    };

    return (
        <>
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="card shadow p-4" style={{ width: '100%', maxWidth: '600px' }}>
                    <h2 className="text-center mb-4">학원 관리 ERP 시스템 로그인</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="userId" className="form-label">아이디</label>
                            <input
                                type="text"
                                className="form-control"
                                id="userId"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="아이디를 입력하세요"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userPassword" className="form-label">비밀번호</label>
                            <input
                                type="password"
                                className="form-control"
                                id="userPassword"
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">로그인</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Home;