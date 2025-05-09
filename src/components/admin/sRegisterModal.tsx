import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '../../api';

interface RegisterModalProps {
    show: boolean;
    onClose: () => void;
    onRegister: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose, onRegister }) => {
    const [phone, setPhone] = useState("");
    const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
    const userId = '2'; // userId 데이터 불러오기
    const storeName = '스토어1'; // storeName 데이터 불러오기

  // 전화번호 포맷 지정
  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, ''); // 숫자만 
    if (numbersOnly.length < 4) return numbersOnly;
    if (numbersOnly.length < 8) return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`; // 자동 하이픈 삽입
  };

  // 전화번호 변경 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    if (formattedPhone.length > 13) return; // 최대 길이 13자리 제한 
    setPhone(formattedPhone);
    setIsInvalid(null); // 수정 시 중복 상태 초기화하여 isInvalid 상태값 실시간 반영
  };

  // 디바운스 방식으로 중복 체크
  useEffect(() => {
    const timeout = setTimeout(() => {
      
      if (phone.length >= 12) {
        api.get(`/students/phone-check?phone=${phone}`)
          .then((res) => setIsInvalid(res.data)) // true or false
          .catch((err) => console.error("중복 체크 오류:", err));
      }
    }, 1000); // 1초 후 체크

    return () => clearTimeout(timeout); // 초기화
  }, [phone]);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formObject = Object.fromEntries(formData.entries());
        formObject.userId = userId;

        if(isInvalid === true || phone.length < 12) {
            alert("전화번호를 확인해 주십시오");
            return;
        }
        
        api.post('/students', formObject)
            .then(() => {
                onRegister();
                alert("학생 정보를 등록하였습니다");
                onClose();
            })
            .catch(err => {
                console.log(err);
                alert("등록 중 오류가 발생했습니다.");
            });
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>학생 정보 등록</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>지점명</Form.Label>
                        <Form.Control name="storeName" value={storeName} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>이름</Form.Label>
                        <Form.Control name="name" placeholder="이름을 입력하세요" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control name="phone" value={phone} onChange={handlePhoneChange} placeholder="전화번호를 입력하세요(예: 010-1234-5678)" required /> {/* 포커스를 잃었을 때 유효성 체크 */}
                        {isInvalid === true && <span style={{ color: "red" }}>이미 사용 중인 번호입니다.</span>}
                        {isInvalid === false && <span style={{ color: "green" }}>사용 가능한 번호입니다.</span>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>상태</Form.Label>
                        <Form.Select name="cdStatus" required>
                            <option value="">상태를 선택하세요</option>
                            <option value="STUDY">재원</option>
                            <option value="S_QUIT">퇴원</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="primary">등록</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default RegisterModal;
