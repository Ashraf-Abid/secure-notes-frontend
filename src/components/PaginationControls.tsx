import { Pagination } from '../types';

interface Props {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ pagination, onPageChange }: Props) {
  const { currentPage, totalPages, totalItems } = pagination;
  if (totalItems === 0) return null;

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-gray-600">
        Page {currentPage} of {totalPages} · {totalItems} total
      </span>
      <div className="flex gap-2">
        <button className="btn-secondary py-1" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </button>
        <button
          className="btn-secondary py-1"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
