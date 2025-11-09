"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: custom * 0.2, duration: 0.6, ease: "easeOut" },
    }),
};

export default function AboutHospital() {
    return (
        <div className="bg-gray-50">
            <section className="container max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
                {/* Heading */}
                <motion.h1
                    className="text-3xl md:text-4xl font-extrabold text-primary mb-4 nunito-text text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0}
                    variants={fadeUp}
                >
                    <span className="text-gray-700 text-roboto">Welcome to </span>Sunrise Hospital
                </motion.h1>

                {/* Subheading */}
                <motion.h2
                    className="text-xl md:text-2xl font-bold text-gray-800 mb-6 source-serif-text text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={1}
                    variants={fadeUp}
                >
                    Providing Compassionate Healthcare with Excellence
                </motion.h2>

                {/* Paragraph */}
                <motion.div
                    className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={2}
                    variants={fadeUp}
                >
                    <p>
                        <span className="text-primary font-semibold">Sunrise Hospital</span> has been
                        delivering world-class healthcare since 2005. Our team of skilled doctors, nurses,
                        and medical staff are dedicated to providing personalized care using advanced
                        technology and modern medical practices. Your health is our priority.
                    </p>
                </motion.div>

                {/* Image */}
                <motion.div
                    className="mt-10 max-w-7xl mx-auto relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={3}
                    variants={fadeUp}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <div className="relative h-[350px]  w-full overflow-hidden  shadow-xl">
                        <Image
                            src="/doctors-photo.jpg"
                            alt="Sunrise Hospital Building"
                            fill
                            className="object-cover object-top"
                        />
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
