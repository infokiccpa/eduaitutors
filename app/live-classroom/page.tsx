'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import { Play, AlertCircle, Users, Clock } from 'lucide-react';
import Hls from 'hls.js';

const LiveClassroomContent = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [classStatus, setClassStatus] = useState<'UPCOMING' | 'LIVE'>('UPCOMING');

    // Get class details from URL params
    const subject = searchParams.get('subject') || 'Physics';
    const grade = searchParams.get('grade') || 'Grade 12';
    const videoUrl = searchParams.get('videoUrl') || 'https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8';
    const startTime = searchParams.get('startTime') || '2026-02-17T13:30:00+05:30'; // Default to Physics class time

    // Countdown Timer Logic
    useEffect(() => {
        const calculateTime = () => {
            try {
                const now = new Date().getTime();
                // Ensure the date string is parsed correctly across all browsers
                const target = new Date(startTime).getTime();

                if (isNaN(target)) {
                    console.error('Invalid startTime format:', startTime);
                    setClassStatus('LIVE'); // Fallback if time is invalid
                    return;
                }

                const diff = target - now;
                console.log(`Time to start: ${diff}ms | Target: ${new Date(target).toLocaleString()} | Now: ${new Date(now).toLocaleString()}`);

                if (diff > 0) {
                    setClassStatus('UPCOMING');
                    setTimeLeft({
                        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                        s: Math.floor((diff % (1000 * 60)) / 1000),
                    });
                } else {
                    setClassStatus('LIVE');
                    setTimeLeft(null);
                }
            } catch (err) {
                console.error('Error calculating time:', err);
                setClassStatus('LIVE');
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    // HLS Video Player Setup
    useEffect(() => {
        if (classStatus !== 'LIVE' || !videoRef.current) return;

        const video = videoRef.current;
        let hls: Hls | null = null;

        const initPlayer = () => {
            if (hls) {
                hls.destroy();
            }

            if (Hls.isSupported()) {
                hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hlsRef.current = hls;
                hls.loadSource(videoUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('✅ HLS stream loaded successfully');
                    video.play().catch(err => {
                        console.log('Autoplay prevented, waiting for user interaction:', err);
                    });
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('❌ HLS Error:', data);
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log('Network error, trying to recover...');
                                hls?.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('Media error, trying to recover...');
                                hls?.recoverMediaError();
                                break;
                            default:
                                console.error('Fatal error, cannot recover automatically');
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari/iOS native HLS support
                video.src = videoUrl;
                video.addEventListener('loadedmetadata', () => {
                    console.log('✅ Video loaded (native HLS)');
                    video.play().catch(err => console.log('Autoplay prevented:', err));
                });
            }
        };

        initPlayer();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [classStatus, videoUrl]);

    // Prevent forward seeking to simulate live experience
    useEffect(() => {
        const video = videoRef.current;
        if (!video || classStatus !== 'LIVE') return;

        let lastTime = 0;

        const handleTimeUpdate = () => {
            if (!video.seeking) {
                lastTime = video.currentTime;
            }
        };

        const handleSeeking = () => {
            if (video.currentTime > lastTime) {
                video.currentTime = lastTime;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('seeking', handleSeeking);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('seeking', handleSeeking);
        };
    }, [classStatus]);

    // Verify Token
    useEffect(() => {
        const verifyToken = async () => {
            const isPublic = searchParams.get('public') === 'true';

            if (isPublic) {
                setAccessGranted(true);
                setCurrentUser({
                    name: 'Guest Student',
                    grade: grade,
                    subject: subject
                });
                return;
            }

            if (!token) {
                setAccessGranted(false);
                return;
            }

            try {
                const res = await fetch(`/api/verify-access?token=${token}`);
                const data = await res.json();

                if (data.valid) {
                    setAccessGranted(true);
                    setCurrentUser(data.user);
                } else {
                    setAccessGranted(false);
                }
            } catch (error) {
                console.error('Verification failed', error);
                setAccessGranted(false);
            }
        };

        verifyToken();
    }, [token, searchParams, grade, subject]);

    const videoId = searchParams.get('videoId') || 'dQw4w9WgXcQ'; // Default mock ID

    if (accessGranted === null) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (accessGranted === false) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-slate-400 text-center max-w-md mb-6">
                    This live class is only accessible to registered users. Please register on our website to receive a valid access link.
                </p>
                <a href="/" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                    Go to Homepage
                </a>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <style jsx global>{`
                video::-webkit-media-controls-timeline {
                    display: none !important;
                }
                video::-webkit-media-controls-current-time-display {
                    display: none !important;
                }
                video::-webkit-media-controls-time-remaining-display {
                    display: none !important;
                }
            `}</style>
            <PublicHeader />

            <div className="pt-56 pb-4 max-w-[2200px] mx-auto px-4 md:px-6 min-h-screen flex flex-col">
                {/* Header Info */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        {classStatus === 'LIVE' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Live Now
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <Clock className="w-3 h-3" />
                                Starting Soon
                            </div>
                        )}
                        <h1 className="text-2xl md:text-3xl font-black text-white">
                            {grade} {subject} - Final Revision
                        </h1>
                    </div>
                </div>

                <div className="w-full h-full min-h-0">
                    {/* Video Player Section */}
                    <div className="w-full h-full flex flex-col gap-4">
                        <div className="relative w-full h-[600px] md:h-full max-h-[92vh] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 group">
                            {/* Countdown Timer - Show before class starts */}
                            {classStatus === 'UPCOMING' && timeLeft && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 p-6 text-center">
                                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)] border border-orange-500/30">
                                        <Clock className="w-10 h-10 text-orange-500 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Class will start shortly</h2>
                                    <p className="text-slate-400 text-lg md:text-xl max-w-lg mb-12">Please stay on this page. The live stream will begin automatically when the timer reaches zero.</p>

                                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
                                        {[
                                            { label: 'Days', val: timeLeft.d },
                                            { label: 'Hours', val: timeLeft.h },
                                            { label: 'Minutes', val: timeLeft.m },
                                            { label: 'Seconds', val: timeLeft.s }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col items-center">
                                                <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-800/80 border-2 border-orange-500/50 rounded-2xl flex items-center justify-center mb-3 shadow-[0_10px_20px_rgba(0,0,0,0.4)] backdrop-blur-md">
                                                    <span className="text-3xl md:text-5xl font-black text-white font-mono">{item.val < 10 ? `0${item.val}` : item.val}</span>
                                                </div>
                                                <span className="text-[10px] md:text-xs font-bold text-orange-500/70 uppercase tracking-widest">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Waiting for session to start</span>
                                    </div>
                                </div>
                            )}

                            {/* HLS Video Player - Show when class is live */}
                            {classStatus === 'LIVE' && (
                                <>
                                    <video
                                        ref={videoRef}
                                        controls
                                        className="absolute inset-0 w-full h-full object-contain"
                                        playsInline
                                        autoPlay
                                        muted // Muted helps with autoplay in many browsers
                                        controlsList="nodownload noplaybackrate"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                                            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                            Live Now
                                        </div>
                                    </div>
                                    {/* Troubleshooting overlay - visible if user hovers or if video not playing */}
                                    <div className="absolute bottom-16 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (videoRef.current) {
                                                    videoRef.current.muted = false;
                                                    videoRef.current.play();
                                                }
                                            }}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-bold py-2 px-4 rounded-lg border border-white/20 transition-all"
                                        >
                                            🔊 Unmute & Play
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-bold py-2 px-4 rounded-lg border border-white/20 transition-all"
                                        >
                                            🔄 Refresh Player
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LiveClassroom = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        }>
            <LiveClassroomContent />
        </Suspense>
    );
};

export default LiveClassroom;
