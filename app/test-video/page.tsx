'use client';

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function TestVideoPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const videoUrl = 'https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8';

        if (Hls.isSupported()) {
            const hls = new Hls({
                debug: true,
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(videoUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('✅ HLS manifest loaded successfully');
                video.play().catch(err => console.log('Autoplay prevented:', err));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('❌ HLS Error:', data);
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('Network error, trying to recover...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('Media error, trying to recover...');
                            hls.recoverMediaError();
                            break;
                        default:
                            console.log('Fatal error, cannot recover');
                            hls.destroy();
                            break;
                    }
                }
            });

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // For Safari/iOS native HLS support
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', () => {
                console.log('✅ Video loaded (native HLS)');
                video.play().catch(err => console.log('Autoplay prevented:', err));
            });
        } else {
            console.error('❌ HLS is not supported in this browser');
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">HLS Video Stream Test</h1>
                    <p className="text-slate-400">Testing: Grade 12 Physics Video</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono break-all">
                        https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8
                    </p>
                </div>

                <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                    <video
                        ref={videoRef}
                        controls
                        className="w-full aspect-video"
                        playsInline
                    />
                </div>

                <div className="mt-6 p-4 bg-slate-800 rounded-lg">
                    <h2 className="font-bold mb-2">Video Controls:</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => videoRef.current?.play()}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                        >
                            ▶ Play
                        </button>
                        <button
                            onClick={() => videoRef.current?.pause()}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
                        >
                            ⏸ Pause
                        </button>
                        <button
                            onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.currentTime = 0;
                                }
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                        >
                            ⏮ Restart
                        </button>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                    <h2 className="font-bold mb-2">Instructions:</h2>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                        <li>Check the browser console (F12) for detailed logs</li>
                        <li>Look for "✅ HLS manifest loaded successfully" message</li>
                        <li>If you see errors, check the network tab for failed requests</li>
                        <li>Verify CORS headers are properly configured on CloudFront</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
