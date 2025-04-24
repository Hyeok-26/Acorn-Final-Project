import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleCeoLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // 실제 로그인 로직은 없음 (가정)
        navigate('/ceo');
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // 실제 로그인 로직은 없음 (가정)
        navigate('/admin');
    };

    return (
        <>
            <h1 className="text-center">홈페이지(로그인 페이지)</h1>
            <div className="container">
                <h3>본사 로그인 폼</h3>
                <form onSubmit={handleCeoLogin}>
                    <div className="mb-3">
                        <label htmlFor="ceo-id" className="form-label">아이디</label>
                        <input type="text" className="form-control" id="ceo-id" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ceo-password" className="form-label">비밀번호</label>
                        <input type="password" className="form-control" id="ceo-password" />
                    </div>
                    <button type="submit" className="btn btn-primary">로그인</button>
                </form>
            </div>
            <div className="container">
                <h3>지점 로그인 폼</h3>
                <form onSubmit={handleAdminLogin}>
                    <div className="mb-3">
                        <label htmlFor="admin-id" className="form-label">아이디</label>
                        <input type="text" className="form-control" id="admin-id" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="admin-password" className="form-label">비밀번호</label>
                        <input type="password" className="form-control" id="admin-password" />
                    </div>
                    <button type="submit" className="btn btn-primary">로그인</button>
                </form>
            </div>
        </>
    );
}

export default Home;