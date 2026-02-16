'use client'

import React, { useState, useEffect } from 'react'

export const CourseTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [status, setStatus] = useState<'UPCOMING' | 'LIVE' | 'ENDED'>('UPCOMING');

    useEffect(() => {
        const target = new Date(targetDate).getTime();
        const end = target + (4 * 60 * 60 * 1000); // 4 hours duration for "LIVE" status check

        const calculateTime = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff > 0) {
                setStatus('UPCOMING');
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000),
                });
            } else if (now < end) {
                setStatus('LIVE');
                setTimeLeft(null);
            } else {
                setStatus('ENDED');
                setTimeLeft(null);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (status === 'ENDED') return (
        <div className="py-4 w-full flex justify-center">
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest border border-red-100 shadow-sm">
                Slot Full
            </span>
        </div>
    );

    if (status === 'LIVE') return (
        <div className="py-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider border border-red-100 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Live Now
            </span>
        </div>
    );

    if (!timeLeft) return null;

    return (
        <div className="flex justify-center items-end gap-1.5 py-1">
            {[
                { label: 'D', val: timeLeft.d },
                { label: 'H', val: timeLeft.h },
                { label: 'M', val: timeLeft.m },
                { label: 'S', val: timeLeft.s }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-8 h-8 bg-slate-100 text-slate-900 rounded-md flex items-center justify-center font-black text-xs border border-slate-200">
                            {item.val < 10 ? `0${item.val}` : item.val}
                        </div>
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 mt-1 tracking-widest">{item.label}</span>
                </div>
            ))}
        </div>
    );
};
