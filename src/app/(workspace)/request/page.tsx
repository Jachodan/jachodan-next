"use client";

import { REQUEST_TYPES, REQUEST_STATUS } from "@/types/request";

export default function RequestPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">요청사항 게시판</h1>
                <p className="text-gray-600">재고 관련 요청사항을 관리합니다.</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <div className="flex gap-2">
                    <select className="px-4 py-2 border rounded-lg">
                        <option value="all">전체 유형</option>
                        {REQUEST_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <select className="px-4 py-2 border rounded-lg">
                        <option value="all">전체 상태</option>
                        {REQUEST_STATUS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    <input type="text" placeholder="상품명 검색..." className="px-4 py-2 border rounded-lg w-64" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    요청유형
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상품명
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    수량
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    요청일
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    요청자
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    확인상태
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <select className="text-sm border rounded px-2 py-1">
                                        {REQUEST_TYPES.map((type) => (
                                            <option key={type} value={type} selected={type === "입고요청"}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">샘플 상품</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">10</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">2026-01-16</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">홍길동</div>
                                </td>
                                <td className="px-6 py-4">
                                    <select className="text-sm border rounded px-2 py-1">
                                        {REQUEST_STATUS.map((status) => (
                                            <option key={status} value={status} selected={status === "대기"}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <nav className="flex gap-2">
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">이전</button>
                    <button className="px-4 py-2 border rounded-lg bg-blue-600 text-white">1</button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">2</button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">3</button>
                    <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">다음</button>
                </nav>
            </div>
        </div>
    );
}
