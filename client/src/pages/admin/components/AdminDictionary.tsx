import { Edit, Filter, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  callCreateKoiVarient,
  callFetchKoiVarient,
  callUpdateKoiVarient,
  callUploadKoiVarientImage,
} from '../../../api/koiDictionary'
import { callFetchAllVarieties } from '../../../api/variety'
import KoiForm from '../../../components/admin/KoiForm/KoiForm'
import { toast } from '../../../components/shared/Toast/toast'
import type { IKoiVarient, IVariety } from '../../../types/backend'
import AdminPagination from './AdminPagination'

export default function AdminDictionary() {
  const [items, setItems] = useState<IKoiVarient[]>([])
  const [varietyList, setVarietyList] = useState<IVariety[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  // --- STATE BỘ LỌC ---
  const [search, setSearch] = useState('')
  const [varietyFilter, setVarietyFilter] = useState('ALL')
  const [scaleTypeFilter, setScaleTypeFilter] = useState('ALL')
  const [shapeFilter, setShapeFilter] = useState('ALL')

  // --- STATE MODAL ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<IKoiVarient | null>(null)

  // Load danh sách Variety cho bộ lọc và Form
  useEffect(() => {
    const loadVarieties = async () => {
      try {
        const response = await callFetchAllVarieties(`page=0&size=50`)
        const list: IVariety[] = response.data.data?.result ?? []
        setVarietyList(list.sort((a, b) => (a.id as number) - (b.id as number)))
      } catch (error) {
        console.error('Failed to fetch varieties: ', error)
      }
    }
    loadVarieties()
  }, [])

  // Fetch dữ liệu Dictionary
  const fetchDictionary = async () => {
    try {
      setLoading(true)

      // Xây dựng query string kết hợp bộ lọc (Tùy thuộc backend của bạn có hỗ trợ param hay không)
      let query = `page=${currentPage}&size=8`
      if (search) query += `&search=${search}`
      if (varietyFilter !== 'ALL') query += `&varietyId=${varietyFilter}`
      if (scaleTypeFilter !== 'ALL') query += `&scaleType=${scaleTypeFilter}`
      if (shapeFilter !== 'ALL') query += `&shape=${shapeFilter}`

      const response = await callFetchKoiVarient(query)
      const data = response.data.data

      if (data) {
        setItems(data.result)
        setTotalPages(data.meta.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch dictionary items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDictionary()
  }, [currentPage, search, varietyFilter, scaleTypeFilter, shapeFilter])

  const handleReset = () => {
    setSearch('')
    setVarietyFilter('ALL')
    setScaleTypeFilter('ALL')
    setShapeFilter('ALL')
    setCurrentPage(0)
  }

  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value)
    setCurrentPage(0)
  }

  const handleDelete = async (_id: number) => {
    const confirmed = window.confirm(
      'Delete this koi entry? This action cannot be undone.',
    )
    if (!confirmed) return

    try {
      // await callDeleteKoiVarient(id); // Gọi API Delete
      alert('Entry removed locally. The delete API is not connected yet.')
      await fetchDictionary()
    } catch (error) {
      alert('Unable to delete the dictionary entry.')
    }
  }

  const handleSaveSuccess = async (
    requestKoi: IKoiVarient,
    image: File | null,
    mode: 'create' | 'edit',
  ) => {
    if (image) {
      const imageResponse = await callUploadKoiVarientImage(image)
      if (imageResponse && imageResponse.data) {
        requestKoi.imageUrl = imageResponse.data.data?.url as string
      } else {
        toast.error("Failed to upload koi varient's image!")
      }
    }

    try {
      if ('create' === mode) {
        const response = await callCreateKoiVarient(requestKoi)
        const koiVarient: IKoiVarient | undefined = response.data.data
        if (koiVarient) {
          toast.success('Create new koi successfully!')
        } else {
          toast.error('Failed to create new koi varient!')
        }
      } else if ('edit' === mode && selectedItem) {
        const response = await callUpdateKoiVarient(selectedItem)
        const koiVarient: IKoiVarient | undefined = response.data.data
        if (koiVarient) {
          toast.success('Update koi successfully!')
        } else {
          toast.error('Failed to create new koi varient!')
        }
      }
    } catch (error) {
      toast.error('Failed to create new koi varient!')
    }
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedItem(null)
    setCurrentPage(0)
    await fetchDictionary()
  }

  return (
    <div className="items-view">
      {/* FILTER CARD */}
      <div className="items-filter-card">
        <div className="items-filter-row">
          <div className="items-search">
            <Filter size={18} />
            <input
              type="text"
              placeholder="Search by Koi name..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            />
          </div>

          <div className="items-filter-actions">
            {/* VARIETY FILTER */}
            <select
              value={varietyFilter}
              onChange={(e) =>
                handleFilterChange(setVarietyFilter, e.target.value)
              }
            >
              <option value="ALL">All varieties</option>
              {varietyList.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* SCALE TYPE FILTER */}
            <select
              value={scaleTypeFilter}
              onChange={(e) =>
                handleFilterChange(setScaleTypeFilter, e.target.value)
              }
            >
              <option value="ALL">All scale types</option>
              <option value="WAGOI">Wagoi</option>
              <option value="DOITSU">Doitsu</option>
              <option value="GINRIN">Ginrin</option>
            </select>

            <button
              type="button"
              className="items-reset-button"
              onClick={handleReset}
              title="Reset filters"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* CATEGORY (Dùng cho SHAPE) */}
        <div className="items-category-list">
          {[
            { id: 'ALL', label: 'All shapes' },
            { id: 'STANDARD', label: 'Standard' },
            { id: 'BUTTERFLY', label: 'Butterfly' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`items-category-button ${shapeFilter === cat.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(setShapeFilter, cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="items-page-header">
        <div className="items-page-heading-copy">
          <h2>Koi dictionary</h2>
          <p>Manage koi varieties, classifications, and base values.</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          Add koi entry
        </button>
      </div>

      {/* TABLE */}
      <div className="items-table-card">
        <div className="items-table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Koi details</th>
                <th>Classification</th>
                <th>Base Stats</th>
                <th>Pricing (Koins)</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="items-empty">
                    Loading koi entries...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((koi) => (
                  <tr key={koi.id}>
                    {/* IMAGE */}
                    <td>
                      <div className="item-image koi-dictionary-thumbnail">
                        {koi.imageUrl ? (
                          <img src={koi.imageUrl} alt={koi.name} />
                        ) : (
                          <span>No image</span>
                        )}
                      </div>
                    </td>

                    {/* KOI INFO */}
                    <td>
                      <div className="item-name">
                        <strong>{koi.name}</strong>
                        <span>Origin: {koi.origin}</span>
                      </div>
                    </td>

                    {/* CLASSIFICATION */}
                    <td>
                      <div className="dict-badges">
                        <span
                          className="dict-badge badge-variety"
                          title="Variety"
                        >
                          {koi.variety?.name}
                        </span>
                        <span className="dict-badge badge-shape" title="Shape">
                          {koi.shape}
                        </span>
                        <span
                          className="dict-badge badge-scale"
                          title="Scale Type"
                        >
                          {koi.scaleType}
                        </span>
                      </div>
                    </td>

                    {/* BASE STATS */}
                    <td>
                      <div className="dict-stats">
                        <span>
                          Max Len: <strong>{koi.baseMaxLength}cm</strong>
                        </span>
                        <span>
                          Growth: <strong>{koi.baseGrowthRate}</strong>
                        </span>
                        <span>
                          Mid Age: <strong>{koi.midAge}d</strong>
                        </span>
                      </div>
                    </td>

                    {/* PRICING */}
                    <td>
                      <div className="dict-stats">
                        <span>
                          Base: <strong>{koi.basePrice}</strong>{' '}
                          <span
                            style={{
                              color: '#d0d236',
                            }}
                          >
                            🪙
                          </span>
                        </span>
                        <span>
                          Alpha: <strong>x{koi.alphaPrice}</strong>
                        </span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="item-actions">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => {
                            setSelectedItem(koi)
                            setIsEditModalOpen(true)
                          }}
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          type="button"
                          className="delete"
                          title="Delete"
                          onClick={() => handleDelete(koi.id as number)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="items-empty">
                    No Koi found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setCurrentPage}
      />

      {/* MODALS - Reusing your KoiForm */}
      {isAddModalOpen && (
        <div className="dict-modal-wrapper">
          <KoiForm
            koi={null}
            varietyList={varietyList}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleSaveSuccess}
          />
        </div>
      )}

      {isEditModalOpen && selectedItem && (
        <div className="dict-modal-wrapper">
          <KoiForm
            koi={selectedItem}
            varietyList={varietyList}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedItem(null)
            }}
            onSubmit={handleSaveSuccess}
          />
        </div>
      )}
    </div>
  )
}
