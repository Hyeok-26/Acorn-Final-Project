import { useEffect, useState } from "react";
import { Button, Container, Form, Pagination, Table } from "react-bootstrap";
import api from "../../api";
import type { FilterCondition, PageInfo } from "../../types/OrderType";
import { NavLink } from "react-router-dom";
import '../../components/admin/InvOrdStyle.css';
import {v4 as uuid} from "uuid";


function OrderList() {
    // 오늘 날짜 기준으로 한 달 범위 함수
    const getDateRange = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const last = new Date(year, month, 0);
        const lastdate = last.getDate();
        return [`${year}-${String(month).padStart(2, '0')}-01`,
        `${year}-${String(month).padStart(2, '0')}-${String(lastdate).padStart(2, '0')}`
        ]
    }

    // 조회 조건
    const [filterCon, setFilterCon] = useState<FilterCondition>({
        strDate: getDateRange()[0],
        endDate: getDateRange()[1],
        status: 'ALL'
    });

    // 페이징 숫자 출력
    const [pageArr, setPageArr] = useState<Array<number>>([]);
    // 페이지 요청 결과 정보
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        status: '',
        strDate: '',
        endDate: '',
        startPageNum: 0,
        endPageNum: 0,
        totalPageCount: 0,
        pageNum: 0,
        totalRow: 0,
        startRowNum: 0,
        endRowNum: 0,
        list: []
    });


    // 컴포넌트 활성화 시
    useEffect(() => {
        refreshList(1);
    }, []);


    // 발주서 목록 가져오기
    const refreshList = (num: number) => {
        //http://localhost:9000/ord/1?status=ALL&strDate=2025-04-01&endDate=2025-04-30
        api.get(`/ord/${num}?status=${filterCon.status}&strDate=${filterCon.strDate}&endDate=${filterCon.endDate}`)
            .then(res => {
                setPageInfo(res.data);

                // 하단 페이징 UI 개수 생성
                const result = [];
                for (let i = res.data.startPageNum; i <= res.data.endPageNum; i++) {
                    result.push(i);
                }
                setPageArr(result);
            })
            .catch(err => console.log(err));
    }

    // 삭제 버튼 핸들러
    const delBtnHandle = (status: string, pid: number) => {
        // 승인(APP) 또는 거절(REJ) 상태면 삭제 불가
        if (status === 'APP' || status === 'PEN') {
            alert('해당 상태에서는 삭제할 수 없습니다. \n( \'임시 저장\' 또는 \'거절\' 상태만 가능 )');
            return;
        }
        if (confirm("정말 삭제하시겠습니까?")) {
            api.delete("/ord/del/" + pid)
                .then(res => {
                    console.log(res);
                    alert('삭제되었습니다.');
                    refreshList(pageInfo.pageNum); // 삭제 후 리스트 갱신
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <>
            <Container fluid className="p-4">
                <h2 className="mb-4 text-center">발주 현황</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <NavLink to="/admin/order"><Button variant="success">발주서 작성</Button></NavLink>

                    <div className="d-flex gap-2 align-items-center">
                        <Form.Label className="mb-0">날짜</Form.Label>
                        <Form.Control
                            type="date"
                            value={filterCon.strDate}
                            onChange={(e) =>
                                setFilterCon({
                                    ...filterCon,
                                    strDate: e.target.value
                                })}
                            style={{ width: "150px" }}
                        />
                        <Form.Control
                            type="date"
                            value={filterCon.endDate}
                            onChange={(e) =>
                                setFilterCon({
                                    ...filterCon,
                                    endDate: e.target.value
                                })}
                            style={{ width: "150px" }}
                        />

                        <Form.Label className="mb-0">상태</Form.Label>
                        <Form.Select
                            value={filterCon.status}
                            onChange={(e) =>
                                setFilterCon({
                                    ...filterCon,
                                    status: e.target.value
                                })}
                            style={{ width: "120px" }}>
                            <option value="ALL">모두</option>
                            <option value="PEN">발주중</option>
                            <option value="APP">승인</option>
                            <option value="REJ">거절</option>
                        </Form.Select>
                        <Button variant="dark" onClick={() => refreshList(1)}>검색</Button>
                    </div>
                </div>

                <Table bordered className="text-center">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>발주 번호</th>
                            <th style={{ width: '20%' }}>발주 일자</th>
                            <th style={{ width: '15%' }}>발주자</th>
                            <th style={{ width: '15%' }}>발주 금액</th>
                            <th style={{ width: '15%' }}>상태</th>
                            <th style={{ width: '10%' }}>상세보기</th>
                            <th style={{ width: '10%' }}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, i) => {
                            const invoice = pageInfo.list[i];
                            return (
                                <tr key={uuid()} className="fixed-row">
                                    <td>{invoice?.orderId}</td>
                                    <td>{invoice?.ordDate}</td>
                                    <td>{invoice?.orderName}</td>
                                    <td>{invoice?.totalPrice}</td>
                                    <td>{invoice?.cdStatus === 'PEN' ? <Button variant="warning" style={{cursor: 'default'}}>발주중</Button> :
                                        invoice?.cdStatus === 'APP' ? <Button variant="primary" style={{cursor: 'default'}}>승인</Button> :
                                        invoice?.cdStatus === 'REJ' ? <Button variant="danger" style={{cursor: 'default'}}>거절</Button> :
                                        invoice?.cdStatus === 'WAIT' ? <Button variant="secondary" style={{cursor: 'default'}}>임시저장</Button> : ''}</td>
                                    <td>
                                        {invoice ? <NavLink to={`/admin/${invoice?.orderId}/order`}>
                                            <a style={{ cursor: 'pointer', color: 'green' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                </svg>
                                            </a>
                                        </NavLink> : null}
                                    </td>
                                    <td>{invoice?.orderId > 0 ?
                                        <a style={{ cursor: 'pointer', color: 'red' }}
                                            onClick={() => delBtnHandle(invoice?.cdStatus, invoice?.orderId)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                            </svg>
                                        </a> : ''
                                    }
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => { refreshList(pageInfo.startPageNum - 1) }}
                            disabled={pageInfo.startPageNum === 1} />
                        {pageArr.map((num) => (
                            <Pagination.Item key={num}
                                onClick={() => { refreshList(num) }}
                                active={pageInfo.pageNum === num}>
                                {num}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => { refreshList(pageInfo.endPageNum + 1) }}
                            disabled={pageInfo.endPageNum >= pageInfo.totalPageCount} />
                    </Pagination>
                </div>
            </Container>
        </>
    );
}

export default OrderList;