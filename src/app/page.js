'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import {
    Mail, Smartphone, Calendar, MapPin, Github, Linkedin, Instagram,
    ExternalLink, Download, BookOpen, Briefcase, Send, ChevronDown, X,
    Layout, Cpu, Globe, Server, Zap, Shield, Heart, Code
} from 'lucide-react';
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
        async function fetchData() {
            try {
                const [
                    { data: profile },
                    { data: projects },
                    { data: experience },
                    { data: education },
                    { data: skills },
                    { data: certs },
                    { data: gallery }
                ] = await Promise.all([
                    supabase.from('profiles').select('*').single(),
                    supabase.from('projects').select('*').order('created_at', { ascending: false }),
                    supabase.from('experience').select('*').order('created_at', { ascending: false }),
                    supabase.from('education').select('*').order('created_at', { ascending: false }),
                    supabase.from('skills').select('*').order('id'),
                    supabase.from('certificates').select('*').order('created_at', { ascending: false }),
                    supabase.from('gallery').select('*').order('created_at', { ascending: false })
                ]);

                setData({
                    profile: profile || {
                        name: 'Geo Cherian Mathew',
                        role: 'AI & IoT Developer | CSE Student',
                        bio: "I'm a passionate Computer Science and Engineering student from India, specializing in AI, hardware-software integration, and IoT solutions. I excel at transforming complex real-world challenges into innovative, scalable prototypes that deliver measurable impact.\n\nMy expertise spans embedded systems, artificial intelligence, and full-stack development. I'm driven by the mission to build impactful solutions for agriculture, safety, healthcare, and education.",
                        location: 'Kerala, India',
                        email: 'geomathewprojects28@gmail.com'
                    },
                    projects: projects || [],
                    experience: experience || [],
                    education: education || [],
                    skills: skills || [],
                    certificates: certs || [],
                    gallery: gallery || []
                });
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        fetchData();
    }, [activeTab]);

    // Analytics Tracker
    useEffect(() => {
        const trackVisit = async () => {
            try {
                await supabase.from('analytics').insert({
                    type: 'page_view',
                    details: { page: 'portfolio', referrer: document.referrer, user_agent: navigator.userAgent }
                });
            } catch (err) {
                console.warn('Analytics skipped', err);
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
            toast.error('Failed to send message.');
        }
    };

    if (loading) return null;

    const projectCategories = ['all', ...new Set(data.projects.map(p => p.category?.toLowerCase()).filter(Boolean))];
    const filteredProjects = projectFilter === 'all'
        ? data.projects
        : data.projects.filter(p => (p.category || '').toLowerCase().trim() === projectFilter);

    const filteredCertificates = certificateFilter === 'all'
        ? data.certificates
        : data.certificates.filter(c => (c.category || '').toLowerCase().trim() === certificateFilter);

    return (
        <main>
            <Toaster position="bottom-right" />


            {/* SIDEBAR */}
            <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`} data-sidebar>
                <div className="sidebar-info">
                    <figure className="avatar-box" onClick={() => setIsAvatarFlipped(!isAvatarFlipped)} style={{ cursor: 'pointer' }}>
                        <img
                            src={isAvatarFlipped ? "/assets/images/highlights/avatar-2.png" : (data.profile?.avatar_url || "/assets/images/geo6.jpg")}
                            alt="Profile"
                            loading="lazy"
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
                            <a href="/assets/files/Geo_Cherian_Mathew_Resume.pdf" download="Geo_Cherian_Mathew_Resume.pdf" className="download-btn">
                                <Download size={16} /> <span>Download Resume</span>
                            </a>
                        </div>
                        <ol className="timeline-list">
                            {data.education.length > 0 ? (
                                data.education.map(edu => (
                                    <li key={edu.id} className="timeline-item">
                                        <h4 className="h4 timeline-item-title">{edu.degree}</h4>
                                        <span>{edu.duration} • {edu.institution}</span>
                                        <p className="timeline-text">{edu.description}</p>
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
                                <li key={exp.id} className="timeline-item">
                                    <h4 className="h4 timeline-item-title">{exp.role}</h4>
                                    <span>{exp.duration} • {exp.organization}</span>
                                    <p className="timeline-text">{exp.description}</p>
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
                            filteredProjects.map(p => (
                                <li key={p.id} className="project-item active">
                                    <div style={{ position: 'relative' }}>
                                        <figure className="project-img">
                                            <div className="project-icons">
                                                {p.github_link && <a href={p.github_link} target="_blank" className="project-icon-link" onClick={() => trackProjectClick(p, 'github')}><Github size={20} /></a>}
                                                {p.live_link && <a href={p.live_link} target="_blank" className="project-icon-link" onClick={() => trackProjectClick(p, 'live')}><ExternalLink size={20} /></a>}
                                            </div>
                                            <img src={p.image_url} alt={p.title} loading="lazy" />
                                        </figure>
                                        <h3 className="project-title">{p.title}</h3>
                                        <p className="project-category">{p.description || p.category}</p>
                                    </div>
                                </li>
                            ))
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
                            filteredCertificates.map(c => (
                                <li key={c.id} className="project-item active" onClick={() => setLightboxImage(c.image_url)}>
                                    <figure className="project-img" style={{ cursor: 'pointer' }}><img src={c.image_url} alt={c.title} /></figure>
                                    <h3 className="project-title">{c.title}</h3>
                                    <p className="project-category">{c.description || c.issuer}</p>
                                </li>
                            ))
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
                    <ul className="project-list">
                        {data.gallery.map(item => (
                            <li key={item.id} className="project-item active" onClick={() => setLightboxImage(item.image_url)}>
                                <figure className="project-img" style={{ cursor: 'pointer' }}><img src={item.image_url} alt="Gallery item" /></figure>
                            </li>
                        ))}
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
