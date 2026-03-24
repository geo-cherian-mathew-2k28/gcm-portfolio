'use client';
import { useState, useEffect } from 'react';
import { supabase, fetchPortfolioData } from '../utils/supabase';
import { AppCore } from '../components/AppCore';
const {
    Mail, Smartphone, Calendar, MapPin, Github, Linkedin, Instagram,
    ExternalLink, Download, BookOpen, Briefcase, Send, ChevronDown, X,
    Layout, Cpu, Globe, Server, Zap, Shield, Heart, Code, AlertTriangle
} = AppCore;
import { Toaster, toast } from 'react-hot-toast';

const HIGHLIGHTS = [
    {
        title: "Innovation-Driven",
        text: "Passionate about creating impactful solutions that address real-world problems. Expertise in merging AI and hardware for unique innovations.",
        image: "/assets/images/highlights/avatar-1.png",
        modalTitle: "Innovation-Driven Mindset",
        modalDate: "November 25, 2024",
        modalText: "I believe in using technology to solve real problems. Every project is designed with impact in mind—whether it's helping farmers increase yield, ensuring road safety, or automating critical institutional processes."
    },
    {
        title: "Technical Excellence",
        text: "Strong proficiency in Python, Java, Arduino, and modern APIs. Experienced with embedded systems, IoT integration, and AI APIs.",
        image: "/assets/images/highlights/avatar-2.png",
        modalTitle: "Technical Excellence",
        modalDate: "November 25, 2024",
        modalText: "Strong proficiency in Python, Java, Arduino, and modern APIs. Experienced with embedded systems, IoT integration, AI APIs (Gemini), face recognition systems, and full-stack web development."
    },
    {
        title: "Problem Solver",
        text: "Skilled at breaking down complex systems into elegant solutions. Focus on scalability and user impact through algorithmic problem-solving.",
        image: "/assets/images/highlights/avatar-3.png",
        modalTitle: "Problem Solver",
        modalDate: "November 25, 2024",
        modalText: "Skilled at breaking down complex systems into elegant solutions. Strong background in algorithm development, data structures, and system-level problem-solving."
    },
    {
        title: "Social Impact",
        text: "Projects focus on supporting farmers, enhancing road safety, and protecting vulnerable populations through technology and innovation.",
        image: "/assets/images/highlights/avatar-4.png",
        modalTitle: "Social Impact",
        modalDate: "November 25, 2024",
        modalText: "Driven to create solutions with real-world impact. Projects focus on supporting farmers, enhancing road safety, automating education, and protecting vulnerable populations."
    }
];

export default function Home() {
    const [activeTab, setActiveTab] = useState('About');
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [isAvatarFlipped, setIsAvatarFlipped] = useState(false);
    const [data, setData] = useState({
        profile: null, projects: [], experience: [], education: [], skills: [], certificates: [], gallery: []
    });
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [activeHighlight, setActiveHighlight] = useState(null);

    // Filtration States
    const [projectFilter, setProjectFilter] = useState('all');
    const [certificateFilter, setCertificateFilter] = useState('all');
    const [isProjectSelectActive, setIsProjectSelectActive] = useState(false);
    const [isCertSelectActive, setIsCertSelectActive] = useState(false);

    const PROJECT_CATEGORIES = ['all', 'AI & Software', 'IoT & Hardware', 'Social Impact'];
    const CERTIFICATE_CATEGORIES = ['all', 'Course Certificates', 'Achievement Certificates', 'Participation', 'Volunteers', 'Others'];

    // Custom Cursor State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cursorHover, setCursorHover] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await fetchPortfolioData();

                // Apply fallback profile if none exists
                const profile = result.profile || {
                    name: 'Geo Cherian Mathew',
                    role: 'AI & IoT Developer | CSE Student',
                    bio: "I'm a passionate Computer Science and Engineering student from India, specializing in AI, hardware-software integration, and IoT solutions. I excel at transforming complex real-world challenges into innovative, scalable prototypes that deliver measurable impact.\n\nMy expertise spans embedded systems, artificial intelligence, and full-stack development. I'm driven by the mission to build impactful solutions for agriculture, safety, healthcare, and education.",
                    location: 'Kerala, India',
                    email: 'geomathewprojects28@gmail.com'
                };

                setData({ ...result, profile });

                // Check if everything came back empty (possible connectivity issue)
                const allEmpty = !result.profile && result.projects.length === 0 && result.skills.length === 0;
                if (allEmpty) {
                    setFetchError(true);
                }
            } catch (err) {
                console.error('Portfolio load failed:', err);
                setFetchError(true);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Analytics Tracker
    useEffect(() => {
        const trackVisit = async () => {
            try {
                await supabase.from('analytics').insert({
                    type: 'page_view',
                    details: { page: 'portfolio', referrer: document.referrer, user_agent: navigator.userAgent }
                });
            } catch (err) {
                // Analytics should never block UX
            }
        };
        trackVisit();
    }, []);

    const trackProjectClick = (project, type) => {
        supabase.from('analytics').insert({
            type: 'project_view',
            details: { title: project.title, link: type }
        }).then(() => { });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const { error } = await supabase.from('messages').insert([{
                sender_name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            }]);
            if (error) throw error;
            toast.success('Message sent! I will get back to you soon.');
            e.target.reset();
        } catch (err) {
            toast.error('Failed to send message. Please try again.');
        }
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'winner': return { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' };
            case 'organiser': return { bg: 'rgba(99, 102, 241, 0.2)', text: '#6366f1' };
            case 'volunteer': return { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' };
            case 'participant': return { bg: 'rgba(168, 85, 247, 0.2)', text: '#a855f7' };
            case 'self project': return { bg: 'rgba(20, 184, 166, 0.2)', text: '#14b8a6' };
            case 'group project': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
            case 'achievement': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' }; 
            case 'course': return { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1' };
            default: return { bg: 'rgba(255, 255, 255, 0.08)', text: '#94a3b8' };
        }
    };

    if (loading) return (
        <main className="skeleton-page">
            {/* Sidebar skeleton */}
            <aside className="sidebar">
                <div className="sidebar-info">
                    <figure className="avatar-box">
                        <div className="skeleton skeleton-round" style={{ width: 80, height: 80 }} />
                    </figure>
                    <div className="info-content">
                        <div className="skeleton" style={{ width: 140, height: 16, marginBottom: 10 }} />
                        <div className="skeleton" style={{ width: 90, height: 11, borderRadius: 8 }} />
                    </div>
                </div>
            </aside>

            {/* Main content skeleton */}
            <div className="main-content">
                <nav className="navbar">
                    <ul className="navbar-list">
                        {['About', 'Resume', 'Projects', 'Certificates', 'Gallery', 'Contact'].map(t => (
                            <li key={t} className="navbar-item">
                                <button className="navbar-link">{t}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <article className="about active" style={{ padding: 20 }}>
                    <div className="skeleton" style={{ width: 180, height: 24, marginBottom: 20 }} />
                    {[100, 85, 92, 70].map((w, i) => (
                        <div key={i} className="skeleton" style={{ width: `${w}%`, height: 13, marginBottom: 10 }} />
                    ))}
                    <div style={{ marginTop: 30 }}>
                        <div className="skeleton" style={{ width: 150, height: 18, marginBottom: 20 }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );

    const projectCategories = ['all', ...new Set(data.projects.map(p => p.category?.toLowerCase()).filter(Boolean))];
    const filteredProjects = projectFilter === 'all'
        ? data.projects
        : data.projects.filter(p => (p.category || '').toLowerCase().trim() === projectFilter);

    const filteredCertificates = certificateFilter === 'all'
        ? data.certificates
        : data.certificates.filter(c => (c.category || '').toLowerCase().trim() === certificateFilter);

    const renderMilestoneCard = (item, type = 'gallery') => {
        const isGallery = type === 'gallery';
        const isProject = type === 'project' || type === 'projects';
        const isCertificate = type === 'certificate' || type === 'certificates';

        // Unified metadata mapping
        const title = item.title || item.name || (isGallery ? 'Untitled Milestone' : 'Achievement');
        const year = item.year || item.date || item.issued_at || (item.created_at ? new Date(item.created_at).getFullYear() : '');
        const organization = item.organization || item.issuer || item.institution || '';
        
        // Dynamic Role logic based on USER request:
        // Certificates show CATEGORY in role slot. Projects show ROLE (Project Type).
        const role = isCertificate ? item.category : (item.role || (isProject ? 'Self Project' : ''));
        const roleStyles = getRoleColor(role);
        
        const category = isCertificate ? '' : item.category; // Category is already in role slot for certs
        const description = item.description || item.caption || '';
        const image = item.image_url || item.thumbnail_url || (isProject ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400' : 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=400');
        const contributors = item.contributors || '';

        return (
            <li key={item.id} className="project-item active" style={{ height: 'auto', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--eerie-black-1)', border: '1px solid var(--jet)', borderRadius: '16px', paddingBottom: '15px' }}>
                    <figure className="project-img" style={{ cursor: 'pointer', margin: 0, borderRadius: '16px 16px 0 0' }} onClick={() => image && setLightboxImage(image)}>
                        <div className="project-icons">
                            {isProject && item.github_link && <a href={item.github_link} target="_blank" className="project-icon-link" onClick={(e) => { e.stopPropagation(); trackProjectClick(item, 'github'); }}><Github size={18} /></a>}
                            {isProject && item.live_link && <a href={item.live_link} target="_blank" className="project-icon-link" onClick={(e) => { e.stopPropagation(); trackProjectClick(item, 'live'); }}><ExternalLink size={18} /></a>}
                            {!isProject && <ExternalLink size={20} />}
                        </div>
                        <img
                            src={image}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="img-lazy"
                            style={{ aspectRatio: '16/10', objectFit: 'cover' }}
                            onLoad={(e) => e.currentTarget.classList.add('loaded')}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </figure>

                    <div style={{ padding: '15px 15px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                            <h3 className="project-title" style={{ margin: 0, fontSize: '15px', color: 'var(--white-2)', lineHeight: '1.4' }}>{title}</h3>
                            {year && <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--orange-yellow-crayola)', opacity: 0.8 }}>{year}</span>}
                        </div>

                        {organization && (
                            <p style={{ color: 'var(--light-gray-70)', fontSize: '13px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Briefcase size={12} /> {organization}
                            </p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                background: role ? roleStyles.bg : 'transparent',
                                color: role ? roleStyles.text : 'transparent',
                                padding: role ? '3px 10px' : '0', // Slightly increased padding for premium feel
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.6px'
                            }}>
                                {role}
                            </div>
                            {category && <span style={{ fontSize: '10px', color: 'var(--light-gray-70)', opacity: 0.5 }}>{category}</span>}
                        </div>

                        {isProject && contributors && (
                            <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--orange-yellow-crayola)', opacity: 0.7, marginBottom: '6px', fontWeight: 800, letterSpacing: '1px' }}>Stakeholders & Contributors</div>
                                <p style={{ fontSize: '13px', color: 'var(--light-gray-70)', fontStyle: 'italic', fontWeight: 500 }}>{contributors}</p>
                            </div>
                        )}

                        {description && (
                            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--light-gray-70)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </li>
        );
    };

    return (
        <main>
            <Toaster position="bottom-right" />

            {/* Connection warning banner */}
            {fetchError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    color: '#fff', padding: '10px 20px', textAlign: 'center',
                    fontSize: '13px', fontWeight: 500, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
                }}>
                    <AlertTriangle size={16} />
                    Some data may not have loaded. The page is showing cached or default content.
                </div>
            )}

            {/* SIDEBAR */}
            <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`} data-sidebar>
                <div className="sidebar-info">
                    <figure className="avatar-box" onClick={() => setIsAvatarFlipped(!isAvatarFlipped)} style={{ cursor: 'pointer' }}>
                        <img
                            src={isAvatarFlipped ? "/assets/images/highlights/avatar-2.png" : (data.profile?.avatar_url || "/assets/images/geo6.jpg")}
                            alt={data.profile?.name || 'Profile'}
                            width="80"
                            height="80"
                            fetchPriority="high"
                            decoding="async"
                            onError={(e) => { e.currentTarget.src = '/assets/images/geo6.jpg'; }}
                        />
                    </figure>

                    <div className="info-content">
                        <h1 className="name" title={data.profile?.name}>{data.profile?.name}</h1>
                        <p className="title">{data.profile?.role}</p>
                    </div>

                    <button className="info_more-btn" onClick={() => setIsSidebarActive(!isSidebarActive)}>
                        <span>{isSidebarActive ? 'Hide Contacts' : 'Show Contacts'}</span>
                        <ChevronDown size={16} />
                    </button>
                </div>

                <div className="sidebar-info_more">
                    <div className="separator"></div>
                    <ul className="contacts-list">
                        <li className="contact-item">
                            <div className="icon-box"><Mail size={16} /></div>
                            <div className="contact-info">
                                <p className="contact-title">Email</p>
                                <a href={`mailto:${data.profile?.email}`} className="contact-link">{data.profile?.email}</a>
                            </div>
                        </li>
                        <li className="contact-item">
                            <div className="icon-box"><Smartphone size={16} /></div>
                            <div className="contact-info">
                                <p className="contact-title">Phone</p>
                                <span className="contact-link">Unavailable</span>
                            </div>
                        </li>
                        <li className="contact-item">
                            <div className="icon-box"><Calendar size={16} /></div>
                            <div className="contact-info">
                                <p className="contact-title">Birthday</p>
                                <time>June 16, 2005</time>
                            </div>
                        </li>
                        <li className="contact-item">
                            <div className="icon-box"><MapPin size={16} /></div>
                            <div className="contact-info">
                                <p className="contact-title">Location</p>
                                <address>{data.profile?.location}</address>
                            </div>
                        </li>
                    </ul>
                    <div className="separator"></div>
                    <ul className="social-list">
                        <li className="social-item"><a href="https://github.com/geo-cherian-mathew-2k28" target="_blank" className="social-link"><Github size={18} /></a></li>
                        <li className="social-item"><a href="https://linkedin.com/in/geo-cherian-mathew" target="_blank" className="social-link"><Linkedin size={18} /></a></li>
                        <li className="social-item"><a href="https://instagram.com/_geo_cherian_mathew_" target="_blank" className="social-link"><Instagram size={18} /></a></li>
                        <li className="social-item"><a href="https://leetcode.com/u/geo_cherian_mathew/" target="_blank" className="social-link"><Code size={18} /></a></li>
                    </ul>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="main-content">
                <nav className="navbar">
                    <ul className="navbar-list">
                        {['About', 'Resume', 'Projects', 'Certificates', 'Gallery', 'Contact'].map(tab => (
                            <li key={tab} className="navbar-item">
                                <button
                                    className={`navbar-link ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* ABOUT */}
                <article className={`about ${activeTab === 'About' ? 'active' : ''}`} data-page="about">
                    <header><h2 className="h2 article-title">About Me</h2></header>
                    <section className="about-text">
                        {data.profile?.bio?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                    </section>
                    <section className="service">
                        <h3 className="h3 service-title">What I'm Doing</h3>
                        <ul className="service-list">
                            <li className="service-item">
                                <div className="service-icon-box"><img src="/assets/images/icon-design.svg" alt="AI Integration icon" width="40" /></div>
                                <div className="service-content-box">
                                    <h4 className="h4 service-item-title">AI Integration</h4>
                                    <p className="service-item-text">Building intelligent systems using custom AI solutions for real-world impact.</p>
                                </div>
                            </li>
                            <li className="service-item">
                                <div className="service-icon-box"><img src="/assets/images/icon-dev.svg" alt="Hardware Development icon" width="40" /></div>
                                <div className="service-content-box">
                                    <h4 className="h4 service-item-title">Hardware Prototyping</h4>
                                    <p className="service-item-text">Designing IoT devices with sensor integration and firmware dev.</p>
                                </div>
                            </li>
                            <li className="service-item">
                                <div className="service-icon-box"><img src="/assets/images/icon-app.svg" alt="Full-stack Dev icon" width="40" /></div>
                                <div className="service-content-box">
                                    <h4 className="h4 service-item-title">Full-Stack Dev</h4>
                                    <p className="service-item-text">Creating web applications with modern UI/UX and scalable backends.</p>
                                </div>
                            </li>
                            <li className="service-item">
                                <div className="service-icon-box"><img src="/assets/images/icon-photo.svg" alt="System Design icon" width="40" /></div>
                                <div className="service-content-box">
                                    <h4 className="h4 service-item-title">System Architecture</h4>
                                    <p className="service-item-text">Designing robust architectures merging hardware and software.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                    <section className="testimonials">
                        <h3 className="h3 testimonials-title">Key Highlights</h3>
                        <ul className="testimonials-list has-scrollbar">
                            {HIGHLIGHTS.map((item, i) => (
                                <li key={i} className="testimonials-item" onClick={() => setActiveHighlight(item)}>
                                    <div className="content-card">
                                        <figure className="testimonials-avatar-box">
                                            <img src={item.image} alt={item.title} width="60" />
                                        </figure>
                                        <h4 className="h4 testimonials-item-title">{item.title}</h4>
                                        <div className="testimonials-text"><p>{item.text}</p></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </article>

                {/* RESUME */}
                <article className={`resume ${activeTab === 'Resume' ? 'active' : ''}`} data-page="resume">
                    <header>
                        <h2 className="h2 article-title">Resume</h2>
                    </header>
                    <section className="timeline">
                        <div className="title-wrapper education-header">
                            <div className="education-title-group" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className="icon-box"><BookOpen size={18} /></div>
                                <h3 className="h3">Education</h3>
                            </div>
                            {data.profile?.resume_url && (
                                <a 
                                    href={`${data.profile.resume_url}?t=${new Date(data.profile.updated_at).getTime()}`} 
                                    download={`Geo_Cherian_Mathew_Resume_${new Date().getFullYear()}.pdf`} 
                                    className="download-btn"
                                >
                                    <Download size={16} /> <span>Download Resume</span>
                                </a>
                            )}
                        </div>
                        <ol className="timeline-list">
                            {data.education.length > 0 ? (
                                data.education.map(edu => (
                                    <li key={edu.id} className="timeline-item" style={{ marginBottom: '35px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                            <div style={{ 
                                                width: '42px', height: '42px', borderRadius: '10px', overflow: 'hidden', 
                                                flexShrink: 0, background: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)', position: 'relative', zIndex: 10
                                            }}>
                                                {edu.logo_url ? (
                                                    <img src={edu.logo_url} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                                                ) : (
                                                    <BookOpen size={20} color="#000" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="h4 timeline-item-title" style={{ margin: 0, fontSize: '15px' }}>{edu.degree}</h4>
                                                <span style={{ fontSize: '13px', color: 'var(--vegas-gold)' }}>{edu.institution}</span>
                                            </div>
                                        </div>
                                        <span style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginBottom: '8px', marginLeft: '57px' }}>{edu.duration}</span>
                                        <p className="timeline-text" style={{ marginLeft: '57px' }}>{edu.description}</p>
                                    </li>
                                ))
                            ) : (
                                <li className="timeline-item" style={{ color: 'var(--light-gray-70)' }}>
                                    <p>No education records added yet.</p>
                                </li>
                            )}
                        </ol>
                    </section>
                    <section className="timeline">
                        <div className="title-wrapper"><div className="icon-box"><Briefcase size={18} /></div><h3 className="h3">Experience</h3></div>
                        <ol className="timeline-list">
                            {data.experience.map(exp => (
                                <li key={exp.id} className="timeline-item" style={{ marginBottom: '35px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                        <div style={{ 
                                            width: '42px', height: '42px', borderRadius: '10px', overflow: 'hidden', 
                                            flexShrink: 0, background: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)', position: 'relative', zIndex: 10
                                        }}>
                                            {exp.logo_url ? (
                                                <img src={exp.logo_url} style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                                            ) : (
                                                <Briefcase size={20} color="#000" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="h4 timeline-item-title" style={{ margin: 0, fontSize: '15px' }}>{exp.role}</h4>
                                            <span style={{ fontSize: '13px', color: 'var(--vegas-gold)' }}>{exp.organization}</span>
                                        </div>
                                    </div>
                                    <span style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginBottom: '8px', marginLeft: '57px' }}>{exp.duration}</span>
                                    <p className="timeline-text" style={{ marginLeft: '57px' }}>{exp.description}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                    <section className="skill">
                        <h3 className="h3 skills-title">Technical Proficiency</h3>
                        <ul className="skills-list content-card">
                            {data.skills.map(skill => (
                                <li key={skill.id} className="skills-item">
                                    <div className="skill">
                                        <div className="title-wrapper"><h5 className="h5">{skill.name}</h5><data value={skill.level}>{skill.level}%</data></div>
                                        <div className="skill-progress-bg"><div className="skill-progress-fill" style={{ width: `${skill.level}%` }}></div></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </article>

                {/* PROJECTS */}
                <article className={`portfolio ${activeTab === 'Projects' ? 'active' : ''}`} data-page="portfolio">
                    <header><h2 className="h2 article-title">Projects</h2></header>

                    <ul className="filter-list">
                        {PROJECT_CATEGORIES.map(cat => (
                            <li key={cat} className="filter-item">
                                <button className={projectFilter === cat.toLowerCase() ? 'active' : ''} onClick={() => setProjectFilter(cat.toLowerCase())}>
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="filter-select-box">
                        <button className={`filter-select ${isProjectSelectActive ? 'active' : ''}`} onClick={() => setIsProjectSelectActive(!isProjectSelectActive)}>
                            <div className="select-value">{projectFilter === 'all' ? 'Select category' : projectFilter}</div>
                            <div className="select-icon"><ChevronDown size={14} /></div>
                        </button>
                        <ul className="select-list">
                            {PROJECT_CATEGORIES.map(cat => (
                                <li key={cat} className="select-item">
                                    <button onClick={() => { setProjectFilter(cat.toLowerCase()); setIsProjectSelectActive(false); }}>
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <ul className="project-list">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map(p => renderMilestoneCard(p, 'project'))
                        ) : (
                            <li className="project-item active" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--light-gray-70)' }}>
                                <div className="icon-box" style={{ margin: '0 auto 15px' }}><Layout size={24} /></div>
                                <p>Nothing here</p>
                            </li>
                        )}
                    </ul>
                </article>

                {/* CERTIFICATES */}
                <article className={`certificates ${activeTab === 'Certificates' ? 'active' : ''}`} data-page="certificates">
                    <header><h2 className="h2 article-title">Certificates</h2></header>

                    <ul className="filter-list">
                        {CERTIFICATE_CATEGORIES.map(cat => (
                            <li key={cat} className="filter-item">
                                <button className={certificateFilter === cat.toLowerCase() ? 'active' : ''} onClick={() => setCertificateFilter(cat.toLowerCase())}>
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="filter-select-box">
                        <button className={`filter-select ${isCertSelectActive ? 'active' : ''}`} onClick={() => setIsCertSelectActive(!isCertSelectActive)}>
                            <div className="select-value">{certificateFilter === 'all' ? 'Select category' : certificateFilter}</div>
                            <div className="select-icon"><ChevronDown size={14} /></div>
                        </button>
                        <ul className="select-list">
                            {CERTIFICATE_CATEGORIES.map(cat => (
                                <li key={cat} className="select-item">
                                    <button onClick={() => { setCertificateFilter(cat.toLowerCase()); setIsCertSelectActive(false); }}>
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <ul className="project-list">
                        {filteredCertificates.length > 0 ? (
                            filteredCertificates.map(c => renderMilestoneCard(c, 'certificate'))
                        ) : (
                            <li className="project-item active" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--light-gray-70)' }}>
                                <div className="icon-box" style={{ margin: '0 auto 15px' }}><Shield size={24} /></div>
                                <p>Nothing here</p>
                            </li>
                        )}
                    </ul>
                </article>

                {/* GALLERY */}
                <article className={`gallery ${activeTab === 'Gallery' ? 'active' : ''}`} data-page="gallery">
                    <header><h2 className="h2 article-title">Gallery</h2></header>
                    <p style={{ color: 'var(--light-gray-70)', fontSize: '14px', marginBottom: '25px', lineHeight: '1.6' }}>
                        A strategic chronicle of my high-fidelity professional achievements and accolades.
                    </p>
                    <ul className="project-list">
                        {data.gallery.map(item => renderMilestoneCard(item, 'gallery'))}
                    </ul>
                </article>

                {/* CONTACT */}
                <article className={`contact ${activeTab === 'Contact' ? 'active' : ''}`} data-page="contact">
                    <header><h2 className="h2 article-title">Contact</h2></header>
                    <section className="mapbox"><iframe src="https://www.google.com/maps?q=Kerala,+India&output=embed" loading="lazy"></iframe></section>
                    <section className="contact-form">
                        <h3 className="h3 form-title">Get In Touch</h3>
                        <form className="form" onSubmit={handleFormSubmit}>
                            <div className="input-wrapper">
                                <input type="text" name="name" className="form-input" placeholder="Full name" required />
                                <input type="email" name="email" className="form-input" placeholder="Email address" required />
                            </div>
                            <textarea name="message" className="form-input" placeholder="Your Message" required></textarea>
                            <button className="form-btn" type="submit"><span>Send Message</span></button>
                        </form>
                    </section>
                </article>
            </div>

            {/* LIGHTBOX / MODAL */}
            {lightboxImage && (
                <div className="certificate-modal-container active" onClick={() => setLightboxImage(null)}>
                    <div className="certificate-modal">
                        <button className="modal-close-btn" onClick={() => setLightboxImage(null)}><X size={30} /></button>
                        <img src={lightboxImage} alt="Certificate preview" />
                    </div>
                </div>
            )}

            {/* HIGHLIGHTS MODAL */}
            {activeHighlight && (
                <div className={`modal-container ${activeHighlight ? 'active' : ''}`}>
                    <div className="overlay" onClick={() => setActiveHighlight(null)}></div>
                    <section className="testimonials-modal">
                        <button className="modal-close-btn" onClick={() => setActiveHighlight(null)}>
                            <X size={20} />
                        </button>
                        <div className="modal-img-wrapper">
                            <figure className="modal-avatar-box">
                                <img src={activeHighlight.image} alt={activeHighlight.title} width="80" />
                            </figure>
                            <img src="/assets/images/icon-quote.svg" alt="quote" />
                        </div>
                        <div className="modal-content">
                            <h4 className="h3 modal-title">{activeHighlight.modalTitle}</h4>
                            <time>{activeHighlight.modalDate}</time>
                            <div className="modal-text"><p>{activeHighlight.modalText}</p></div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
