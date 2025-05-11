import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';

function StudApplyAddModal({show, onHide, onAddStudents,
    allStudents, alreadyAddedIds, currentCount, maxCount, studentCount}) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
  
    useEffect(() => {
      const results = allStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
          !alreadyAddedIds.includes(s.studentId)
      );
      setSearchResults(results);
    }, [searchKeyword, allStudents, alreadyAddedIds]);
  
    const toggleStudent = (student) => {
      const alreadySelected = selectedStudents.find((s) => s.studentId === student.studentId);
      if (alreadySelected) {
        setSelectedStudents((prev) => prev.filter((s) => s.studentId !== student.studentId));
      } else {
        const totalAfterAdd = currentCount + selectedStudents.length + 1;
        if (totalAfterAdd > maxCount) {
          alert('최대 수강 인원을 초과할 수 없습니다.');
          return;
        }
        setSelectedStudents((prev) => [...prev, student]);
      }
    };
  
    const isSelected = (studentId) =>
      selectedStudents.some((s) => s.studentId === studentId);
  
    const handleConfirm = () => {
      onAddStudents(selectedStudents); // 전달만 하면 됨
      setSelectedStudents([]);
      setSearchKeyword('');
      onHide();
    };
  
    const handleClose = () => {
      setSelectedStudents([]);
      setSearchKeyword('');
      onHide();
    };
  
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>수강생 추가</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
            <Form.Control
                type="text"
                placeholder="학생 이름 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="mb-3"/>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              <h6>검색 결과</h6>
              <Table bordered size="sm" > 
                  <thead>
                    <tr>
                        <th>선택</th>
                        <th>학생코드</th>
                        <th>학생명</th>
                        <th>연락처</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((student) => (
                        <tr key={student.studentId}>
                        <td>
                            <Form.Check
                            type="checkbox"
                            checked={isSelected(student.studentId)}
                            onChange={() => toggleStudent(student)}
                            // disabled={
                            //   !isSelected(student.id) &&
                            //   selectedStudents.length >= (maxCount - currentCount)
                            // }
                            />
                        </td>
                        <td>{student.studentId}</td>
                        <td>{student.name}</td>
                        <td>{student.phone}</td>
                        </tr>
                    ))}
                  </tbody>
              </Table>
            </div>
           
            <div>
              <h6 className="mt-4">추가 대상 (현재 수업 {maxCount-(studentCount+selectedStudents.length)}명 추가 가능)</h6>
              <Table bordered size="sm">
                <thead>
                    <tr>

                        <th>이름</th>
                        <th>연락처</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedStudents.map((s) => (
                    <tr key={s.studentId}>
                        <td>{s.name}</td>
                        <td>{s.phone}</td>
                        <td>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                            setSelectedStudents((prev) => prev.filter((student) => student.studentId !== s.studentId))
                            }
                        >
                            삭제
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
              </Table>
            </div>
        </Modal.Body>
  
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedStudents.length === 0}
          >
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default StudApplyAddModal;