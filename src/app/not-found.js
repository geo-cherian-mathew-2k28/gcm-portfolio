'use client';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Periodic glitch effect
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 3000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(glitchInterval);
        };
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

                .error-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', 'Poppins', sans-serif;
                    background: #0a0a0f;
                    overflow: hidden;
                    position: relative;
                    cursor: none;
                }

                /* Animated gradient orb following mouse */
                .error-page::before {
                    content: '';
                    position: fixed;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
                    left: ${mousePos.x}%;
                    top: ${mousePos.y}%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    transition: left 0.3s ease-out, top 0.3s ease-out;
                }

                /* Grid background */
                .error-page::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                    pointer-events: none;
                    animation: gridDrift 20s linear infinite;
                }

                @keyframes gridDrift {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }

                .error-container {
                    text-align: center;
                    position: relative;
                    z-index: 2;
                    padding: 40px;
                }

                /* Floating particles */
                .particle {
                    position: fixed;
                    width: 3px;
                    height: 3px;
                    background: rgba(99, 102, 241, 0.4);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .particle:nth-child(1) { left: 10%; top: 20%; animation: float1 6s ease-in-out infinite; }
                .particle:nth-child(2) { left: 80%; top: 30%; animation: float2 8s ease-in-out infinite; }
                .particle:nth-child(3) { left: 40%; top: 70%; animation: float3 7s ease-in-out infinite; }
                .particle:nth-child(4) { left: 65%; top: 85%; animation: float1 9s ease-in-out infinite; }
                .particle:nth-child(5) { left: 25%; top: 50%; animation: float2 5s ease-in-out infinite; }
                .particle:nth-child(6) { left: 90%; top: 60%; animation: float3 10s ease-in-out infinite; }
                .particle:nth-child(7) { left: 55%; top: 15%; animation: float1 7s ease-in-out infinite; }
                .particle:nth-child(8) { left: 15%; top: 80%; animation: float2 6s ease-in-out infinite; }

                @keyframes float1 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    50% { transform: translate(20px, -30px) scale(1.5); opacity: 0.8; }
                }
                @keyframes float2 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    50% { transform: translate(-15px, 25px) scale(1.8); opacity: 0.7; }
                }
                @keyframes float3 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    50% { transform: translate(25px, 15px) scale(1.3); opacity: 0.9; }
                }

                /* Main 404 number */
                .error-code {
                    font-size: clamp(120px, 20vw, 220px);
                    font-weight: 900;
                    line-height: 1;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 30%, #a855f7 60%, #6366f1 100%);
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradientShift 4s ease infinite;
                    position: relative;
                    letter-spacing: -4px;
                }

                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                /* Glitch effect */
                .error-code.glitch::before,
                .error-code.glitch::after {
                    content: '404';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 30%, #a855f7 60%, #6366f1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .error-code.glitch::before {
                    animation: glitch1 0.2s linear;
                    color: #ff0080;
                }

                .error-code.glitch::after {
                    animation: glitch2 0.2s linear;
                    color: #00ffff;
                }

                @keyframes glitch1 {
                    0% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 2px); }
                    25% { clip-path: inset(60% 0 10% 0); transform: translate(3px, -1px); }
                    50% { clip-path: inset(40% 0 30% 0); transform: translate(-2px, 3px); }
                    75% { clip-path: inset(10% 0 70% 0); transform: translate(2px, -2px); }
                    100% { clip-path: inset(50% 0 20% 0); transform: translate(0, 0); }
                }

                @keyframes glitch2 {
                    0% { clip-path: inset(60% 0 10% 0); transform: translate(3px, -2px); }
                    25% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 1px); }
                    50% { clip-path: inset(30% 0 40% 0); transform: translate(2px, -3px); }
                    75% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 2px); }
                    100% { clip-path: inset(20% 0 50% 0); transform: translate(0, 0); }
                }

                .error-subtitle {
                    font-size: 20px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.85);
                    margin-bottom: 12px;
                    letter-spacing: 0.5px;
                }

                .error-description {
                    font-size: 15px;
                    color: rgba(255, 255, 255, 0.4);
                    max-width: 420px;
                    margin: 0 auto 40px;
                    line-height: 1.7;
                    font-weight: 400;
                }

                /* Scan line */
                .scan-line {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
                    animation: scanDown 4s linear infinite;
                    pointer-events: none;
                    z-index: 10;
                }

                @keyframes scanDown {
                    0% { top: -2px; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100vh; opacity: 0; }
                }

                /* CTA Button */
                .error-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 32px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #fff;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    letter-spacing: 0.3px;
                    position: relative;
                    overflow: hidden;
                }

                .error-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
                    border-radius: inherit;
                }

                .error-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.35);
                }

                .error-btn:active {
                    transform: translateY(0);
                }

                /* Status indicator */
                .status-bar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 30px;
                    justify-content: center;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ef4444;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                }

                .status-text {
                    font-size: 12px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.35);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                }

                /* Decorative ring */
                .ring {
                    position: absolute;
                    border: 1px solid rgba(99, 102, 241, 0.06);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .ring-1 {
                    width: 500px; height: 500px;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ringPulse 6s ease-in-out infinite;
                }

                .ring-2 {
                    width: 700px; height: 700px;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ringPulse 8s ease-in-out infinite reverse;
                }

                @keyframes ringPulse {
                    0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
                }
            `}</style>

            <div className="error-page">
                {/* Scan line */}
                <div className="scan-line" />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="particle" />
                ))}

                {/* Decorative rings */}
                <div className="ring ring-1" />
                <div className="ring ring-2" />

                <div className="error-container">
                    <div className="status-bar">
                        <div className="status-dot" />
                        <span className="status-text">Page Not Found</span>
                    </div>

                    <div className={`error-code ${glitchActive ? 'glitch' : ''}`}>
                        404
                    </div>

                    <h2 className="error-subtitle">
                        Lost in the void
                    </h2>

                    <p className="error-description">
                        The page you're looking for has drifted into the digital unknown.
                        It may have been moved, deleted, or never existed at all.
                    </p>

                    <a href="/" className="error-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Return Home
                    </a>
                </div>
            </div>
        </>
    );
}
