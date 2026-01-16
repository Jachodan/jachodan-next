"use client";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export default function CustomPagination({ currentPage, totalPages, onPageChange, maxVisiblePages = 5 }: CustomPaginationProps) {
  const getPageNumbers = () => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 페이지 */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center justify-center gap-1 rounded-md px-2.5 h-9 text-sm disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
            aria-label="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전</span>
          </button>
        </PaginationItem>

        {/* 첫 페이지 + 생략 기호 */}
        {pageNumbers[0] > 1 && (
          <>
            <PaginationItem>
              <button onClick={() => onPageChange(1)} className="inline-flex items-center justify-center rounded-md h-9 w-9 text-sm hover:bg-accent hover:text-accent-foreground">
                1
              </button>
            </PaginationItem>
            {pageNumbers[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* 페이지 번호들 */}
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <button
              onClick={() => onPageChange(pageNumber)}
              className={`inline-flex items-center justify-center rounded-md h-9 w-9 text-sm ${
                pageNumber === currentPage ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-current={pageNumber === currentPage ? "page" : undefined}
            >
              {pageNumber}
            </button>
          </PaginationItem>
        ))}

        {/* 마지막 페이지 + 생략 기호 */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <button
                onClick={() => onPageChange(totalPages)}
                className="inline-flex items-center justify-center rounded-md h-9 w-9 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {totalPages}
              </button>
            </PaginationItem>
          </>
        )}

        {/* 다음 페이지 */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center justify-center gap-1 rounded-md px-2.5 h-9 text-sm disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
            aria-label="다음 페이지"
          >
            <span className="hidden sm:inline">다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
