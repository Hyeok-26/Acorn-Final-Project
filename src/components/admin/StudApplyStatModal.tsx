import React, { useState } from 'react';
import { Button, CloseButton, Form, Modal, Table } from 'react-bootstrap';

function StudApplyStatModal({ show, onClose, students, className, onOpenSecondModal, onRemoveStudent, studentCount, maxCount }) {
    const handleClose=()=>{}
 
    return (
        <Modal show={show} onHide={onClose} size="xl" centered>
            <Modal.Header>
                <Modal.Title>{`${className} 수강생 리스트`}</Modal.Title>
                <CloseButton onClick={onClose} />
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{  maxWidth: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                    <h5 style={{ margin: 0 }}>
                        <input
                            type="text"
                            value={`수업 신청현황 : ${studentCount}/${maxCount}`}
                            readOnly
                            style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: 'inherit',
                                textAlign: 'center',
                                width: 'auto',
                                maxWidth: '300px',  // input 크기 조정
                                marginRight: '10px', // input과 버튼 간격
                            }}
                        />
                    </h5>
                    <Button
                        onClick={onOpenSecondModal}
                        className="mt-3"
                        style={{
                            fontSize: '1rem',   // 버튼 크기 조정
                            padding: '0.375rem 0.75rem', // 버튼 패딩 조정
                        }}
                    >
                        수강생 추가
                    </Button>
                </div>

                <div style={{ maxHeight: 300, maxWidth: 600, overflowY: 'auto', width: '100%' }}>
                    <Table bordered size="sm" style={{textAlign:'center', verticalAlign:"middle"}}>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.phone}</td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            onClick={() => onRemoveStudent(student.id)}
                                            className="mt-3"
                                            size="sm"
                                            style={{
                                                fontSize: '1rem',   // 버튼 크기 조정
                                                padding: '0.375rem 0.75rem',
                                                marginBottom:'0.75rem' // 버튼 패딩 조정
                                            }}
                                        >
                                            수강 취소
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose}>닫기</Button>
            </Modal.Footer>
        </Modal>

    );
}

export default StudApplyStatModal;