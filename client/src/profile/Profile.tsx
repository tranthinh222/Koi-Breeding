// import { useEffect, useState, useRef } from 'react'
// import type { ChangeEvent } from 'react'
// import './Profile.css'

// type UserProfile = {
//   id: number
//   username: string
//   // fullName: string // Không có trong entity User, thêm sau
//   email: string
//   birthday?: string
//   gender?: string
//   avatarUrl?: string
//   exp?: number
//   isBanned?: boolean
//   role?: string
//   createdAt?: string // Tự động convert qua String
// }

// type UserListResponse = {
//   result?: UserProfile[]
// }

// type AvatarUploadResponse = {
//   avatarUrl: string
// }

// const DEFAULT_USERID = 1
// function Profile() {
//   const [profile, setProfile] = useState<UserProfile | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [editing, setEditing] = useState(false)
//   const [uploading, setUploading] = useState(false)
//   const [avatarVersion, setAvatarVersion] = useState(0)
//   const [formData, setFormData] = useState({
//     email: '',
//     birthday: '',
//     gender: '',
//   })

//   const fileInputRef = useRef<HTMLInputElement | null>(null)
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true)
//         setError('')

//         //Check fetch users (sẽ xóa sau khi test xong profile)
//         const usersResponse = await fetch('/api/v1/users?page=0&size=100')
//         if (!usersResponse.ok) {
//           throw new Error('Cannot fetch users list.')
//         }

//         //Chưa có login, mặc định lấy trường tham khảo là id = 1
//         const usersData: UserListResponse = await usersResponse.json()
//         const users = usersData.result ?? []
//         const matchedUser = users.find((user) => user.id === DEFAULT_USERID)

//         if (!matchedUser) {
//           throw new Error(`Cannot fetch username "${DEFAULT_USERID}"`)

//         }

//         const profileResponse = await fetch(`/api/v1/users/profile?id=${matchedUser.id}`)
//         if (!profileResponse.ok) {
//           throw new Error('Cannot fetch profile')
//         }

//         const profileData: UserProfile = await profileResponse.json()
//         setProfile(profileData)
//         setFormData({
//           email: profileData.email ?? '',
//           birthday: profileData.birthday ?? '',
//           gender: profileData.gender ?? '',
//         })
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Some errors occured while loading profile.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     void fetchProfile()
//   }, [])
//   const handleViewHome = () => {
//     window.location.href = `/`
//   }
//   const handleChange = (field: 'email' | 'birthday' | 'gender') =>
//     (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       setFormData((current) => ({
//         ...current,
//         [field]: event.target.value,
//       }))
//     }

//   const handleEditToggle = () => {
//     if (!editing && profile) {
//       setFormData({
//         email: profile.email ?? '',
//         birthday: profile.birthday ?? '',
//         gender: profile.gender ?? '',
//       })
//     }
//     setEditing((value) => !value)
//   }

//   const handleSave = async () => {
//     if (!profile) return

//     try {
//       setLoading(true)
//       setError('')

//       const response = await fetch(`/api/v1/users/profile?id=${profile.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           birthday: formData.birthday,
//           gender: formData.gender,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error('Cannot save profile')
//       }

//       const updatedProfile: UserProfile = await response.json()
//       setProfile(updatedProfile)
//       setEditing(false)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Cannot save profile.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUploadClick = () => {
//     if (uploading) return
//     fileInputRef.current?.click()
//   }

//   const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
//     if (!profile) return
//     const file = event.target.files?.[0]
//     if (!file) return

//     if (!['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'].includes(file.type)) {
//       setError('Only PNG, JPG, JPEG, SVG files are allowed.')
//       return
//     }

//     try {
//       setUploading(true)
//       setError('')

//       const form = new FormData()
//       form.append('file', file)

//       const uploadResponse = await fetch(`/api/v1/users/avatar?id=${profile.id}`, {
//         method: 'POST',
//         body: form,
//       })

//       if (!uploadResponse.ok) {
//         throw new Error('Cannot upload avatar')
//       }

//       const uploadData: AvatarUploadResponse = await uploadResponse.json()

//       setProfile((current) => (current ? { ...current, avatarUrl: uploadData.avatarUrl } : current))
//       setAvatarVersion((v) => v + 1)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Cannot upload avatar.')
//     } finally {
//       setUploading(false)
//       if (fileInputRef.current) fileInputRef.current.value = ''
//     }
//   }

//   const displayName = profile?.username ?? 'KoiMaster'
//   const avatarText = profile?.username ? profile.username.charAt(0).toUpperCase() : '🧑'
//   const avatarUrl = profile?.avatarUrl
//   const displayedAvatarUrl = avatarUrl
//     ? `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}v=${avatarVersion}`
//     : undefined

//   return (
//     <>
//       <div className="background">
//         <div className="grass" />
//         <div className="trees trees-left" />
//         <div className="trees trees-right" />
//       </div>

//       <header className="hud">
//         <div className="player">
//           <div className="avatar">
//             {displayedAvatarUrl ? <img src={displayedAvatarUrl} alt={displayName.charAt(0)} /> : avatarText}

//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/png,image/jpeg,image/jpg,image/svg+xml"
//             onChange={handleFileChange}
//             style={{ display: 'none' }}
//           />

//           <div>
//             <h3>{displayName}</h3>
//             <p>Level: {profile?.exp ? Math.max(1, Math.floor(profile.exp / 100)) : 18}</p>
//           </div>
//         </div>

//         <div className="wallet">
//           <div className="gold">🪙 {profile?.exp ?? 25800}</div>
//         </div>
//       </header>

//       <div className="page-menu">
//         <button onClick={handleViewHome}>🏠 Home</button>
//         <button>🏪 Marketplace</button>
//         <button>🛒 Shop</button>
//         <button>🎒 Inventory</button>
//         <button className="active">⚙ Settings</button>
//       </div>

//       <section className="title-section">
//         <div className="wood-sign">
//           <h1>PROFILE</h1>
//         </div>
//       </section>

//       <main className="profile-page">
//         <section className="profile-card">
//           <div className="profile-avatar" onClick={handleUploadClick} aria-busy={uploading}>
//             {displayedAvatarUrl ? <img src={displayedAvatarUrl} alt={displayName} /> : avatarText}
//           </div>
//           <h2>{displayName}</h2>
//           <p>Level {profile?.exp ? Math.max(1, Math.floor(profile.exp / 100)) : 18}</p>
//           <button onClick={editing ? handleSave : handleEditToggle} disabled={uploading}>
//             {uploading ? 'Uploading...' : editing ? 'Save Profile' : 'Edit Profile'}
//           </button>
//         </section>

//         <section className="profile-info">
//           {loading ? (
//             <div className="info-box loading-box">Loading user profile...</div>
//           ) : error ? (
//             <div className="info-box error-box">{error}</div>
//           ) : profile ? (
//             <>
//               <div className="info-box">
//                 <h3>Account</h3>
//                 <p>Username: {profile.username}</p>

//                 <p>
//                   <label>
//                     Email: {editing == false ? <span>{profile.email || 'Not updated.'}</span> : (
//                       <input
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange('email')}
//                       />
//                     )}
//                   </label>
//                 </p>

//                 <p>
//                   <label>
//                     Birthday: {editing == false ? <span>{formatISODate(profile.birthday) || 'Not updated.'}</span> : (
//                       <input
//                         type="date"
//                         value={formData.birthday ?? ''}
//                         onChange={handleChange('birthday')}
//                       />
//                     )}
//                   </label>
//                 </p>

//                 <p>
//                   <label>
//                     Gender: {editing == false ? (
//                       <span>
//                         {profile.gender
//                           ? profile.gender === 'MALE'
//                             ? 'Male'
//                             : 'Female'
//                           : 'Not updated.'}
//                       </span>
//                     ) : (
//                       <select value={formData.gender ?? ''} onChange={handleChange('gender')}>
//                         <option value="">Select gender</option>
//                         <option value="MALE">Male</option>
//                         <option value="FEMALE">Female</option>
//                       </select>
//                     )}
//                   </label>
//                 </p>

//                 <p>Joined at: {formatISODate(profile.createdAt)}</p>
//               </div>

//               <div className="info-box">
//                 <h3>Statistics</h3>
//                 <p>Total Fish: 32</p>
//                 <p>Marketplace Sales: 18</p>
//                 <p>Marketplace Purchases: 11</p>
//                 <p>Total Earnings: {profile.exp ?? 18560} Gold</p>
//               </div>

//               <div className="info-box">
//                 <h3>Achievements</h3>
//                 <p>🏆 First Sale</p>
//                 <p>🏆 Koi Collector</p>
//                 <p>🏆 Top Seller</p>
//               </div>
//             </>
//           ) : null}
//         </section>
//       </main>

//       <section className="favorite-fish">
//         <h2>Your Favorite Koi</h2>

//         <div className="fish-grid">
//           <div className="fish-card">
//             <div className="fish-image">🐟</div>
//             <h3>Kohaku</h3>
//             <p>Lv.18</p>
//           </div>

//           <div className="fish-card">
//             <div className="fish-image">🐟</div>
//             <h3>Showa</h3>
//             <p>Lv.20</p>
//           </div>

//           <div className="fish-card">
//             <div className="fish-image">🐟</div>
//             <h3>Sanke</h3>
//             <p>Lv.17</p>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// function formatISODate(dateInput?: string) {
//   if (!dateInput) return 'Not updated.'
//   const dateObj = new Date(dateInput)
//   if (isNaN(dateObj.getTime())) return 'Invalid date.'
//   return dateObj
//     .toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     })
//     .replace(/\//g, '-')
// }

// export default Profile
