"use client";

import {
    REQUEST_TYPE,
    REQUEST_STATUS,
    REQUEST_TYPE_LABEL,
    REQUEST_STATUS_LABEL,
    type RequestType,
    type RequestStatus,
    type RequestListItem,
} from "@/types/item";
import {
    RequestTable,
    RequestTableHeader,
    RequestTableBody,
    RequestTableHead,
    RequestTableRow,
    RequestTableCell,
} from "@/components/ui/request-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RequestListTableProps {
    requests: RequestListItem[];
    onRowClick: (request: RequestListItem) => void;
    onRequestTypeChange: (requestId: number, newType: RequestType) => void;
    onRequestStatusChange: (requestId: number, newStatus: RequestStatus) => void;
}

export default function RequestListTable({
    requests,
    onRowClick,
    onRequestTypeChange,
    onRequestStatusChange,
}: RequestListTableProps) {
    return (
        <div className="rounded-md border">
            <RequestTable>
                <RequestTableHeader>
                    <RequestTableRow className="bg-gray-50">
                        <RequestTableHead className="font-semibold text-center">요청유형</RequestTableHead>
                        <RequestTableHead className="font-semibold text-center">상품명</RequestTableHead>
                        <RequestTableHead className="font-semibold text-center">수량</RequestTableHead>
                        <RequestTableHead className="font-semibold text-center">요청일</RequestTableHead>
                        <RequestTableHead className="font-semibold text-center">요청자</RequestTableHead>
                        <RequestTableHead className="font-semibold text-center">확인상태</RequestTableHead>
                    </RequestTableRow>
                </RequestTableHeader>
                <RequestTableBody>
                    {requests.length === 0 ? (
                        <RequestTableRow>
                            <RequestTableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                요청 내역이 없습니다.
                            </RequestTableCell>
                        </RequestTableRow>
                    ) : (
                        requests.map((request) => (
                            <RequestTableRow
                                key={request.requestId}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => onRowClick(request)}
                            >
                                <RequestTableCell className="py-4">
                                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                        <Select
                                            value={request.requestType}
                                            onValueChange={(value) => onRequestTypeChange(request.requestId, value as RequestType)}
                                        >
                                            <SelectTrigger size="sm" className="w-[123px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {REQUEST_TYPE.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {REQUEST_TYPE_LABEL[type]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center">
                                    <span className="text-sm text-gray-900">{request.itemName}</span>
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center">
                                    <span className="text-sm text-gray-900">{request.requestAmount ?? "-"}</span>
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center text-sm text-gray-500">
                                    {request.requestDate}
                                </RequestTableCell>
                                <RequestTableCell className="py-4 text-center">
                                    <span className="text-sm text-gray-900">{request.albaName}</span>
                                </RequestTableCell>
                                <RequestTableCell className="py-4">
                                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                        <Select
                                            value={request.requestStatus}
                                            onValueChange={(value) => onRequestStatusChange(request.requestId, value as RequestStatus)}
                                        >
                                            <SelectTrigger size="sm">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {REQUEST_STATUS.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {REQUEST_STATUS_LABEL[status]}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </RequestTableCell>
                            </RequestTableRow>
                        ))
                    )}
                </RequestTableBody>
            </RequestTable>
        </div>
    );
}
