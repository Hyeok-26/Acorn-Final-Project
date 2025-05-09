import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../Layout';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,PieChart, Pie, Cell, ResponsiveContainer
  } from 'recharts';
import { Button, Form } from 'react-bootstrap';
import api from '../../api';
import { AdminSalesStatDto } from '../../types/AdminSalesStatDto';

type MonthlyData = {
    sMonth: string;
    profit: number | null;
    cost: number | null;
  };
type LectureSalesData = {
    subject: string|null;
    sales: number|0;
};

function SalesStatus(props) {
    const [thisYear, setThisYear]=useState<string>(new Date().getFullYear().toString());
    const [selected, setSelected] = useState("condition"); // 초기값 설정
    const [sYearList, setSYearList] = useState<string[]>([]);
    const [sMonthList, setSMonthList] = useState<AdminSalesStatDto[]>([]);
    const [sYear, setSYear] = useState(thisYear);
    const [sMonth, setSMonth] = useState("");
    const [selectedSub, setSelectedSub]=useState("");
    const [availableMonths, setAvailableMonths] = useState<string[]>([]); // 월 드롭다운용
    const [allYearData, setAllYearData] = useState<AdminSalesStatDto[]>([]);
    const [hideSubCondition, setHideSubCondition] = useState(true);
    const [salesData, setSalesData]= useState<MonthlyData[]>([]);
    const whenYearChange = (e)=> {
        setSYear(e.target.value);
    }
    const whenMonthChange = (e)=> {
        setSMonth(e.target.value);
    }
    useEffect(() => {
        // 컴포넌트가 마운트될 때 연도별 매출 데이터 가져오기 
        fetchYearlySales();
        setSelected("salesByYear"); // 초기 선택값 설정
        setHideSubCondition(false)
    },[])
    useEffect(() => {
        if (selected === "salesByLecture") {
            setSMonth(""); // 월 초기화
            setMonthlySalesByLecture([]);
            setYearlySalesByLecture([]);
            fetchLectureSales();
        } else if (selected === "salesByYear") {
            setSalesData([]);
            fetchYearlySales();
        } else {
            setSalesData([]); // 다른 조건 선택 시 초기화
            setSYearList([]); // 연도 목록 초기화
            setSMonthList([]); // 월 목록 초기화
        }
    }, [selected]);
   // useEffect에서 allYearData가 변경될 때 salesData를 업데이트
    useEffect(() => {
        if (selected === "salesByYear" && allYearData.length > 0) {
            const selectedYearData = allYearData.find(item => item.syear === sYear);
            console.log("selectedYearData", selectedYearData)
            if (selectedYearData?.profitList || selectedYearData?.costList) {
                const profitMap = new Map<string, number>();
                const costMap = new Map<string, number>();

                // profitList, costList에서 월별 데이터를 매핑
                selectedYearData.profitList?.forEach(item => {
                    if (item.smonth && item.price !== undefined) {
                        profitMap.set(item.smonth, item.price);
                    }
                });

                selectedYearData.costList?.forEach(item => {
                    if (item.smonth && item.price !== undefined) {
                        costMap.set(item.smonth, item.price);
                    }
                });
                console.log(profitMap, "profitMap")
                console.log(costMap, "costMap")

                const formatted = Array.from({ length: 12 }, (_, i) => {
                    const monthNum = i + 1;
                    const paddedMonth = monthNum.toString().padStart(2, '0'); // '01' ~ '12'
                    const key = `${sYear}-${paddedMonth}`; // '2025-01' ~ '2025-12'
                    return {
                        sMonth: monthNum.toString(), // 그래프에 표시할 월
                        profit: profitMap.get(key) || null,
                        cost: costMap.get(key) || null,
                    };
                });
                
                console.log(formatted, "formatted")
                setSalesData(formatted);
            } else {
                setSalesData([]); // 데이터 없으면 빈 배열
            }
        }
    }, [allYearData, selected, sYear]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value)
        console.log(selected)
        if (e.target.value === "condition") {
            setHideSubCondition(true);  // 선택한 경우 서브 조건 숨기기
        } else {
            setHideSubCondition(false);  // "연도별"을 선택한 경우 서브 조건 보이기
        }
    };
    const fetchYearlySales =() => {
        api.get(`/sales/YearlySale/${sYear}`)
        .then((res) => {
            const allyearlist= res.data.syearList;
            setAllYearData(allyearlist);
            const yearKeys = allyearlist.map(item => item.syear);
            setSYearList(yearKeys);
        })
        .catch((error) => {
            console.error("연도별 매출 데이터를 불러오는 중 오류 발생:", error);
        });    
    };

    
    // const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
    const SUBJECT_COLORS: { [key: string]: string } = {
        JAVA: '#8884d8',        // 보라
        JAVASCRIPT: '#82ca9d',  // 초록
        PYTHON: '#ffc658',      // 노랑
        '알 수 없음': '#ff8042'  // 기타 (예외 처리용)
    };
    const [yearlySalesByLecture, setYearlySalesByLecture] = useState<LectureSalesData[]>([]);
    const [monthlySalesByLecture, setMonthlySalesByLecture] = useState<LectureSalesData[]>([]);
    
    const fetchLectureSales =() => {
        console.log(sYear, "sYear")
        api.get(`/sales/LectureSale/${sYear}`)
        .then((res) => {    
            console.log(res.data, "res.data")
            const yearData: AdminSalesStatDto[] = res.data.syearList || [];
            //연도 목록 드롭다운용
            const yearKeys = yearData.map(item => item.syear);
            setSYearList(yearKeys);  // 
            const foundYear = yearData.find(item => item.syear === sYear);
            if (!foundYear) {
                setYearlySalesByLecture([]);
                setMonthlySalesByLecture([]);
                setAvailableMonths([]);
                return;
            }
            // 연간 강의 매출
            const yearlySales = (foundYear.lectSaleYearly || []).map(item => ({
                subject: item.cdLecture,
                sales: item.total || 0,
            }));
            setYearlySalesByLecture(yearlySales);
            // ⬇️ 월 목록 드롭다운용
            const monthKeys = (foundYear.smonthList || []).map(month => month.smonth);
            setAvailableMonths(monthKeys);
            // ⬇️ 기본 선택 월
            const firstMonth = foundYear.smonthList?.[0];
            if (firstMonth) {
                setSMonth(firstMonth.smonth); // 현재 선택된 월 설정
                const monthlySales = (firstMonth.lectSaleMonthly || []).map(item => ({
                    subject: item.cdLecture||null,
                    sales: item.total || 0,
                }));
                setMonthlySalesByLecture(monthlySales);
            } else {
                setMonthlySalesByLecture([]);
            }
           
        })
        .catch((error) => { 
            console.error("과목별 매출 데이터를 불러오는 중 오류 발생:", error);
        });  

    }
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSMonth(e.target.value);  // 선택만 저장
        api.get(`/sales/LectureSale/${sYear}`)
        .then((res) => {
            const yearData: AdminSalesStatDto[] = res.data.syearList || [];
            const foundYear = yearData.find(item => item.syear === sYear);
            const foundMonth = foundYear?.smonthList?.find(m => m.smonth === sMonth);
            if (foundMonth) {
                const monthlySales = (foundMonth.lectSaleMonthly || []).map(item => ({
                    subject: item.cdLecture ?? "알 수 없음",
                    sales: item.total || 0,
                }));
                setMonthlySalesByLecture(monthlySales);
            } else {
                setMonthlySalesByLecture([]);
            }
        })
        .catch(error => {
            console.error("월별 매출 불러오기 실패:", error);
        });
    };
    const handleMonthlySearchClick = () => {

    };
    // 1. sYear가 바뀔 때 강의별 연매출/월매출 데이터 불러오기
    useEffect(() => {
        if (selected === "salesByLecture") {
            fetchLectureSales();
        }
    }, [sYear]);

    // 2. sMonth가 바뀔 때 해당 월의 강의 매출 조회
    useEffect(() => {
        if (selected === "salesByLecture" && sMonth) {
            handleMonthlySearchClick();
        }
    }, [sMonth]);
    //연도변경시 초기화
    useEffect(() => {
        if (selected === "salesByLecture") {
            setMonthlySalesByLecture([]);
            setAvailableMonths([]);
            setSMonth("");
        }
    }, [sYear]);
    //월변경시 월별데이터 초기화
    useEffect(() => {
        if (selected === "salesByLecture" && !sMonth) {
            setMonthlySalesByLecture([]);
        }
    }, [sMonth]);
    return (
        <div>
            <button onClick={()=>{
                api.get("/sales/ping")
                .then(res=>{
                    console.log(res.data)
                    alert(res.data)
                })
                .catch(error=>{
                    alert("응답하지 않음")
                })
            }}>ping 요청</button>
            <div>
                <h3>매출 확인 영역</h3>
                <div className="d-flex justify-content-between align-items-center mb-3 row">
                    <div className="col-md-8 col-12 d-flex justify-content-between align-items-center">
                        <Form className='d-flex'>
                            <Form.Select value={selected} onChange={handleSelect} size="sm" aria-label="yearorlecture" className='me-2' style={{ minWidth: "250px", maxWidth:"500px" }}>
                                <option value="salesByYear">연별 매출</option>
                                <option value="salesByLecture">과목별 매출</option>
                            </Form.Select>
                            <Form.Select hidden={hideSubCondition} size="sm" aria-label="year" className='me-2' style={{ minWidth: "250px", maxWidth:"300px" }}  value={sYear} onChange={(e)=> {whenYearChange(e)}}>
                                <option value="selectyearcondition">연도 선택</option>
                                {sYearList.map((item, index) => (
                                    <option key={index}>{item}</option>
                                ))}
                            </Form.Select>
                            <Button className='btn btn-secondary' size="sm" style={{ width: "120px" }}>검색</Button>
                        </Form>
                    </div>
                </div>
                
                    {
                        selected==="salesByYear"?
                        <LineChart width={1000} height={400} data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="sMonth" />
                            <Tooltip formatter={(value) => {
                                if (typeof value === 'number') return `${value.toLocaleString()}원`;
                                return value;
                            }} />
                            <YAxis tickFormatter={(value) => {
                                if (typeof value === 'number') return `${value.toLocaleString()}`;
                                return value;
                            }} />
                            <Legend formatter={(value) => {
                                        if (value === 'profit') return '수입'; // profit에 대해 한글로 변경
                                        if (value === 'cost') return '지출';  // cost에 대해 한글로 변경
                                        return value;
                            }} />
                            <Line type="monotone" dataKey="profit" stroke="#1E90FF" connectNulls={false} />
                            <Line type="monotone" dataKey="cost" stroke="#FF6347" connectNulls={false} />
                        </LineChart>
                        :
                        <div>
                        </div>
                    }
                    {   
                        selected==="salesByLecture"?
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div>
                                    <h5>과목별 연매출</h5>
                                </div>
                                <ResponsiveContainer width={500} height={400}>
                                    <PieChart>
                                    <Pie
                                        data={yearlySalesByLecture}
                                        dataKey="sales"
                                        nameKey="subject"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {yearlySalesByLecture.map((entry, index) => (
                                        <Cell
                                            key={`cell-yearly-${index}`}
                                            fill={SUBJECT_COLORS[entry.subject ?? '알 수 없음'] || '#ccc'}
                                        />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: 'flex',flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div className="d-flex align-items-center">
                                    <Form className="d-flex align-items-center flex-row gap-2" style={{ flexWrap: 'nowrap' }}>
                                        <div className="d-flex align-items-center">
                                            <h5 className="mb-0">해당 연도의 월매출</h5>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Form.Select hidden={hideSubCondition} size="sm" aria-label="year" style={{ minWidth: '150px' }} value={sMonth} onChange={handleMonthChange}>
                                                <option value="condition">월 선택</option>
                                                {availableMonths.map((month, index) => (
                                                    <option key={index} value={month}>{month}월</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <Button className="btn btn-secondary" size="sm">검색</Button>
                                        </div>
                                    </Form>
                                </div>
                                <ResponsiveContainer width={500} height={400}>
                                    <PieChart>
                                    <Pie data={monthlySalesByLecture} dataKey="sales" nameKey="subject" 
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {monthlySalesByLecture.map((entry, index) => (
                                        <Cell
                                            key={`cell-monthly-${index}`}
                                            fill={SUBJECT_COLORS[entry.subject ?? '알 수 없음'] || '#ccc'}
                                        />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div> 
                        :
                        <div>
                        </div>
                    }
            </div>

        </div>
    );
}
export default SalesStatus;