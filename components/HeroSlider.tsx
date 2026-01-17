'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface HeroSliderProps {
    children: React.ReactNode
}

export default function HeroSlider({ children }: HeroSliderProps) {
    const images = [
        'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80',
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        }, 6000)

        return () => clearInterval(interval)
    }, [images.length])

    return (
        <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden bg-black">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.15 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Intelligent Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-12 right-12 z-20 hidden md:flex items-center gap-4">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'bg-primary-500 w-12' : 'bg-white/30 w-4 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>


        </section>
    )
}
