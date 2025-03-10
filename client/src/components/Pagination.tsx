type PaginationProps = {
  pageSize: number;
  totalPages: number;
  page: number;
  setPageSize: (value: number | ((prevValue: number) => number)) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * Ex.
 * <Pagination
        pageSize={pageSize}
        page={page}
        totalPages={totalPages}
        setPageSize={setPageSize}
        setPage={setPage}
      />
 */

const Pagination = ({
  pageSize,
  page,
  totalPages,
  setPageSize,
  setPage,
}: PaginationProps) => {
  return (
    <div className="flex justify-end items-center gap-8 mt-4">
      <div className="flex items-center gap-2">
        <label htmlFor="itemsPerPage">Items:</label>
        <select
          className="px-2 py-1 border rounded"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={1}>1</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default Pagination;
