export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex space-x-2">
        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
          <option>10 items per page</option>
          <option>25 items per page</option>
          <option>50 items per page</option>
        </select>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50" disabled={currentPage === 1}>
          Previous
        </button>
        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50" disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
