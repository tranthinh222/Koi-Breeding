import { useEffect, useMemo, useRef, useState } from 'react'
import { CURRENT_USER_ID } from '../../api/currentUser'
import { getTransactions, type Transaction } from '../../api/transaction'

type TransactionFilter = 'ALL' | 'BOUGHT' | 'SOLD'
type TransactionSort = 'NEWEST' | 'OLDEST'
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]
const FILTER_OPTIONS: { value: TransactionFilter; label: string }[] = [
  { value: 'ALL', label: 'All Transactions' },
  { value: 'BOUGHT', label: 'Bought' },
  { value: 'SOLD', label: 'Sold' },
]
const SORT_OPTIONS: { value: TransactionSort; label: string }[] = [
  { value: 'NEWEST', label: 'Newest' },
  { value: 'OLDEST', label: 'Oldest' },
]

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<TransactionFilter>('ALL')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sort, setSort] = useState<TransactionSort>('NEWEST')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageSizeDropdownRef = useRef<HTMLDivElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeDropdown = (event: MouseEvent) => {
      if (!pageSizeDropdownRef.current?.contains(event.target as Node)) {
        setIsPageSizeOpen(false)
      }
      if (!filterDropdownRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
      if (!sortDropdownRef.current?.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPageSizeOpen(false)
        setIsFilterOpen(false)
        setIsSortOpen(false)
      }
    }

    document.addEventListener('mousedown', closeDropdown)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeDropdown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTransactions(CURRENT_USER_ID, page, pageSize, sort === 'NEWEST' ? 'desc' : 'asc')
      .then((response) => {
        setTransactions(response.result)
        setTotalPages(response.meta.totalPages)
        setTotalElements(response.meta.totalElements)
      })
      .catch((requestError) => {
        console.error('Failed to load transactions:', requestError)
        setError('Unable to load transaction history.')
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, sort])

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      if (filter === 'BOUGHT') return transaction.transactionType.startsWith('BUY_')
      if (filter === 'SOLD') {
        return (
          transaction.transactionType === 'DEPOSIT' ||
          transaction.transactionType === 'SELL_FISH'
        )
      }
      return true
    })

    return filtered
  }, [filter, transactions])

  return (
    <div className="transaction-history-page">
      <section className="title-section">
        <div className="wood-sign"><h1>TRANSACTION HISTORY</h1></div>
      </section>

      <section className="market-tabs history-tabs">
        <button className="tab">🛒 Buy</button>
        <button className="tab">💰 Sell</button>
        <button className="tab">📋 My Listings</button>
        <button className="tab active">📜 History</button>
      </section>

      <section className="search-panel">
        <div className="history-filter-dropdown" ref={filterDropdownRef}>
          <button
            type="button"
            className="history-filter-trigger"
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((current) => !current)}
          >
            {FILTER_OPTIONS.find((option) => option.value === filter)?.label}
            <span className="history-filter-arrow" aria-hidden="true">⌄</span>
          </button>
          {isFilterOpen && (
            <div className="history-filter-menu" role="listbox" aria-label="Filter transactions">
              {FILTER_OPTIONS.map((option) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={filter === option.value}
                  className={filter === option.value ? 'selected' : ''}
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value)
                    setPage(1)
                    setIsFilterOpen(false)
                  }}
                >
                  <span>{option.label}</span>
                  {filter === option.value && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="history-filter-dropdown history-sort-dropdown" ref={sortDropdownRef}>
          <button
            type="button"
            className="history-filter-trigger"
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            onClick={() => setIsSortOpen((current) => !current)}
          >
            {SORT_OPTIONS.find((option) => option.value === sort)?.label}
            <span className="history-filter-arrow" aria-hidden="true">⌄</span>
          </button>
          {isSortOpen && (
            <div className="history-filter-menu" role="listbox" aria-label="Sort transactions">
              {SORT_OPTIONS.map((option) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={sort === option.value}
                  className={sort === option.value ? 'selected' : ''}
                  key={option.value}
                  onClick={() => {
                    setSort(option.value)
                    setPage(1)
                    setIsSortOpen(false)
                  }}
                >
                  <span>{option.label}</span>
                  {sort === option.value && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="history-container">
        {loading && <p className="history-message">Loading transactions...</p>}
        {error && <p className="history-message">{error}</p>}
        {!loading && !error && filteredTransactions.length === 0 && <p className="history-message">No transactions yet.</p>}
        {filteredTransactions.map((transaction) => {
          const isDeposit = transaction.transactionType === 'DEPOSIT'
          return (
            <article className="history-card" key={transaction.id}>
              <div className={`history-icon ${isDeposit ? 'sell' : 'buy'}`}>{isDeposit ? '💰' : '🛒'}</div>
              <div className="history-info">
                <h3>{transaction.itemName}</h3>
                <p>{transaction.description}</p>
                <p>{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div className={`history-price ${isDeposit ? 'income' : ''}`}>
                {isDeposit ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} Koins
              </div>
            </article>
          )
        })}
        {!loading && !error && totalElements > 0 && (
          <div className="history-pagination">
            <div className="history-page-size">
              <span id="page-size-label">Items per page</span>
              <div className="history-page-size-dropdown" ref={pageSizeDropdownRef}>
                <button
                  type="button"
                  className="history-page-size-trigger"
                  aria-labelledby="page-size-label"
                  aria-haspopup="listbox"
                  aria-expanded={isPageSizeOpen}
                  onClick={() => setIsPageSizeOpen((current) => !current)}
                >
                  {pageSize}
                  <span className="history-page-size-arrow" aria-hidden="true">⌄</span>
                </button>
                {isPageSizeOpen && (
                  <div className="history-page-size-menu" role="listbox" aria-labelledby="page-size-label">
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={pageSize === option}
                        className={pageSize === option ? 'selected' : ''}
                        key={option}
                        onClick={() => {
                          setPageSize(option)
                          setPage(1)
                          setIsPageSizeOpen(false)
                        }}
                      >
                        <span>{option}</span>
                        {pageSize === option && <span aria-hidden="true">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="history-pagination-total">{totalElements} transactions</span>
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span className="history-pagination-status">
              Page <strong>{page}</strong> of {Math.max(totalPages, 1)}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
