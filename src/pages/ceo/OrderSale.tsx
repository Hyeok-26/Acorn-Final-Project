import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface CeoSaleDto {
    ceoSaleId: number;
    userId: number;
    creDate: string;
    editDate: string;
    saleName: string;
    price: number;
    cdAcode: string;
    cdBcode: string;
    auto: string;
}

interface GraphDataItem {
    name: string;
    매출: number;
}

interface CeoSalePageDto {
    content: CeoSaleDto[];  // 실제 데이터
    pageNum: number;        // 현재 페이지
    startRowNum: number;    // 시작 행 번호
    endRowNum: number;      // 끝 행 번호
    totalRow: number;       // 전체 데이터 수
    totalPageCount: number; // 전체 페이지 수
    startPageNum: number;   // 시작 페이지 번호
    endPageNum: number;     // 끝 페이지 번호
}

function OrderSale() {
    const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');
    const [currentPage, setCurrentPage] = useState(1);

    // API 호출
    const { data: response, isLoading, error } = useQuery<CeoSalePageDto>({
        queryKey: ['ceo-sales', currentPage],
        queryFn: async () => {
            console.log('API 호출 시작');
            const params = new URLSearchParams({
                pageNum: currentPage.toString()
            });
            
            const response = await fetch(`/api/ceosale?${params.toString()}`);
            console.log('API 응답:', response);
            if (!response.ok) {
                throw new Error('Failed to fetch sales data');
            }
            const data = await response.json();
            console.log('받아온 데이터:', data);
            return data;
        }
    });

    // response가 dto 자체이므로 content를 직접 사용
    const salesData = response?.content || [];

    // 그래프 데이터 변환
    const graphData = salesData?.reduce((acc: GraphDataItem[], sale) => {
        const month = new Date(sale.creDate).getMonth() + 1;
        const existingMonth = acc.find(item => item.name === `${month}월`);
        
        if (existingMonth) {
            existingMonth.매출 += sale.price;
        } else {
            acc.push({
                name: `${month}월`,
                매출: sale.price
            });
        }
        return acc;
    }, []).sort((a, b) => parseInt(a.name) - parseInt(b.name)) || [];

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러가 발생했습니다</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            <div className="flex justify-between items-center p-6 bg-white border-b">
                <h1 className="text-2xl font-bold">발주 수익 보는 페이지</h1>
                <Button 
                    onClick={() => setViewMode(viewMode === 'table' ? 'graph' : 'table')}
                    variant="default"
                >
                    {viewMode === 'table' ? '그래프로 보기' : '표로 보기'}
                </Button>
            </div>

            <div className="flex-1 overflow-auto">
                {viewMode === 'table' ? (
                    <div className="container mx-auto p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>번호</TableHead>
                                    <TableHead>지점</TableHead>
                                    <TableHead>매출 항목</TableHead>
                                    <TableHead>총 금액</TableHead>
                                    <TableHead>매출 날짜</TableHead>
                                    <TableHead>수정 날짜</TableHead>
                                    <TableHead>구분</TableHead>
                                    <TableHead>구분 상세</TableHead>
                                    <TableHead>입력 방식</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesData?.map((sale, index) => (
                                    <TableRow key={sale.ceoSaleId}>
                                        <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                        <TableCell>{sale.userId}</TableCell>
                                        <TableCell>{sale.saleName}</TableCell>
                                        <TableCell>{sale.price.toLocaleString()}원</TableCell>
                                        <TableCell>{sale.creDate}</TableCell>
                                        <TableCell>{sale.editDate}</TableCell>
                                        <TableCell>{sale.cdAcode}</TableCell>
                                        <TableCell>{sale.cdBcode}</TableCell>
                                        <TableCell>{sale.auto}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        {/* 페이지네이션 버튼 */}
                        <div className="flex justify-center gap-2 mt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                이전
                            </Button>
                            
                            {response && [...Array(response.totalPageCount)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "ghost"}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                            
                            <Button
                                variant="ghost"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage >= (response?.totalPageCount || 1)}
                            >
                                다음
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-white p-8 flex items-center justify-center">
                        <div className="w-[70%] h-[70%]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value) => [`${value.toLocaleString()}원`, '매출']}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="매출" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderSale;