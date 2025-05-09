import React, { useState } from 'react';
import { Button, CloseButton, Form, Modal, Table } from 'react-bootstrap';
import StudApplyAddModal from './StudApplyAddModal';

function StudApplyStatModal({show, onHide, classId}) {
    const [showApplyAddModal, setShowApplyAddModal] = useState(false);
    const [students, setStudents] = useState([    
        { id: 1, name: "김서준", phone: "010-4823-9102" },
        { id: 2, name: "이지우", phone: "010-1738-5264" },
        { id: 3, name: "박하린", phone: "010-6951-3807" },
        { id: 8, name: "장태현", phone: "010-5107-8633" },
        { id: 9, name: "오하늘", phone: "010-2894-3701" },
        { id: 10, name: "백지훈", phone: "010-6483-7905" }]);
    const [allStudents, setAllStudents] = useState([
        { id: 1, name: "김서준", phone: "010-4823-9102" },
        { id: 2, name: "이지우", phone: "010-1738-5264" },
        { id: 3, name: "박하린", phone: "010-6951-3807" },
        { id: 4, name: "최민석", phone: "010-8429-1170" },
        { id: 5, name: "정유나", phone: "010-3662-7480" },
        { id: 6, name: "윤도현", phone: "010-9241-6558" },
        { id: 7, name: "한지민", phone: "010-7305-2294" },
        { id: 8, name: "장태현", phone: "010-5107-8633" },
        { id: 9, name: "오하늘", phone: "010-2894-3701" },
        { id: 10, name: "백지훈", phone: "010-6483-7905" },
        { id: 11, name: "서하윤", phone: "010-1234-5678" },
        { id: 12, name: "이도현", phone: "010-2345-6789" },
        { id: 13, name: "강지호", phone: "010-3456-7890" },
        { id: 14, name: "김나연", phone: "010-4567-8901" },
        { id: 15, name: "정하진", phone: "010-5678-9012" },
        { id: 16, name: "문채원", phone: "010-6789-0123" },
        { id: 17, name: "안성훈", phone: "010-7890-1234" },
        { id: 18, name: "조예린", phone: "010-8901-2345" },
        { id: 19, name: "홍지우", phone: "010-9012-3456" },
        { id: 20, name: "배수아", phone: "010-0123-4567" }
    ]);
    const maxStudent = 10;

    const handleAddStudents = (newStudents) => {
        const newIds = new Set(students.map(s => s.id));
        const filtered = newStudents.filter(s => !newIds.has(s.id));
        setStudents(prev => [...prev, ...filtered]);
    };

    const handleRemoveStudent = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };
    return (
        <>

        <Modal show={show} onHide={onHide} size="xl" centered>
                <Modal.Header>
                    <Modal.Title>{` 수강생 리스트`}</Modal.Title>
                    <CloseButton onClick={onHide} />
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="d-flex justify-content-between mb-3 w-100" style={{ maxWidth: 600 }}>
                        <h5>{`수업 신청현황 : ${students.length}/${maxStudent}`}</h5>
                        <Button onClick={() => setShowApplyAddModal(true)}>수강생 추가</Button>
                    </div>
                    <div style={{ maxHeight: 300, width: '100%', maxWidth: 600, overflowY: 'auto' }}>
                        <Table bordered size="sm" className="text-center align-middle">
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
                                                onClick={() => handleRemoveStudent(student.id)}
                                                size="sm"
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
                    <Button onClick={onHide}>닫기</Button>
                </Modal.Footer>
            </Modal>

            <StudApplyAddModal
                show={showApplyAddModal}
                onHide={() => setShowApplyAddModal(false)}
                onAddStudents={handleAddStudents}
                allStudents={allStudents}
                alreadyAddedIds={students.map(s => s.id)}
                studentCount={students.length}
                currentCount={students.length}
                maxCount={maxStudent}
            />

        </>
 
    );
}

export default StudApplyStatModal;