import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, ArrowRight, ExternalLink } from 'lucide-react'

function Home() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [formStatus, setFormStatus] = useState('idle')
    const [projects, setProjects] = useState([])
    const [experiences, setExperiences] = useState([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [loadingExp, setLoadingExp] = useState(true)

    // Custom states for the specific Brittany Chiang reference style
    const [activeSection, setActiveSection] = useState('about')
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const API_URL = import.meta.env.VITE_API_URL || '/api';

    // Data fetching
    useEffect(() => {
        fetch(`${API_URL}/projects`)
            .then(res => res.json())
            .then(data => {
                setProjects(data)
                setLoadingProjects(false)
            })
            .catch(err => {
                console.error('Failed to fetch projects:', err)
                setLoadingProjects(false)
            })

        fetch(`${API_URL}/experiences`)
            .then(res => res.json())
            .then(data => {
                setExperiences(data)
                setLoadingExp(false)
            })
            .catch(err => {
                console.error('Failed to fetch experiences:', err)
                setLoadingExp(false)
            })
    }, [])

    // Mouse move effect for the radial background glow
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Create a smooth glowing effect centered at cursor, transitioning to transparent
            const background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(29, 78, 216, 0.15), transparent 80%)`
            document.documentElement.style.background = background
            // Because root background might overwrite, we apply to a fixed div or the body directly.
            // Easiest is to target a dedicated fixed background div.
            setMousePos({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Intersection Observer for the ScrollSpy Navigation
    useEffect(() => {
        const sections = document.querySelectorAll('section[id]')

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is exactly in middle of screen
            threshold: 0
        }

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)
        sections.forEach(sec => observer.observe(sec))

        return () => observer.disconnect()
    }, [])


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        setFormStatus('submitting')

        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setFormStatus('success')
                setFormData({ name: '', email: '', message: '' })
                setTimeout(() => setFormStatus('idle'), 3000)
            } else {
                setFormStatus('error')
            }
        } catch (error) {
            console.error(error)
            setFormStatus('error')
        }
    }

    return (
        <>
            <div
                className="glow-background"
                style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--glow-color), transparent 80%)` }}
            />

            <div className="page-container">

                {/* Left Side: Fixed Header/Hero */}
                <header className="header-hero">
                    <div>
                        <h1 className="hero-name animate-fade-in"><span className="text-gradient">Akbar Pangestu</span></h1>
                        <h2 className="hero-role animate-fade-in delay-100">Junior Fullstack Engineer</h2>
                        <p className="hero-brief animate-fade-in delay-200">
                            Crafting polished user interfaces and robust architectures. I bridge the gap between complex backend logic and intuitive frontend design.
                        </p>

                        <nav className="sidebar-nav animate-fade-in delay-300">
                            <ul>
                                <li>
                                    <a href="#about" className={`nav-item ${activeSection === 'about' ? 'active' : ''}`}>
                                        <span className="nav-indicator"></span> About
                                    </a>
                                </li>
                                <li>
                                    <a href="#experience" className={`nav-item ${activeSection === 'experience' ? 'active' : ''}`}>
                                        <span className="nav-indicator"></span> Experience
                                    </a>
                                </li>
                                <li>
                                    <a href="#projects" className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}>
                                        <span className="nav-indicator"></span> Projects
                                    </a>
                                </li>
                                <li>
                                    <a href="#contact" className={`nav-item ${activeSection === 'contact' ? 'active' : ''}`}>
                                        <span className="nav-indicator"></span> Contact
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div className="social-icons animate-fade-in delay-300">
                        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={24} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={24} /></a>
                        <a href="mailto:hello@example.com" aria-label="Email"><Mail size={24} /></a>
                    </div>
                </header>


                {/* Right Side: Scrollable Main Content */}
                <main className="main-content">

                    {/* About Section */}
                    <section id="about" className="section-content animate-fade-in delay-200">
                        <h3 className="input-label" style={{ display: 'none' /* hidden on desktop per reference */ }}>About</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            I’m a Fullstack Engineer with a passion for building seamless, pixel-perfect digital experiences. I thrive at the intersection of robust backend logic and intuitive frontend design—where the power of Laravel meets the flexibility of React and Tailwind CSS.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Currently, I am balancing my undergraduate studies (S1) with a deep dive into full-stack development. As a Junior Engineer, my mission is to build applications that are not just functional, but truly accessible and user-friendly. I believe that growth comes from consistent practice, which is why I meticulously document my journey and code through my GitHub portfolio.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Through every project—from building Library Management Systems with PHP/MySQL to crafting modern, API-driven interfaces—I’ve realized that great engineering is about more than just code. It’s about creating an experience that is intuitive, engaging, and effortless for the user. This "craftsman" approach ensures that every product I build is robust under the hood and polished on the surface.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Outside of the code editor, I’m an active member of my Information Technology Systems student union. I also find balance through physical activity and creativity—whether I'm on the court playing volleyball or badminton, practicing Silat, or capturing moments through graphic design and photography at various events.
                        </p>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="section-content">
                        <h3 className="input-label" style={{ display: 'none' }}>Experience</h3>

                        {loadingExp ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <span className="text-gradient">Loading data...</span>
                            </div>
                        ) : experiences.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)' }}>No experience available.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {experiences.map((exp, idx) => (
                                    <a href={exp.link || undefined} target={exp.link ? "_blank" : undefined} rel={exp.link ? "noreferrer" : undefined} key={exp.id} className={`glass-card animate-fade-in delay-${Math.min((idx + 1) * 100, 300)}`} style={{ textDecoration: 'none', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', cursor: exp.link ? 'pointer' : 'default' }} onClick={(e) => { if (!exp.link) e.preventDefault() }}>
                                        <div style={{ flexShrink: 0, width: '120px', paddingTop: '0.2rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {exp.date}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                                {exp.title} · {exp.company} {exp.link ? <ExternalLink size={14} style={{ opacity: 0.5 }} /> : null}
                                            </h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                                {exp.description}
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {exp.technologies?.map(tech => (
                                                    <span key={tech} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(94, 234, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px' }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="section-content">
                        <h3 className="input-label" style={{ display: 'none' }}>Projects</h3>

                        {loadingProjects ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <span className="text-gradient">Loading data...</span>
                            </div>
                        ) : projects.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)' }}>No projects available.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {projects.map((project, idx) => (
                                    <a href={project.link || undefined} target={project.link ? "_blank" : undefined} rel={project.link ? "noreferrer" : undefined} key={project.id} className={`glass-card animate-fade-in delay-${Math.min((idx + 1) * 100, 300)}`} style={{ textDecoration: 'none', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', cursor: project.link ? 'pointer' : 'default' }} onClick={(e) => { if (!project.link) e.preventDefault() }}>
                                        <div style={{ flexShrink: 0, width: '120px' }}>
                                            <img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: '4px', objectFit: 'cover', height: '80px', border: '2px solid rgba(255,255,255,0.05)' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                                {project.title} {project.link ? <ExternalLink size={14} style={{ opacity: 0.5 }} /> : null}
                                            </h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                                                {project.description}
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {project.tags.map(tag => (
                                                    <span key={tag} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(94, 234, 212, 0.1)', color: 'var(--accent-color)', borderRadius: '999px' }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="section-content">
                        <h3 className="input-label" style={{ display: 'none' }}>Contact</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Have a question or want to work together? Leave your details and I'll get back to you as soon as possible.
                        </p>

                        <form onSubmit={handleContactSubmit} className="glass-card" style={{ padding: '2rem' }}>
                            <div className="input-group">
                                <label className="input-label" htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" className="input-field" required value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" className="input-field" required value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="message">Message</label>
                                <textarea id="message" name="message" className="input-field" required value={formData.message} onChange={handleInputChange}></textarea>
                            </div>

                            <button type="submit" className="btn btn-outline" style={{ marginTop: '1rem' }} disabled={formStatus === 'submitting'}>
                                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'} <ArrowRight size={16} />
                            </button>

                            {formStatus === 'success' && (
                                <p style={{ marginTop: '1rem', color: '#10b981', fontSize: '0.9rem' }}>Message sent successfully!</p>
                            )}
                        </form>
                    </section>

                    <footer style={{ marginTop: '4rem', paddingBottom: '4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <p>Built with React & Vite. Hosted loosely. Inspired by <a href="https://brittanychiang.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)' }}>Brittany Chiang</a>.</p>
                    </footer>

                </main>
            </div>
        </>
    )
}

export default Home
