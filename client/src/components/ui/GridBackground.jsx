import React, { useState, useEffect } from 'react';

const GridBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Dark Background */}
            <div className="absolute inset-0 bg-[#020617]"></div>

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Mouse Spotlight (Yellowish Light) */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 230, 0, 0.15), transparent 40%)`,
                }}
            ></div>
        </div>
    );
};

export default GridBackground;
