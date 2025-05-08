import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Pagination } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CeoNavbar from '@/components/CeoNavBar';

interface Store {
  userId: number;
  storeName: string;
  phone: string;
  userName: string;
  userPhone: string;
  loginId: string;
}

function Store() {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [modalType, setModalType] = useState<'edit' | 'add' | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [form, setForm] = useState<any>({});
  const [params] = useSearchParams();
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [searchState, setSearchState] = useState({ condition: '', keyword: '' });
  const navigate = useNavigate();

  const fetchStores = (pageNum: number) => {
    const condition = params.get('condition') || '';
    const keyword = params.get('keyword') || '';
    const query = `condition=${condition}&keyword=${keyword}`;
    api.get(`/stores?pageNum=${pageNum}${condition ? '&' + query : ''}`)
      .then(res => {
        setStoreList(res.data.list);
        setPageArray(range(res.data.startPageNum, res.data.endPageNum));
      });
  };

  useEffect(() => {
    const pageNum = parseInt(params.get('pageNum') || '1');
    fetchStores(pageNum);
  }, [params]);

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const move = (pageNum: number) => {
    const query = new URLSearchParams(searchState).toString();
    navigate(`/stores?pageNum=${pageNum}${searchState.condition ? '&' + query : ''}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openEdit = (store: Store) => {
    setSelectedStore(store);
    setForm(store);
    setModalType('edit');
  };

  const openAdd = () => {
    setForm({});
    setModalType('add');
  };

  const submitForm = () => {
    if (modalType === 'add') {
      api.post('/stores', form).then(() => {
        alert('등록 완료');
        setModalType(null);
        fetchStores(1);
      });
    } else if (modalType === 'edit' && selectedStore) {
      api.patch(`/stores/${selectedStore.userId}`, form).then(() => {
        alert('수정 완료');
        setModalType(null);
        fetchStores(1);
      });
    }
  };

  const deleteStore = () => {
    const pwd = prompt('본사 관리자 비밀번호를 입력하세요');
    if (pwd && selectedStore) {
      api.delete(`/stores/${selectedStore.userId}?adminPwd=${pwd}`).then(() => {
        alert('삭제 완료');
        setModalType(null);
        fetchStores(1);
      });
    }
  };

  return (
    <div className="container">
      <CeoNavbar />
      <h1>지점 관리</h1>
      <div>
        <button onClick={openAdd}>지점 등록</button>
        <select name="condition" onChange={(e) => setSearchState({ ...searchState, condition: e.target.value })}>
          <option value="">전체</option>
          <option value="storeName">지점명</option>
          <option value="userName">원장명</option>
        </select>
        <input name="keyword" onChange={(e) => setSearchState({ ...searchState, keyword: e.target.value })} />
        <button onClick={() => move(1)}>검색</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>지점명</th>
            <th>전화번호</th>
            <th>원장</th>
            <th>원장 번호</th>
          </tr>
        </thead>
        <tbody>
          {storeList.map((item) => (
            <tr key={item.userId} onClick={() => openEdit(item)} style={{ cursor: 'pointer' }}>
              <td>{item.storeName}</td>
              <td>{item.phone}</td>
              <td>{item.userName}</td>
              <td>{item.userPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination>
        <Pagination.Item onClick={() => move(pageArray[0] - 1)}>Prev</Pagination.Item>
        {pageArray.map((p) => (
          <Pagination.Item onClick={() => move(p)} key={p}>{p}</Pagination.Item>
        ))}
        <Pagination.Item onClick={() => move(pageArray[pageArray.length - 1] + 1)}>Next</Pagination.Item>
      </Pagination>

      {modalType && (
        <div className="modal">
          <h2>{modalType === 'add' ? '지점 등록' : '지점 수정'}</h2>
          <input name="storeName" placeholder="지점명" value={form.storeName || ''} onChange={handleChange} readOnly={modalType === 'edit'} />
          <input name="phone" placeholder="전화번호" value={form.phone || ''} onChange={handleChange} />
          <input name="userName" placeholder="원장명" value={form.userName || ''} onChange={handleChange} />
          <input name="userPhone" placeholder="원장 전화번호" value={form.userPhone || ''} onChange={handleChange} />
          <input name="loginId" placeholder="로그인 ID" value={form.loginId || ''} onChange={handleChange} readOnly={modalType === 'edit'} />
          <input name="password" placeholder="로그인 PWD" value={form.password || ''} onChange={handleChange} type="password" />
          <div>
            <button onClick={submitForm}>{modalType === 'add' ? '등록' : '수정'}</button>
            {modalType === 'edit' && <button onClick={deleteStore} style={{ color: 'red' }}>삭제</button>}
            <button onClick={() => setModalType(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
