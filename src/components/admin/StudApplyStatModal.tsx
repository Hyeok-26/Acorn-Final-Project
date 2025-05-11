import React, { useEffect, useState } from 'react';
import { Button, CloseButton, Form, Modal, Table } from 'react-bootstrap';
import StudApplyAddModal from './StudApplyAddModal';
import { ClassItem } from '@/types/ClassType';
import api from '@/api';
import { StuItem } from '@/types/StuType';

function StudApplyStatModal({show, onHide, classId}) {

    //해당수업정보 상태값으로 관리
    const [classDetail, setclassDetail] = useState<ClassItem>({
        classId: 0,
        className: "",
        cdLecture: "",
        userId: 0,
        teacherId: 0,
        teacherName: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        weekday: "",
        currentStudent: 0,
        maxStudent: 0,
        price: 0,
        applyStartDate: "",
        applyEndDate: "",
        cdStatus: "",
        description: ""
    });

    //수업정보 불러오기
    const classinfo = (classId:number)=>{
        api.get(`/class/detail?classId=${classId}`)
        .then(res=>{
            console.log(' 클래스정보!!:', res.data);
            if (res.data){
                setclassDetail(res.data);
            };
        })
        .catch(error=>{
        });
    };

    //모든학생 리스트 불러오기기
    const stuall = (userId:number)=>{
        api.get(`class/all-student?userId=${classDetail.userId}`)
        .then(res=>{
            setAllStudents(res.data);
        })
        .catch(error=>{

        });
    };

    //해당수업듣는 학생리스트 불러오기
    const stuclass = (classId:number)=>{
        api.get(`class/student?classId=${classId}`)
        .then(res=>{
            setStudents(res.data);
        })
        .catch(error=>{

        });
    };



    useEffect(()=>{
        if (show) {
            classinfo(classId);
            stuclass(classId);
            stuall(classDetail.userId);
        }
    }, [show]);


    const [students, setStudents] = useState<StuItem[]>([]);

    const [allStudents, setAllStudents] = useState<StuItem[]>([]);

    const maxStudent = classDetail.maxStudent;



    
    const handleAddStudents = (newStudents) => {
        const newIds = new Set(students.map(s => s.studentId));
        const filtered = newStudents.filter(s => !newIds.has(s.studentId));
        setStudents(prev => [...prev, ...filtered]);
    };

    const handleRemoveStudent = (studentId) => {
        setStudents(prev => prev.filter(s => s.studentId !== studentId));
    };


    //수강생 추가 모달달
    const [showApplyAddModal, setShowApplyAddModal] = useState(false);
    return (
        <>

        <Modal show={show} onHide={onHide} size="xl" centered>
                <Modal.Header>
                    <Modal.Title><strong>[{classDetail.classId}] {classDetail.className} </strong>{` 수강생 리스트`}</Modal.Title>
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
                                    <tr key={student.studentId}>
                                        <td>{student.name}</td>
                                        <td>{student.phone}</td>
                                        <td>
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleRemoveStudent(student.studentId)}
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
                alreadyAddedIds={students.map(s => s.studentId)}
                studentCount={students.length}
                currentCount={students.length}
                maxCount={maxStudent}
            />

        </>
 
    );
}

export default StudApplyStatModal;