import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Form, Pagination, Table } from 'react-bootstrap';
import RegisterModal from '../../components/admin/tRegisterModal';
import UpdateModal from '../../components/admin/tUpdateModal';
import HistoryModal from '../../components/admin/tHistoryModal';
import api from '../../api';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 강사 정보 관리를 위한 강사 타입 
interface Teacher{
    teacherId: number;
	name: string;
    birth: string;
    phone: string;
	userId: number;
    storeName: string;
    salary: number;
    cdStatus: string;
    statusName: string;
    classNames: string; 
}

// 해당 페이지의 모든 정보 관리를 위한 pageInfo 타입
interface PageInfo {
    list: Teacher[];
    startPageNum: number;
    endPageNum: number;
    totalPageCount: number;
    pageNum: number;
    totalRow: number;
    state: string;
    condition: string;
    keyword: string;
}

function TeacherList() {
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        list: [],
        startPageNum: 0,
        endPageNum: 0,
        totalPageCount: 0,
        pageNum: 1,
        totalRow: 0,
        state: "WORK",
        condition: "",
        keyword: ""
    });

    // const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [showRegister, setShowRegister] = useState(false);
    const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const [params, setParams] = useSearchParams(); // URL 기준으로 상태 유지 및 변경
    const [pageArray, setPageArray] = useState<number[]>([]);
    
    const userId = "2"; // userId 데이터 가져오기
    
    const state = params.get("state") || "WORK";
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
        api.get('/teachers', {
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
        console.log({ userId, pageNum, state, condition, keyword });
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
            <h1 style={{ marginTop: '60px',marginBottom: '60px' }}>강사 목록</h1>
            <div className="d-flex justify-content-between align-items-center">
                {/* 왼쪽: 검색 관련 폼 */}
                <Form className="d-flex align-items-center gap-1">                
                    {/* 재직/퇴직/전체 버튼 */}
                    <ButtonGroup>
                        <Button
                        variant={state === "WORK" ? "primary" : "outline-primary"}
                        onClick={() => changeState("WORK")}
                        style={{ whiteSpace: "nowrap" }}
                        >
                        재직
                        </Button>
                        <Button
                        variant={state === "T_QUIT" ? "primary" : "outline-primary"}
                        onClick={() => changeState("T_QUIT")}
                        style={{ whiteSpace: "nowrap" }}
                        >
                        퇴직
                        </Button>
                        <Button
                        variant={state === "WHOLE" ? "primary" : "outline-primary"}
                        onClick={() => changeState("WHOLE")}
                        style={{ whiteSpace: "nowrap" }}
                        >
                        전체
                        </Button>                        
                    </ButtonGroup>

                    {/* 검색 조건 drop-down 선택 */}                
                    <Form.Select value={searchCondition} onChange={(e) => setSearchCondition(e.target.value)} style={{ maxWidth: "100px" }}>
                        <option value="">선택</option>
                        <option value="TEACHER">강사명</option>
                        <option value="CLASS">수업명</option>
                    </Form.Select>                    

                    {/* 검색어 keyword 입력 */}
                    <Form.Control
                        type="text"
                        placeholder={
                            condition === "TEACHER" 
                            ? "강사명을 입력하세요" 
                            : condition === "CLASS"
                            ? "수업명을 입력하세요"
                            : "검색조건을 선택하세요"
                        }
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ minWidth: "200px" }}
                    />

                    {/* 검색 버튼 */}
                    <Button variant="success" onClick={handleSearch} style={{ whiteSpace: "nowrap" }}>검색</Button>
                    <Button variant="dark" onClick={handleReset} style={{ whiteSpace: "nowrap" }}>초기화</Button>
                </Form>

                { pageInfo.keyword && (
                    <p><strong>{pageInfo.totalRow}</strong> 명의 강사가 검색되었습니다</p>
                )}
                {/* 오른쪽: 강사 등록 버튼 */}
                <Button variant="outline-dark" className="ms-auto" onClick={() => setShowRegister(true)}>강사 등록</Button>
                
            </div>
            <Table>
                <thead className="table-success">
                    <tr>
                        <th>번호</th>
                        <th>지점명</th>
                        <th>이름</th>
                        <th>생년 월일</th>
                        <th>전화 번호</th>
                        <th>재직 여부</th>                         
                        <th>현재 담당 수업</th>
                        <th>수업 이력</th>
                        <th>정보 수정</th>
                    </tr>
                </thead>
                <tbody>
                    { pageInfo.list.map((teacher, index) => (
                        <tr key={teacher.teacherId}>
                            <td>{index + 1}</td>
                            <td>{teacher.storeName}</td>
                            <td>{teacher.name}</td>
                            <td>{teacher.birth}</td>
                            <td>{teacher.phone}</td>
                            <td>{teacher.statusName}</td>
                            <td>{teacher.cdStatus === "WORK" ? teacher.classNames : "-"}</td>
                            <td>
                                <Button size="sm" onClick={() => setSelectedTeacher(teacher)}>보기</Button>
                            </td>
                            <td>
                                <Button size="sm" onClick={() => setEditTeacher(teacher)}>수정</Button>
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

            {editTeacher && (
                <UpdateModal
                    teacher={editTeacher}
                    show={true}
                    onClose={() => setEditTeacher(null)}
                    onUpdate={fetchData}
                />
            )}

            {selectedTeacher && (
                <HistoryModal
                    teacher={selectedTeacher}
                    show={true}
                    onClose={() => setSelectedTeacher(null)}
                />
            )}
        </div>
    );
}

export default TeacherList;