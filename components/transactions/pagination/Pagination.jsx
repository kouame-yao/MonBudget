function Pagination({ transaction }) {
  const itemsPerPage = 5;
  const totalPage = Math.ceil(transactions.length / itemsPerPage);
  const starIndex = (currentPage - 1) * itemsPerPage;
  const StartItems = transactions.slice(starIndex, starIndex + itemsPerPage);

  const ToggglePage = (page) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
  };
  return (
    <div className="flex justify-between py-8 px-6">
      <div className="text-2xl text-gray-400">Page 1 sur 2</div>
      <div className="flex items-center gap-8">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            ToggglePage(currentPage - 1);
          }}
          className="bg-gray-400 p-2 rounded-md "
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => {
            ToggglePage(currentPage + 1);
          }}
          className="bg-gray-400 p-2 rounded-md"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
