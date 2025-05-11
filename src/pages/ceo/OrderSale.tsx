import { useState } from "react";
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

function OrderSale() {
    const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');

    // 샘플 데이터
    const data = [
        { name: '1월', 매출: 1000000 },
        { name: '2월', 매출: 1500000 },
        { name: '3월', 매출: 2000000 },
        { name: '4월', 매출: 1800000 },
        { name: '5월', 매출: 2200000 },
        { name: '6월', 매출: 2500000 },
        { name: '7월', 매출: 2800000 },
        { name: '8월', 매출: 2600000 },
        { name: '9월', 매출: 3000000 },
        { name: '10월', 매출: 3200000 },
        { name: '11월', 매출: 3500000 },
        { name: '12월', 매출: 4000000 },
    ];

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
                                <TableRow>
                                    <TableCell>샘플 데이터</TableCell>
                                    <TableCell>1,000,000원</TableCell>
                                    <TableCell>2024-03-21</TableCell>
                                    <TableCell>2024-03-21</TableCell>
                                    <TableCell>구분1</TableCell>
                                    <TableCell>상세1</TableCell>
                                    <TableCell>자동</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="w-full h-full bg-white p-8 flex items-center justify-center">
                        <div className="w-[70%] h-[70%]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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