import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Form, Pagination, Table } from 'react-bootstrap';
import RegisterModal from '../../components/admin/sRegisterModal';
import UpdateModal from '../../components/admin/sUpdateModal';
import HistoryModal from '../../components/admin/sHistoryModal';
import api from '../../api';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 학생 타입
interface Student {
    studentId: number;
    name: string;
    phone: string;
    userId: number;
    storeName: string;
    cdStatus: string;
    statusName: string;
    classNames: string;
}

// pageInfo 타입
interface PageInfo {
    list: Student[];
    startPageNum: number;
    endPageNum: number;
    totalPageCount: number;
    pageNum: number;
    totalRow: number;
    state: string;
    condition: string;
    keyword: string;
}

function StudentList() {
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        list: [],
        startPageNum: 0,
        endPageNum: 0,
        totalPageCount: 0,
        pageNum: 1,
        totalRow: 0,
        state: "STUDY",
        condition: "",
        keyword: ""
    });

    // const [students, setStudents] = useState<Student[]>([]);
    const [showRegister, setShowRegister] = useState(false);
    const [editStudent, setEditStudent] = useState<Student | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams(); // URL 기준으로 상태 유지 및 변경
    const [pageArray, setPageArray] = useState<number[]>([]);
    
    //const userId = "2"; // TODO: 실제 로그인한 사용자 userId 데이터 가져오기
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user.userId; 

    const state = params.get("state") || "STUDY";
    const condition = params.get("condition") || "";
    const keyword = params.get("keyword") || "";
    const pageNum = parseInt(params.get("pageNum") || "1");

    const [searchCondition, setSearchCondition] = useState(condition);
    const [searchKeyword, setSearchKeyword] = useState(keyword);    

    // 페이징용 숫자 배열 생성
    function range(start: number, end: number): number[] {
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    // 학생 목록 데이터 가져오기
    const fetchData = () => {
        console.log({ userId, pageNum, state, condition, keyword });
        api.get('/students', {
            params: {
                userId,
                pageNum,
                state,
                condition,
                keyword,
            }
        })
        .then(res => {
            console.log(res.data);
            setPageInfo(res.data);
            setPageArray(range(res.data.startPageNum, res.data.endPageNum));
        })
        .catch(err => console.error(err));
    };

    // 페이지 이동
    const move = (newPageNum: number) => {
        setParams({
          userId,
          pageNum: newPageNum,
          state,
          condition,
          keyword,
        });
    };

      // state 변경 시 1페이지로 이동
      const changeState = (newState: string) => {
        setParams({
          userId,
          pageNum: "1",
          state: newState,
          condition,
          keyword,
        });
      };

    // 검색 버튼 클릭 시 condition, keyword 반영
    const handleSearch = (): void => {
        console.log({ userId, state, condition, keyword });
        setParams({
          userId,
          pageNum: "1",
          state,
          condition: searchCondition,
          keyword: searchKeyword,
        });
    };

    // 검색 초기화
    const handleReset = (): void => {
        setSearchCondition("");
        setSearchKeyword("");

        setParams({
          userId,
          pageNum: "1",
          state,
          condition: "",
          keyword: "",
        });

    };

    useEffect(() => {
        fetchData();
    }, [params]); // params 변화에 따라 fetchData
    
    //전체 div에 적용될 css
    const centerStyle: React.CSSProperties ={
        maxWidth:"1600px",
        margin:"0 auto",
        padding:"2rem",
        textAlign:"center"
    }
    return (
        <div style={centerStyle}>
            <h1 style={{ marginTop: '60px',marginBottom: '60px' }}>학생 목록</h1>
            <div className="d-flex justify-content-between align-items-center">
                <Form className="d-flex align-items-center gap-1">
                    {/* 재원/퇴원/전체 버튼 */}
                    <ButtonGroup>
                        <Button variant={state === "STUDY" ? "primary" : "outline-primary"} onClick={() => changeState("STUDY")} style={{ whiteSpace: "nowrap" }}>재원</Button>
                        <Button variant={state === "S_QUIT" ? "primary" : "outline-primary"} onClick={() => changeState("S_QUIT")} style={{ whiteSpace: "nowrap" }}>퇴원</Button>
                        <Button variant={state === "WHOLE" ? "primary" : "outline-primary"} onClick={() => changeState("WHOLE")} style={{ whiteSpace: "nowrap" }}>전체</Button>
                    </ButtonGroup>

                    {/* 검색 조건 */}
                    <Form.Select value={searchCondition} onChange={(e) => setSearchCondition(e.target.value)} style={{ maxWidth: "100px" }}>
                        <option value="">선택</option>
                        <option value="STUDENT">학생명</option>
                        <option value="CLASS">수업명</option>
                    </Form.Select>

                    {/* 검색어 */}
                    <Form.Control
                        type="text"
                        placeholder={
                            condition === "STUDENT"
                                ? "학생명을 입력하세요"
                                : condition === "CLASS"
                                ? "수업명을 입력하세요"
                                : "검색조건을 선택하세요"
                        }
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ minWidth: "200px" }}
                    />

                    <Button variant="success" onClick={handleSearch} style={{ whiteSpace: "nowrap" }}>검색</Button>
                    <Button variant="dark" onClick={handleReset} style={{ whiteSpace: "nowrap" }}>초기화</Button>
                </Form>

                {pageInfo.keyword && (
                    <p><strong>{pageInfo.totalRow}</strong> 명의 학생이 검색되었습니다</p>
                )}

                <Button variant="outline-dark" className="ms-auto" onClick={() => setShowRegister(true)}>학생 등록</Button>
            </div>

            <Table bordered hover>
                <thead className="table-success">
                    <tr>
                        <th>번호</th>
                        <th>지점명</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>재원 여부</th>
                        <th>현재 수강 수업</th>
                        <th>수강 이력</th>
                        <th>정보 수정</th>
                    </tr>
                </thead>
                <tbody>
                    {pageInfo.list.map((student, index) => (
                        <tr key={student.studentId}>
                            <td>{index + 1}</td>
                            <td>{student.storeName}</td>
                            <td>{student.name}</td>
                            <td>{student.phone}</td>
                            <td>{student.statusName}</td>
                            <td>{student.cdStatus === "STUDY" ? student.classNames : "-"}</td>
                            <td>
                                <Button variant="light" className="btn btn-sm btn-outline-dark" 
                                onClick={() => setSelectedStudent(student)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
                                    <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                                    </svg>
                                </Button>
                            </td>
                            <td>
                                <Button variant="light" className="btn btn-sm btn-outline-dark" size="sm" onClick={() => setEditStudent(student)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination className="mt-3 justify-content-center">
                <Pagination.Item onClick={() => move(pageInfo.startPageNum - 1)}
                    disabled={pageInfo.startPageNum === 1}>
                    Prev
                </Pagination.Item>
                {pageArray.map(item => (
                    <Pagination.Item
                        key={item}
                        onClick={() => move(item)}
                        active={pageInfo.pageNum === item}
                    >
                        {item}
                    </Pagination.Item>
                ))}
                <Pagination.Item onClick={() => move(pageInfo.endPageNum + 1)}
                    disabled={pageInfo.endPageNum === pageInfo.totalPageCount}>
                    Next
                </Pagination.Item>
            </Pagination>

            {showRegister && (
                <RegisterModal
                    show={true}
                    onClose={() => setShowRegister(false)}
                    onRegister={fetchData}
                />
            )}

            {editStudent && (
                <UpdateModal
                    student={editStudent}
                    show={true}
                    onClose={() => setEditStudent(null)}
                    onUpdate={fetchData}
                />
            )}

            {selectedStudent && (
                <HistoryModal
                    student={selectedStudent}
                    show={true}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
}

export default StudentList;
