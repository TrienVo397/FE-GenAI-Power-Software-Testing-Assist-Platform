import React from "react";

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = "items",
}) => {
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
      <div>
        Showing {start}–{end} of {totalItems} {itemLabel}
      </div>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
