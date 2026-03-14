import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, LogOut, Briefcase, Code } from 'lucide-react'
import { Link } from 'react-router-dom'

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    // Tabs: 'projects' or 'experiences'
    const [activeTab, setActiveTab] = useState('projects')

    const [projects, setProjects] = useState([])
    const [experiences, setExperiences] = useState([])
    const [loading, setLoading] = useState(false)

    // Form State
    const [isEditing, setIsEditing] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    // Dynamic Form Data (serves both Project & Experience depending on activeTab)
    const [formData, setFormData] = useState({
        title: '',
        company: '', // Used for experience
        date: '',    // Used for experience
        description: '',
        image: '',   // Used for projects
        tags: '',    // Used for both (tags/technologies)
        link: ''     // Used for both
    })

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (token) {
            setIsAuthenticated(true)
            fetchData()
        }
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        if (password.trim() === '') {
            setLoginError('Password required')
            return
        }
        localStorage.setItem('adminToken', password)
        setIsAuthenticated(true)
        setLoginError('')
        fetchData()
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        setIsAuthenticated(false)
        setProjects([])
        setExperiences([])
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const [resProj, resExp] = await Promise.all([
                fetch(`${API_URL}/projects`),
                fetch(`${API_URL}/experiences`)
            ])
            const dataProj = await resProj.json()
            const dataExp = await resExp.json()
            setProjects(Array.isArray(dataProj) ? dataProj : [])
            setExperiences(Array.isArray(dataExp) ? dataExp : [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const resetForm = () => {
        setFormData({ title: '', company: '', date: '', description: '', image: '', tags: '', link: '' })
        setIsEditing(false)
        setCurrentId(null)
    }

    // Switch tabs and reset form
    const handleTabSwitch = (tab) => {
        setActiveTab(tab)
        resetForm()
    }

    const handleEdit = (item) => {
        setIsEditing(true)
        setCurrentId(item._id || item.id)

        if (activeTab === 'projects') {
            setFormData({
                title: item.title,
                company: '', date: '',
                description: item.description,
                image: item.imageUrl || '',
                tags: item.technologies ? item.technologies.join(', ') : '',
                link: item.liveDemoUrl || ''
            })
        } else {
            setFormData({
                title: item.role || item.title || '',
                company: item.company || '',
                date: item.duration || item.date || '',
                description: item.description || '',
                image: '',
                tags: '',
                link: ''
            })
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return

        const token = localStorage.getItem('adminToken')
        const endpoint = activeTab === 'projects' ? 'projects' : 'experiences'

        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                fetchData()
            } else {
                alert('Failed to delete. Check password.')
                if (res.status === 401) handleLogout()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('adminToken')

        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        const endpoint = activeTab === 'projects' ? 'projects' : 'experiences'

        // Prepare payload depending on active tab
        let processedData = {}
        if (activeTab === 'projects') {
            processedData = {
                title: formData.title,
                description: formData.description,
                imageUrl: formData.image,
                liveDemoUrl: formData.link,
                technologies: tagsArray
            }
        } else {
            processedData = {
                role: formData.title,
                company: formData.company,
                duration: formData.date,
                description: formData.description
            }
        }

        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const url = isEditing
            ? `${API_URL}/${endpoint}/${currentId}`
            : `${API_URL}/${endpoint}`

        const method = isEditing ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(processedData)
            })

            if (res.ok) {
                resetForm()
                fetchData()
            } else {
                const errorData = await res.json()
                alert(errorData.error || 'Operation failed. Check password.')
                if (res.status === 401) handleLogout()
            }
        } catch (err) {
            console.error(err)
            alert('Network error')
        }
    }

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ width: '100%' }}>
                    <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Admin Access</h2>
                        <form onSubmit={handleLogin}>
                            <div className="input-group">
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Enter Admin Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {loginError && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{loginError}</p>}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: 'rgba(94, 234, 212, 0.1)' }}>Login</button>
                        </form>
                        <div style={{ marginTop: '2rem' }}>
                            <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>&larr; Back to Portfolio</Link>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // DASHBOARD RENDER
    return (
        <div style={{ paddingBottom: '4rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* Top Nav */}
            <nav className="glass-card" style={{
                position: 'sticky',
                top: '20px',
                width: '90%',
                maxWidth: '1280px',
                margin: '20px auto',
                zIndex: 100,
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '8px' }} title="Back to site">
                        <ArrowLeft size={18} />
                    </Link>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Admin Dashboard</div>
                </div>

                {/* Tab Controls */}
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '8px' }}>
                    <button
                        onClick={() => handleTabSwitch('projects')}
                        className={`btn ${activeTab === 'projects' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: activeTab === 'projects' ? 'rgba(94, 234, 212, 0.1)' : 'transparent' }}
                    >
                        <Code size={16} /> Projects
                    </button>
                    <button
                        onClick={() => handleTabSwitch('experiences')}
                        className={`btn ${activeTab === 'experiences' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: activeTab === 'experiences' ? 'rgba(94, 234, 212, 0.1)' : 'transparent' }}
                    >
                        <Briefcase size={16} /> Experiences
                    </button>
                </div>

                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <LogOut size={16} /> Logout
                </button>
            </nav>

            {/* Main Content Area */}
            <div className="container" style={{ marginTop: '2rem', flex: 1, maxWidth: '1280px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

                    {/* Form Pane (Left Side Sticky) */}
                    <div className="glass-card animate-fade-in delay-100" style={{ position: 'sticky', top: '120px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)' }}>
                            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
                            {isEditing ? 'Edit' : 'Add New'} {activeTab === 'projects' ? 'Project' : 'Experience'}
                        </h3>

                        <form onSubmit={handleSubmit}>

                            <div className="input-group">
                                <label className="input-label">{activeTab === 'projects' ? 'Project Title' : 'Job Title/Role'}</label>
                                <input required type="text" name="title" className="input-field" value={formData.title} onChange={handleInputChange} />
                            </div>

                            {activeTab === 'projects' && (
                                <div className="input-group">
                                    <label className="input-label">Image URL</label>
                                    <input required type="url" name="image" className="input-field" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
                                </div>
                            )}

                            {activeTab === 'experiences' && (
                                <>
                                    <div className="input-group">
                                        <label className="input-label">Company / Organization</label>
                                        <input required type="text" name="company" className="input-field" value={formData.company} onChange={handleInputChange} placeholder="e.g. Google" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Date Range</label>
                                        <input required type="text" name="date" className="input-field" value={formData.date} onChange={handleInputChange} placeholder="e.g. 2021 - Present" />
                                    </div>
                                </>
                            )}

                            <div className="input-group">
                                <label className="input-label">Link (Optional)</label>
                                <input type="url" name="link" className="input-field" value={formData.link} onChange={handleInputChange} placeholder="https://..." />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Tags / Technologies (comma separated)</label>
                                <input required type="text" name="tags" className="input-field" value={formData.tags} onChange={handleInputChange} placeholder="React, Node.js, ..." />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Description</label>
                                <textarea required name="description" className="input-field" value={formData.description} onChange={handleInputChange} style={{ minHeight: '120px' }}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.8rem', background: 'rgba(94, 234, 212, 0.1)', borderRadius: '6px' }}>
                                    {isEditing ? 'Update' : 'Save'} {activeTab === 'projects' ? 'Project' : 'Experience'}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={resetForm} className="btn btn-outline" style={{ borderRadius: '6px' }}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Pane (Right Side Scrollable) */}
                    <div className="glass-card animate-fade-in delay-200" style={{ background: 'rgba(0,0,0,0.2)', minHeight: '500px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Manage {activeTab === 'projects' ? 'Projects' : 'Experiences'}
                        </h3>

                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Loading data...</p>
                        ) : (activeTab === 'projects' && projects.length === 0) || (activeTab === 'experiences' && experiences.length === 0) ? (
                            <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>No items found. Add one on the left.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                {/* Render Projects */}
                                {activeTab === 'projects' && projects.map(project => (
                                    <div key={project._id || project.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem',
                                        background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px'
                                    }}>
                                        <img src={project.imageUrl || 'https://via.placeholder.com/80x60?text=No+Image'} alt={project.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{project.title}</h4>
                                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {project.technologies ? project.technologies.join(', ') : ''}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(project)} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(project._id || project.id)} className="btn btn-outline" style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Render Experiences */}
                                {activeTab === 'experiences' && experiences.map(exp => (
                                    <div key={exp._id || exp.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem',
                                        background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{exp.role || exp.title}</h4>
                                                    <h5 style={{ margin: '0.2rem 0', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{exp.company}</h5>
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', background: 'rgba(94, 234, 212, 0.1)', padding: '0.2rem 0.8rem', borderRadius: '999px' }}>
                                                    {exp.duration || exp.date}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                {exp.description}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                <strong style={{ color: 'var(--text-primary)' }}>Tech:</strong> {exp.technologies?.join(' • ')}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <button onClick={() => handleEdit(exp)} className="btn btn-outline" style={{ padding: '0.5rem' }} title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(exp._id || exp.id)} className="btn btn-outline" style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Admin
