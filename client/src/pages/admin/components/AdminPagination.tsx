import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
	currentPage: number;
	totalPages: number;
	loading?: boolean;
	onPageChange: (page: number) => void;
	summary?: string;
}

function getVisiblePages(currentPage: number, totalPages: number) {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, index) => index);
	}

	const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
	return Array.from({ length: 5 }, (_, index) => start + index);
}

export default function AdminPagination({
	currentPage,
	totalPages,
	loading = false,
	onPageChange,
	summary,
}: AdminPaginationProps) {
	if (totalPages <= 1) return null;

	const visiblePages = getVisiblePages(currentPage, totalPages);

	return (
		<nav className="admin-pagination" aria-label="Pagination">
			<span className="admin-pagination-summary">
				{summary ?? `Page ${currentPage + 1} of ${totalPages}`}
			</span>
			<div className="admin-pagination-controls">
				<button
					type="button"
					aria-label="Previous page"
					disabled={currentPage === 0 || loading}
					onClick={() => onPageChange(currentPage - 1)}
				>
					<ChevronLeft size={17} />
				</button>

				{visiblePages[0] > 0 && <span aria-hidden="true">…</span>}
				{visiblePages.map((page) => (
					<button
						type="button"
						key={page}
						className={currentPage === page ? "active" : ""}
						aria-label={`Page ${page + 1}`}
						aria-current={currentPage === page ? "page" : undefined}
						disabled={loading}
						onClick={() => onPageChange(page)}
					>
						{page + 1}
					</button>
				))}
				{visiblePages.at(-1)! < totalPages - 1 && (
					<span aria-hidden="true">…</span>
				)}

				<button
					type="button"
					aria-label="Next page"
					disabled={currentPage >= totalPages - 1 || loading}
					onClick={() => onPageChange(currentPage + 1)}
				>
					<ChevronRight size={17} />
				</button>
			</div>
		</nav>
	);
}
