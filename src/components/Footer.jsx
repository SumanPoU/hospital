"use client"


import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, HeartPulse, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

export default function Footer() {
    const [email, setEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) {
            setSubscribed(true)
            setEmail("")
            setTimeout(() => setSubscribed(false), 3000)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    const socialIcons = [
        { Icon: Facebook, href: "#", label: "Facebook" },
        { Icon: Instagram, href: "#", label: "Instagram" },
        { Icon: Twitter, href: "#", label: "Twitter" },
        { Icon: Youtube, href: "#", label: "YouTube" },
    ]

    const quickLinks = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Our Services", href: "/services" },
        { label: "Our Doctors", href: "/doctors" },
        { label: "Contact", href: "/contact" },
    ]

    const contactInfo = [
        { Icon: Phone, label: "+977 1 554 4455" },
        { Icon: Mail, label: "info@sunrisehospital.com" },
        { Icon: MapPin, label: "Kumaripati, Lalitpur, Nepal" },
    ]

    return (
        <footer className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10  ">
                {/* Top Section with Brand and Newsletter */}
                <div className="border-b border-slate-700/50">
                    <div className="container mx-auto max-w-7xl px-6 py-16">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {/* Brand Section */}
                            <motion.div variants={itemVariants}>
                                <motion.div className="flex items-center gap-3 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur opacity-75" />
                                        <div className="relative bg-slate-900 p-2 rounded-full">
                                            <HeartPulse className="text-teal-400 w-6 h-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                                        Sunrise Hospital
                                    </h3>
                                </motion.div>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-md text-roboto">
                                    Compassionate care, advanced technology, and a commitment to your health — because every sunrise
                                    brings new hope and healing.
                                </p>
                            </motion.div>

                            {/* Newsletter Section */}
                            <motion.div variants={itemVariants} className="flex flex-col">
                                <h4 className="text-lg font-semibold mb-4 text-slate-100 text-nunito">Stay Updated</h4>
                                <p className="text-slate-400 text-sm mb-4 text-roboto">
                                    Get health tips and hospital news delivered to your inbox.
                                </p>
                                <form onSubmit={handleSubscribe} className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="flex-1 text-roboto bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition"
                                    />
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition"
                                    >

                                        <span className="hidden sm:inline text-roboto">Subscribe</span><ArrowRight size={16} />
                                    </motion.button>
                                </form>
                                {subscribed && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-teal-400 text-sm mt-2"
                                    >
                                        ✓ Thanks for subscribing!
                                    </motion.p>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto max-w-7xl px-6 py-16">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Quick Links */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-semibold mb-6 text-teal-300 text-nunito">Quick Links</h4>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-300 text-roboto hover:text-teal-300 transition duration-300 flex items-center gap-2 group"
                                        >
                                            <span className="w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>



                        {/* Services */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-semibold mb-6 text-teal-300 text-nunito">Services</h4>
                            <ul className="space-y-3 text-slate-300 text-roboto">
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Emergency Care
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Surgery
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Pediatrics
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Cardiology
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Resources */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-semibold mb-6 text-teal-300 text-nunito">Resources</h4>
                            <ul className="space-y-3 text-slate-300 text-roboto">
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Health Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-teal-300 transition">
                                        Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-semibold mb-6 text-teal-300 text-nunito">Get in Touch</h4>
                            <ul className="space-y-4">
                                {contactInfo.map((info, idx) => (
                                    <li key={idx} className="flex gap-3 group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="p-2 bg-slate-700/50 group-hover:bg-teal-500/20 rounded-lg transition">
                                                <info.Icon size={16} className="text-teal-400" />
                                            </div>
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed text-roboto">{info.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Social Media */}
                        <motion.div variants={itemVariants}>
                            <h4 className="text-lg font-semibold mb-6 text-teal-300 text-nunito">Follow Us</h4>
                            <div className="flex gap-3 flex-wrap">
                                {socialIcons.map(({ Icon, href, label }) => (
                                    <motion.div key={label} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href={href}
                                            aria-label={label}
                                            className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-teal-500 hover:to-cyan-500 rounded-lg transition duration-300 flex items-center justify-center"
                                        >
                                            <Icon size={20} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-700/50 py-8 text-nunito">
                    <div className="container mx-auto max-w-7xl px-6">
                        <motion.div
                            className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-400"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <p>© {new Date().getFullYear()} Sunrise Hospital. All Rights Reserved.</p>
                            <div className="flex gap-6">
                                <Link href="#" className="hover:text-teal-300 transition">
                                    Privacy
                                </Link>
                                <Link href="#" className="hover:text-teal-300 transition">
                                    Security
                                </Link>
                                <Link href="#" className="hover:text-teal-300 transition">
                                    Sitemap
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
