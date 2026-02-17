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
    const [useNativeOnly, setUseNativeOnly] = useState(false);
    const hlsRef = useRef<Hls | null>(null);
    const [playerLoading, setPlayerLoading] = useState(true);
    const [playerError, setPlayerError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [classStatus, setClassStatus] = useState<'UPCOMING' | 'LIVE'>('UPCOMING');

    // Get class details from URL params
    const subject = searchParams.get('subject') || 'Physics';
    const grade = searchParams.get('grade') || 'Grade 12';
    const rawVideoUrl = searchParams.get('videoUrl') || 'https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8';

    // Normalize URL to handle spaces and special characters correctly
    const videoUrl = React.useMemo(() => {
        try {
            // First decode to handle any double-encoding from search params
            const decoded = decodeURIComponent(rawVideoUrl);
            // Then ensure it's a valid URL object and return the string version
            // which will have proper encoding for HLS.js
            return new URL(decoded).toString();
        } catch (e) {
            return rawVideoUrl;
        }
    }, [rawVideoUrl]);

    const rawStartTime = searchParams.get('startTime') || '2026-02-17T13:30:00+05:30';
    const startTime = React.useMemo(() => {
        // Fix for ISO strings where '+' might be encoded as ' '
        return rawStartTime.replace(' ', '+');
    }, [rawStartTime]);

    // Helper to get current elapsed seconds
    const getElapsedSeconds = () => {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        if (isNaN(start)) return 0;
        return (now - start) / 1000;
    };

    // Countdown Timer Logic
    useEffect(() => {
        const calculateTime = () => {
            try {
                const now = new Date().getTime();
                // Ensure the date string is parsed correctly across all browsers
                const target = new Date(startTime).getTime();

                if (isNaN(target)) {
                    setClassStatus('LIVE'); // Fallback if time is invalid
                    return;
                }

                const diff = target - now;

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
        setPlayerLoading(true);
        setPlayerError(null);

        const syncTimeToLive = () => {
            const elapsed = getElapsedSeconds();
            if (elapsed > 5 && elapsed < 21600) { // Within 6 hours
                console.log(`🚀 Forcing Sync to ${elapsed}s`);
                video.currentTime = elapsed;
                video.play().catch(() => console.log('Autoplay blocked after sync'));
            }
        };

        const initPlayer = () => {
            if (hls) hls.destroy();

            // If user explicitly chose native or if Hls.js is not supported
            if (!useNativeOnly && Hls.isSupported()) {
                hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90,
                    manifestLoadingMaxRetry: 10,
                    levelLoadingMaxRetry: 10,
                    xhrSetup: (xhr) => {
                        xhr.withCredentials = false; // Important for some CORS setups
                    }
                });

                hlsRef.current = hls;
                hls.attachMedia(video);

                hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                    console.log('✅ HLS Media Attached - Loading Source');
                    hls?.loadSource(videoUrl);
                });

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('✅ HLS Manifest Parsed');
                    setPlayerLoading(false);
                    syncTimeToLive();
                    video.play().catch(() => console.log('Autoplay blocked'));
                });

                hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
                    setPlayerLoading(false);
                    // Double check sync on every level load
                    const elapsed = getElapsedSeconds();
                    if (elapsed > 10 && Math.abs(video.currentTime - elapsed) > 10) {
                        video.currentTime = elapsed;
                        video.play().catch(() => console.log('Autoplay blocked after level load sync'));
                    }
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('❌ HLS Error:', data);
                    if (data.fatal) {
                        if (data.details === 'manifestLoadError') {
                            // Automatically try native fallback on CORS error
                            console.log('🔄 CORS detected - switching to native player...');
                            setUseNativeOnly(true);
                            return;
                        }

                        setPlayerError(`Streaming Error: ${data.details}. Try the button below.`);
                        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                            setTimeout(() => hls?.startLoad(), 2000);
                        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                            hls?.recoverMediaError();
                        }
                    }
                });
            } else {
                // Native Player Fallback
                console.log('🎬 Using Native Player Engine');
                video.src = videoUrl;

                const handleMetadata = () => {
                    setPlayerLoading(false);
                    syncTimeToLive();
                    video.play().catch(e => console.log('Native playback blocked:', e));
                };

                const handleError = () => {
                    setPlayerError("Direct playback failed. This browser may not support HLS. Please try Chrome or Safari.");
                };

                video.addEventListener('loadedmetadata', handleMetadata);
                video.addEventListener('error', handleError);

                return () => {
                    video.removeEventListener('loadedmetadata', handleMetadata);
                    video.removeEventListener('error', handleError);
                };
            }
        };

        const timeoutId = setTimeout(initPlayer, 300);

        return () => {
            clearTimeout(timeoutId);
            if (hls) {
                hls.destroy();
            }
        };
    }, [classStatus, videoUrl, retryCount, useNativeOnly]);

    // Prevent forward seeking to simulate live experience
    useEffect(() => {
        const video = videoRef.current;
        if (!video || classStatus !== 'LIVE') return;

        let lastTime = 0;

        const handleTimeUpdate = () => {
            const now = new Date().getTime();
            const start = new Date(startTime).getTime();
            const liveElapsed = (now - start) / 1000;

            if (!video.seeking) {
                lastTime = video.currentTime;
            }

            // If user falls behind by more than 10 seconds (due to buffering or pause), 
            // the 'Sync' UI will help them catch up.
            // We mainly prevent them from seeking FORWARD past the current live moment.
        };

        const handleSeeking = () => {
            const now = new Date().getTime();
            const start = new Date(startTime).getTime();
            const liveElapsed = (now - start) / 1000;

            if (video.currentTime > liveElapsed + 2) { // 2s buffer for clock drift
                console.log('🚫 Seeking too far forward - snapping to live edge');
                video.currentTime = liveElapsed;
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

    // Track Attendance
    useEffect(() => {
        const recordAttendance = async () => {
            if (accessGranted && currentUser && currentUser.email) {
                try {
                    await fetch('/api/live/track-join', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: currentUser.name,
                            email: currentUser.email,
                            grade: currentUser.grade || grade,
                            subject: currentUser.subject || subject
                        })
                    });
                } catch (err) {
                    console.error('Failed to log attendance:', err);
                }
            }
        };

        recordAttendance();
    }, [accessGranted, currentUser, grade, subject]);

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

            <div className="pt-40 md:pt-48 pb-10 max-w-[2200px] mx-auto px-4 md:px-6 min-h-screen flex flex-col">
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

                <div className="flex-1 w-full min-h-[500px]">
                    {/* Video Player Section */}
                    <div className="w-full h-full flex flex-col gap-4">
                        <div className="relative w-full h-[500px] md:h-[75vh] min-h-[400px] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 group">
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
                                        className="absolute inset-0 w-full h-full object-contain"
                                        playsInline
                                        autoPlay
                                        muted
                                        controls
                                        controlsList="nodownload noplaybackrate"
                                    />

                                    {/* Player Overlays */}
                                    {playerLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                                            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Initializing Live Stream...</p>
                                        </div>
                                    )}

                                    {playerError && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-40 p-6 text-center">
                                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                            <p className="text-white font-black text-lg mb-6 max-w-md">{playerError}</p>
                                            <div className="flex flex-col gap-3 w-full max-w-xs">
                                                <button
                                                    onClick={() => setRetryCount(prev => prev + 1)}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20"
                                                >
                                                    Retry Connection
                                                </button>
                                                {!useNativeOnly && (
                                                    <button
                                                        onClick={() => setUseNativeOnly(true)}
                                                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border border-slate-700"
                                                    >
                                                        Use Direct Mode
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => window.location.reload()}
                                                    className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors mt-4"
                                                >
                                                    Refresh Page
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                            Live Session
                                        </div>
                                    </div>

                                    {/* Controls overlay - Desktop hover */}
                                    <div className="absolute bottom-10 right-10 z-50 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (videoRef.current) {
                                                    const elapsed = getElapsedSeconds();
                                                    videoRef.current.currentTime = elapsed;
                                                    videoRef.current.play();
                                                }
                                            }}
                                            className="bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-black py-4 px-8 rounded-2xl shadow-2xl shadow-orange-500/30 transition-all flex items-center gap-3 uppercase tracking-widest active:scale-95"
                                        >
                                            🚀 Catch Up to Live
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (videoRef.current) {
                                                    videoRef.current.muted = false;
                                                    videoRef.current.play();
                                                }
                                            }}
                                            className="bg-white text-slate-900 text-[10px] font-black py-4 px-8 rounded-2xl shadow-2xl transition-all uppercase tracking-widest active:scale-95"
                                        >
                                            🔊 Unmute Audio
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
