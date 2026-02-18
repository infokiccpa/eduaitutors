'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import { Play, AlertCircle, Users, Clock, CheckCircle2, Send, MessageCircle, User as UserIcon, ShieldCheck, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';
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
    const [classStatus, setClassStatus] = useState<'UPCOMING' | 'LIVE' | 'RECORDING'>('UPCOMING');
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSendingChat, setIsSendingChat] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [showChat, setShowChat] = useState(true);
    const [muted, setMuted] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const isAdmin = searchParams.get('admin') === 'true';

    // Get class details from URL params
    const subject = searchParams.get('subject') || 'Physics';
    const grade = searchParams.get('grade') || 'Grade 12';
    const rawVideoUrl = searchParams.get('videoUrl') || 'https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8';

    // Normalize URL to handle spaces and special characters correctly
    const videoUrl = React.useMemo(() => {
        try {
            return decodeURIComponent(rawVideoUrl);
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
                } else if (diff > -21600000) { // Within 6 hours of start
                    setClassStatus('LIVE');
                    setTimeLeft(null);
                } else {
                    setClassStatus('RECORDING');
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
        if (classStatus === 'UPCOMING' || !videoRef.current) return;

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

            // If user explicitly chose native or if Hls.js is not supported, OR if content is not HLS (e.g. MP4)
            const isHlsSource = videoUrl.includes('.m3u8') || videoUrl.includes('.m3u');

            if (!useNativeOnly && Hls.isSupported() && isHlsSource) {
                console.log('📡 Initializing HLS Player');
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
                        setPlayerLoading(false);
                        if (data.details === 'manifestLoadError') {
                            console.log('🔄 manifestLoadError detected - switching to native player...');
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

                const handleError = (e: any) => {
                    const error = video.error;
                    let errorMessage = "Playback failed.";

                    if (error) {
                        switch (error.code) {
                            case MediaError.MEDIA_ERR_ABORTED:
                                errorMessage = "Playback aborted by user.";
                                break;
                            case MediaError.MEDIA_ERR_NETWORK:
                                errorMessage = "Network error - please check your connection.";
                                break;
                            case MediaError.MEDIA_ERR_DECODE:
                                errorMessage = "Video format not supported or corrupted.";
                                break;
                            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                errorMessage = "Source not supported or file not found (404/403).";
                                break;
                            default:
                                errorMessage = `Unknown playback error: ${error.code}`;
                        }
                    }
                    console.error("Native Video Error:", error);
                    setPlayerError(`${errorMessage} Please try Chrome or Safari.`);
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

    // Auto-fallback timer
    useEffect(() => {
        if (!playerLoading) return;

        const fallbackTimer = setTimeout(() => {
            if (playerLoading && !useNativeOnly) {
                console.log('⚠️ HLS loading too long - trying Native fallback...');
                setUseNativeOnly(true);
            }
        }, 10000); // 10 second fallback

        return () => clearTimeout(fallbackTimer);
    }, [playerLoading, useNativeOnly]);

    // Strict "Live Sync" logic - as per AWS MediaTailor simulation request
    useEffect(() => {
        const video = videoRef.current;
        if (!video || classStatus !== 'LIVE') return;

        const syncToLive = () => {
            const now = new Date().getTime();
            // Ensure startTime is treated as a valid timestamp
            const startTimestamp = new Date(startTime).getTime();
            const elapsed = (now - startTimestamp) / 1000;

            // Only sync if the stream should be playing (elapsed > 0)
            // And if the user drifts more than 2 seconds away from the "server time"
            if (elapsed > 0 && Math.abs(video.currentTime - elapsed) > 2) {
                console.log(`⏱️ Syncing to Live: ${video.currentTime.toFixed(1)} -> ${elapsed.toFixed(1)}`);
                // Check if the calculated time is within the video's seekable range
                // (Though for a growing HLS playlist, checking 'duration' might be tricky, 
                // usually simple assignment works if the segment exists)
                video.currentTime = elapsed;
            }
        };

        // Run sync check every 5 seconds
        const intervalId = setInterval(syncToLive, 5000);

        // Prevent pausing: Auto-resume if paused
        const handlePause = () => {
            console.log("▶️ Force Resume (Live Mode)");
            video.play().catch(e => console.warn("Autoplay blocked:", e));
        };

        // Prevent seeking: Snap back to live time immediately
        const handleSeeking = () => {
            syncToLive();
        };

        video.addEventListener('pause', handlePause);
        video.addEventListener('seeking', handleSeeking);

        // Initial sync
        syncToLive();

        return () => {
            clearInterval(intervalId);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('seeking', handleSeeking);
        };
    }, [classStatus, startTime]);

    // Verify Token or Public Access
    useEffect(() => {
        const verifyToken = async () => {
            if (accessGranted) return; // Already verified via form or token

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
                // If no token, we wait for the user to use the verification form on the page
                return;
            }

            try {
                const res = await fetch(`/api/verify-access?token=${token}`);
                const data = await res.json();

                if (data.valid) {
                    setAccessGranted(true);
                    setCurrentUser(data.user);
                }
            } catch (error) {
                console.error('Verification failed', error);
            }
        };

        verifyToken();
    }, [token, searchParams, grade, subject, accessGranted]);

    // Chat Polling
    useEffect(() => {
        const fetchChat = async () => {
            if (!accessGranted) return;
            try {
                const res = await fetch(`/api/live/chat?subject=${subject}&grade=${grade}`);
                const data = await res.json();
                if (data.success) {
                    setChatMessages(data.messages);
                }
            } catch (err) {
                console.error('Chat error:', err);
            }
        };

        fetchChat();
        const interval = setInterval(fetchChat, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [accessGranted, subject, grade]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const handleSendChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSendingChat || !currentUser) return;

        setIsSendingChat(true);
        try {
            const res = await fetch('/api/live/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: currentUser.name,
                    email: currentUser.email || 'guest',
                    message: newMessage,
                    grade,
                    subject,
                    isAdmin: isAdmin
                })
            });

            if (res.ok) {
                setNewMessage('');
                // Optimized: append locally for instant feedback
                const data = await res.json();
                setChatMessages(prev => [...prev, data.chat]);
            }
        } catch (err) {
            toast.error("Failed to send message");
        } finally {
            setIsSendingChat(false);
        }
    };

    const handleVerifyAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyEmail || isVerifying) return;

        setIsVerifying(true);
        try {
            // Check if user is a lead
            const res = await fetch(`/api/verify-access?email=${verifyEmail}&subject=${subject}&grade=${grade}`);
            const data = await res.json();

            if (data.valid) {
                setAccessGranted(true);
                setCurrentUser(data.user);
                toast.success(`Welcome back, ${data.user.name}!`);
            } else {
                toast.error("You are not registered for this class. Please register first.");
                // Option to redirect to registration
                setTimeout(() => {
                    window.location.href = `/live-classes/${grade.includes('10') ? 'india' : 'india'}?email=${verifyEmail}`;
                }, 2000);
            }
        } catch (err) {
            toast.error("Verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

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

    // Check if session has expired (7 days after start)
    const isExpired = new Date().getTime() > new Date(startTime).getTime() + (7 * 24 * 60 * 60 * 1000);
    if (isExpired) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <Clock className="w-20 h-20 text-slate-600 mb-6" />
                <h1 className="text-4xl font-black mb-4">Session Expired</h1>
                <p className="text-slate-400 max-w-md mb-8 font-medium">
                    This live session recording was available for 7 days and has now expired.
                </p>
                <a href="/" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all">
                    Back to Selection
                </a>
            </div>
        );
    }

    if (accessGranted === false || (accessGranted === null && !token)) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,#f9731610,transparent_50%)]">
                <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-orange-500/30">
                        <ShieldCheck className="w-8 h-8 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 text-center">Verify Access</h1>
                    <p className="text-slate-400 text-center mb-8 font-medium">
                        Enter your registered email to join the {grade} {subject} Live Class.
                    </p>

                    <form onSubmit={handleVerifyAccess} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Registered Email</label>
                            <input
                                type="email"
                                value={verifyEmail}
                                onChange={(e) => setVerifyEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="w-full bg-slate-900 border-2 border-slate-700 focus:border-orange-500 rounded-2xl px-5 py-4 outline-none transition-all font-bold text-white placeholder:text-slate-600"
                            />
                        </div>
                        <button
                            disabled={isVerifying}
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98]"
                        >
                            {isVerifying ? 'Verifying...' : 'Join Classroom'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-700 text-center">
                        <p className="text-slate-500 text-sm font-bold mb-4">Haven't registered yet?</p>
                        <a href="/live-classes/india" className="text-orange-500 hover:text-orange-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                            Register for Free Class <Send className="w-3 h-3" />
                        </a>
                    </div>
                </div>
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
                        ) : classStatus === 'RECORDING' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                                <CheckCircle2 className="w-3 h-3" />
                                Session Recording
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

                <div className="flex-1 w-full min-h-[500px] flex flex-col md:flex-row gap-6">
                    {/* Video Player Section */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="relative w-full aspect-video md:h-[75vh] min-h-[400px] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 group">
                            {/* Countdown Timer - Show before class starts */}
                            {classStatus === 'UPCOMING' && timeLeft && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 p-6 text-center">
                                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)] border border-orange-500/30">
                                        <Clock className="w-10 h-10 text-orange-500 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Class will start shortly</h2>
                                    <p className="text-slate-400 text-lg md:text-xl max-w-lg mb-12 font-medium">Please stay on this page. The live stream will begin automatically when the timer reaches zero.</p>

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

                            {/* HLS Video Player - Show when class is live or a recording */}
                            {(classStatus === 'LIVE' || classStatus === 'RECORDING') && (
                                <>
                                    <video
                                        ref={videoRef}
                                        className="absolute inset-0 w-full h-full object-contain"
                                        playsInline
                                        autoPlay
                                        muted={muted} // Responsive muted state
                                        controls={classStatus === 'RECORDING'} // Only full controls for recordings
                                        controlsList="nodownload noplaybackrate"
                                    />

                                    {/* Player Overlays */}
                                    {playerLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                                            <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs mb-6">Initializing Stream...</p>

                                            {/* Show manual fallback if taking more than 5 seconds */}
                                            <button
                                                onClick={() => setUseNativeOnly(true)}
                                                className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-all"
                                            >
                                                Stuck? Try Direct Mode
                                            </button>
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

                                    {classStatus === 'LIVE' && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                                                Live Now
                                            </div>
                                        </div>
                                    )}

                                    {/* YouTube Style Controls Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center justify-end gap-5">
                                            {/* Chat Toggle Icon */}
                                            <button
                                                onClick={() => setShowChat(!showChat)}
                                                className="p-3 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
                                                title={showChat ? "Hide Chat" : "Show Chat"}
                                            >
                                                <MessageCircle className={`w-6 h-6 ${showChat ? 'text-orange-500' : 'text-white'}`} />
                                            </button>

                                            {/* Sound Toggle Icon */}
                                            <button
                                                onClick={() => {
                                                    if (videoRef.current) {
                                                        const newMuted = !videoRef.current.muted;
                                                        videoRef.current.muted = newMuted;
                                                        setMuted(newMuted);
                                                        videoRef.current.play();
                                                    }
                                                }}
                                                className="p-3 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
                                                title={muted ? "Unmute" : "Mute"}
                                            >
                                                {muted ? <VolumeX className="w-6 h-6 text-red-500" /> : <Volume2 className="w-6 h-6 text-white" />}
                                            </button>

                                            {/* Full Screen Toggle Icon */}
                                            <button
                                                onClick={() => {
                                                    const playerContainer = videoRef.current?.parentElement;
                                                    if (playerContainer) {
                                                        if (document.fullscreenElement) {
                                                            document.exitFullscreen();
                                                        } else {
                                                            playerContainer.requestFullscreen().catch(err => {
                                                                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                                                            });
                                                        }
                                                    }
                                                }}
                                                className="p-3 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
                                                title="Full Screen"
                                            >
                                                <Maximize2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800">
                            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-orange-500" />
                                {grade} {subject} Special Session
                            </h2>
                            <p className="text-slate-400 text-sm font-medium">
                                Welcome, <span className="text-white font-bold">{currentUser?.name}</span>. Stay engaged in the chat below!
                            </p>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className={`w-full md:w-[400px] flex flex-col bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden h-[600px] md:h-auto ${showChat ? 'flex' : 'hidden'}`}>
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-xl">
                                    <MessageCircle className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="font-black uppercase tracking-widest text-xs">Live Interaction</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{Math.floor(Math.random() * 50) + 120} Online</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" id="chat-container">
                            {chatMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-10">
                                    <MessageCircle className="w-12 h-12 mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No messages yet. Be the first to say Hi!</p>
                                </div>
                            ) : (
                                chatMessages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-start'}`}>
                                        <div className={`max-w-[90%] p-4 rounded-2xl ${msg.isAdmin ? 'bg-orange-500 text-white' : 'bg-slate-900 border border-slate-700 text-white'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${msg.isAdmin ? 'text-white' : 'text-orange-500'}`}>
                                                    {msg.isAdmin ? 'HOST • ADMIN' : msg.name}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
                                            <span className={`text-[9px] mt-2 block opacity-50 font-bold`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendChat} className="p-6 bg-slate-900/50 border-t border-slate-800">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={isAdmin ? "Reply as Administrator..." : "Ask a question..."}
                                    className="w-full bg-slate-900 border-2 border-slate-700 focus:border-orange-500 rounded-2xl px-5 py-4 outline-none transition-all text-sm font-bold placeholder:text-slate-600 pr-14"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSendingChat}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-3 font-bold uppercase tracking-widest text-center px-4">
                                Keep the discussion professional and subject-related.
                            </p>
                        </form>
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
