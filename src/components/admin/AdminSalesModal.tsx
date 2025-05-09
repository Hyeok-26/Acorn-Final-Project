import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, CloseButton, Dropdown, FloatingLabel, Form, ListGroup, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

type Student = {id:number, name:string}
function AdminSalesModal({show, title, btnTag, onBtn, onClose, bcode, acode, initialData}) {
    const [selectedBcode, setSelectedBcode] = useState('');
    const [selectedAcode, setSelectedAcode] = useState('');
    const [adminSaleId, setAdminSaleId] = useState<number|null>(null);
    const [price, setPrice] = useState(0);
    const [saleName, setSaleName] = useState<string>('');
    //SaleName의 길이가 20자 이상일 경우 true로 설정
    const [isTooLong, setIsTooLong] = useState(false);
    const filteredBcode = bcode.filter(item => item.class === selectedAcode);
    useEffect(() => {
        console.log(show, title,btnTag,onBtn,onClose)
        resetState();
    }, [initialData]);
    const resetState = () => {
        if (initialData) {
            setSelectedAcode(initialData.cdAcode);
            setSelectedBcode(initialData.cdBcode);
            setSaleName(initialData.saleName);
            setPrice(initialData.price);
                    // 👇 수정 버튼일 때만 adminSaleId 설정
            if (btnTag === "수정") {
                setAdminSaleId(initialData.adminSaleId);
            } else {
                setAdminSaleId(null);
            }
        } else {
            setSelectedAcode('');
            setSelectedBcode('');
            setSaleName('');
            setPrice(0);
            setAdminSaleId(null);
        }
    };
    const handleClose=()=>{
        resetState();
        onClose();
    }
    const isValidSaleName = (text: string): boolean => {
        const regex = /^[가-힣]{0,5}$/;  // 한글만 5글자
        return regex.test(text);
    };
    return (
        <>
            <Modal show={show} size="lg" centered>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                    <CloseButton onClick={handleClose}></CloseButton>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Group className="mb-3" controlId="acode">
                            <Form.Label>대분류</Form.Label>
                            <Form.Select value={selectedAcode} onChange={((e)=>{
                                    setSelectedAcode(e.target.value)
                            })}>
                                <option value="">구분</option>
                                {acode.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="bcode">
                            <Form.Label>소분류</Form.Label>
                            <Form.Select value={selectedBcode} onChange={(e)=>{setSelectedBcode(e.target.value); }}>
                                <option value="">구분</option>
                                {filteredBcode.map((item, index) => (
                                    <option key={index} value={item.detail}>{item.detail}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="saleName">
                            <Form.Label>항목 내용</Form.Label>
                            <Form.Control value={saleName} type="text"  placeholder="수입/지출 항목 내용을 입력하세요" onChange={(e) => {setSaleName(e.target.value); setIsTooLong(!isValidSaleName(e.target.value))}} />
                            <Form.Control.Feedback type="invalid">
                                한글 5자만 입력 가능합니다.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>매출 입력</Form.Label>
                            <Form.Control value={price} type="number"  placeholder="숫자 입력" onChange={e => setPrice(Number(e.target.value))} />
                        </Form.Group>
                    </Form.Group>      
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={!isValidSaleName(saleName)} onClick={(e)=>{
                        e.preventDefault()    
                        console.log("Btn Clicked")
                        onBtn({adminSaleId, selectedBcode,selectedAcode,saleName, price})
                    }}>{btnTag}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default AdminSalesModal;