import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '@/api';


interface UpdateModalProps{
    teacher: {
        teacherId: number;
        name: string;
        birth: string;
        phone: string;
        storeName: string;
        salary: number;
        cdStatus: string;
        statusName: string;
    }
    show: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ teacher, show, onClose, onUpdate }) => { //기존에 저장된 강사 정보 전달받음
    const [phone, setPhone] = useState("");
    const [isInvalid, setIsInvalid] = useState<boolean | null>(null);
    const [salary, setSalary] = useState("");
    const [form, setForm] = useState({ ...teacher });
    const teacherId = teacher.teacherId;

        // 전화번호 포맷 지정 
    const formatPhoneNumber = (value: string) => {
        /*
        const numbersOnly = value.replace(/\D/g, ''); // 숫자만 
        if (numbersOnly.length < 4) return numbersOnly;
        if (numbersOnly.length < 8) return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`; // 자동 하이픈 삽입
        */
        let formatNum = '';
        const onlyNum = value.replace(/\D/g, ''); // 숫자만 
    
        if(onlyNum.length >= 11){    
            //formatNum = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            if (onlyNum.length < 4) return onlyNum;
            if (onlyNum.length < 8) return `${onlyNum.slice(0, 3)}-${onlyNum.slice(3)}`;
            formatNum = `${onlyNum.slice(0, 3)}-${onlyNum.slice(3, 7)}-${onlyNum.slice(7, 11)}`; // 자동 하이픈 삽입
        }else if(onlyNum.length==8){
            //formatNum = value.replace(/(\d{4})(\d{4})/, '$1-$2');
            if (onlyNum.length < 5) return onlyNum;
            formatNum = `${onlyNum.slice(0, 4)}-${onlyNum.slice(4, 8)}`;
        }else{    
            if(onlyNum.indexOf('02')==0){    
                //formatNum = value.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                if (onlyNum.length < 3) return onlyNum;
                if (onlyNum.length < 7) return `${onlyNum.slice(0, 2)}-${onlyNum.slice(2)}`;
                formatNum = `${onlyNum.slice(0, 2)}-${onlyNum.slice(2, 6)}-${onlyNum.slice(6, 10)}`;
            }else{        
                //formatNum = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                if (onlyNum.length < 4) return onlyNum;
                if (onlyNum.length < 7) return `${onlyNum.slice(0, 3)}-${onlyNum.slice(3)}`;
                formatNum = `${onlyNum.slice(0, 3)}-${onlyNum.slice(3, 6)}-${onlyNum.slice(6, 10)}`;
            }
    
        }

        return formatNum;   
        
    };

  // 전화번호 변경 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    if (formattedPhone.length > 13) return; // 최대 길이 13자리 제한 
    setPhone(formattedPhone);
    setForm(prev => ({ ...prev, phone: formattedPhone })); // form.phone 에 전화번호 업데이트
    setIsInvalid(null); // 수정 시 중복 상태 초기화하여 isInvalid 상태값 실시간 반영
  };

  // 디바운스 방식으로 중복 체크
  useEffect(() => {
    const timeout = setTimeout(() => {

      if (phone === teacher.phone) return; // 자기 번호일 경우 중복 체크 생략
      if (phone.length > 8 && phone !== teacher.phone)  {
        api.get(`/teachers/phone-check?phone=${phone}`)
          .then((res) => setIsInvalid(res.data)) // true or false
          .catch((err) => console.error("중복 체크 오류:", err));
      }
    }, 500); // 0.5초 후 체크

    return () => clearTimeout(timeout); // 타이머 초기화
  }, [phone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };
/*
    // 숫자 형식 포맷
    const formatNumber = (num: string): string => {
        const onlyNum = num.replace(/[^0-9]/g, ''); // 숫자만 추출
        return Number(onlyNum).toLocaleString();
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const formatted = formatNumber(input);
        setForm(prev => ({
            ...prev,
            salary: formatted
        }));
    };
*/
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(isInvalid === true || form.phone.length < 9) {
            alert("전화번호를 확인해 주십시오");
            return;
        }
        const formData = new FormData(e.currentTarget);
        const formObject = Object.fromEntries(formData.entries());
        //formObject.salary = salary.replace(/[^0-9]/g, '');

        api.patch(`/teachers/${teacherId}`, formObject)
            .then((res) => {
                console.log(res.data);
                onUpdate();
                alert("강사 정보를 수정했습니다");
                onClose();
            })
            .catch(err => {
               console.log(err);
               alert("강사 정보 수정 실패했습니다");
            }); 
    };

    useEffect(()=>{
        setForm({ ...teacher });        
    }, [teacher]);
    
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>강사 정보 수정</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>지점명</Form.Label>
                        <Form.Control name="storeName" value={form.storeName} readOnly/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>이름</Form.Label>
                        <Form.Control name="name" value={form.name} onChange={handleChange} required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>생년월일</Form.Label>
                        <Form.Control name="birth" value={form.birth} type="date" onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control name="phone" value={form.phone} onChange={handlePhoneChange} maxLength={13} required />
                        {isInvalid === true && <span style={{ color: "red" }}>이미 사용 중인 번호입니다.</span>}
                        {isInvalid === false && <span style={{ color: "green" }}>사용 가능한 번호입니다.</span>}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>재직 여부</Form.Label>
                        <Form.Select name="cdStatus" value={form.cdStatus} onChange={handleChange} required>
                            <option value="WORK">재직</option>
                            <option value="T_QUIT">퇴직</option>  
                        </Form.Select>                        
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>급여</Form.Label>
                        <Form.Control name="salary" value={form.salary} onChange={handleChange} required />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" style={{backgroundColor: 'rgb(71, 95, 168)', borderColor: 'rgb(71, 95, 168)' }}>수정</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default UpdateModal;