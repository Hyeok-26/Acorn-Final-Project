import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '../../api';

interface ClassHistory {
    studentId: number;
    name: string;
    classId: number;
    className: string;
    teacherId: number;
    teacherName: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    weekday: string;
}

interface HistoryModalProps {
    student: { studentId: number; name: string };
    show: boolean;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ student, show, onClose }) => {
    const [histories, setHistories] = useState<ClassHistory[]>([]);
    const studentId = student.studentId;

    useEffect(() => {
            api.get(`/students/class?studentId=${student.studentId}`)
                .then(res => {
                    console.log(res.data);
                    setHistories(res.data);
                })
                .catch(err => console.log(err));
    }, [studentId]);

    return (
        <Modal show={show} onHide={onClose} size="xl">
            
            <Modal.Header closeButton>
                <Modal.Title><strong>{student.name}</strong> 학생 수강 이력</Modal.Title>
            </Modal.Header>
            {/* Modal Body 의 높이 고정 + 스크롤 적용 */}
            <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>수업명</th>
                            <th>강사명</th>
                            <th>수강기간</th>
                            <th>수강시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories.map((history, index) => (
                            <tr key={history.classId}>
                                <td>{index + 1}</td>
                                <td>{history.className}</td>
                                <td>{history.teacherName}</td>
                                <td>{history.startDate} ~ {history.endDate}</td>
                                <td>[{history.weekday}] {history.startTime} ~ {history.endTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            
        </Modal>
    );
};

export default HistoryModal;
