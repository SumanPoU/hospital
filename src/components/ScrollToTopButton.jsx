"use client";

import React, { useEffect, useState } from "react";

const ScrollToTopButton = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const showPoint = window.innerHeight * 0.8; // ✅ 50% of screen height
            setShow(window.scrollY > showPoint);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {show && (
                <button
                    onClick={handleScrollTop}
                    className="fixed bottom-12 right-12 cursor-pointer z-50 bg-primary hover:bg-primary/90 text-white p-1 rounded-full transition"
                >
                    <svg
                        className="w-10 h-10 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v13m0-13 4 4m-4-4-4 4"
                        />
                    </svg>
                </button>
            )}
        </>
    );
};

export default ScrollToTopButton;
