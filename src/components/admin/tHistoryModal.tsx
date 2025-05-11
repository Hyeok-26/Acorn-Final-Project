import { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import api from '@/api';


// 수업 이력 타입
interface ClassHistory{
    teacherId: number;
	name: string;
    classId: number;
    className: string;
    currentStudent: number;
    maxStudent: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    weekday: string;
}
// 필요한 props 의 타입
interface HistoryModalProps {
    teacher: {teacherId: number; name: string};
    show: boolean;
    onClose: () => void;
}
const HistoryModal: React.FC<HistoryModalProps> = ({teacher, show, onClose}) => {
    const [histories, setHistories] = useState<ClassHistory[]>([]);
    const teacherId = teacher.teacherId;

    useEffect(()=>{
        api.get(`teachers/class?teacherId=${teacherId}`)
        .then(res=>{
            console.log(res.data);
            setHistories(res.data);
        })
        .catch(err=>console.log(err));
    }, [teacherId]);

    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title><strong>{teacher.name}</strong> 강사 수업 이력</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>수업명</th>
                            <th>수업인원</th>
                            <th>수업기간</th>
                            <th>수업시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories.map((history, index) => (
                            <tr key={history.classId}>
                                <td>{index + 1}</td>
                                <td>{history.className}</td>
                                <td>{history.currentStudent}/{history.maxStudent}</td>
                                <td>{history.startDate} ~ {history.endDate}</td>
                                <td>[{history.weekday}] {history.startTime} ~ {history.endTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}

export default HistoryModal;