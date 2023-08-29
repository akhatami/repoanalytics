function Pagination({ total, page, perPage, onPageChange}) {
    const totalPages = Math.ceil(total / perPage);

    return (
        <div>
            {/* display pages */}
            <button
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}>&larr;</button>
            Page {page} of {totalPages}
            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}>&rarr;</button>
        </div>
    )
}
export default Pagination;
