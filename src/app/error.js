'use client';
import { useEffect, useState } from 'react';

export default function Error({ error, reset }) {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        console.error('Application Error:', error);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    reset();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [error, reset]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

                .crash-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', 'Poppins', sans-serif;
                    background: #0a0a0f;
                    position: relative;
                    overflow: hidden;
                }

                .crash-page::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background:
                        radial-gradient(ellipse at 20% 50%, rgba(239, 68, 68, 0.04) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 50%);
                    pointer-events: none;
                }

                .crash-container {
                    text-align: center;
                    z-index: 2;
                    padding: 40px;
                    max-width: 520px;
                }

                .crash-icon-wrap {
                    width: 80px;
                    height: 80px;
                    border-radius: 24px;
                    background: rgba(239, 68, 68, 0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 28px;
                    animation: iconPulse 2s ease-in-out infinite;
                }

                @keyframes iconPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.15); }
                    50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
                }

                .crash-icon {
                    color: #ef4444;
                    width: 36px;
                    height: 36px;
                }

                .crash-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 12px;
                    letter-spacing: -0.5px;
                }

                .crash-desc {
                    font-size: 15px;
                    color: rgba(255, 255, 255, 0.4);
                    line-height: 1.7;
                    margin-bottom: 32px;
                }

                .crash-detail {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 12px;
                    padding: 16px 20px;
                    margin-bottom: 32px;
                    text-align: left;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    font-size: 12px;
                    color: rgba(239, 68, 68, 0.7);
                    word-break: break-word;
                    max-height: 80px;
                    overflow: hidden;
                }

                .crash-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .crash-btn {
                    padding: 13px 28px;
                    font-size: 14px;
                    font-weight: 600;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .crash-btn-primary {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                }

                .crash-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                }

                .crash-btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .crash-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: rgba(255, 255, 255, 0.8);
                }

                .crash-countdown {
                    margin-top: 28px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.25);
                    letter-spacing: 0.5px;
                }
            `}</style>

            <div className="crash-page">
                <div className="crash-container">
                    <div className="crash-icon-wrap">
                        <svg className="crash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>

                    <h1 className="crash-title">Something went wrong</h1>
                    <p className="crash-desc">
                        An unexpected error occurred while rendering this page.
                        This could be due to a temporary network issue or a server hiccup.
                    </p>

                    {error?.message && (
                        <div className="crash-detail">
                            {error.message}
                        </div>
                    )}

                    <div className="crash-actions">
                        <button onClick={reset} className="crash-btn crash-btn-primary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Try Again
                        </button>
                        <a href="/" className="crash-btn crash-btn-secondary">
                            Return Home
                        </a>
                    </div>

                    <p className="crash-countdown">
                        Auto-retrying in {countdown}s
                    </p>
                </div>
            </div>
        </>
    );
}
