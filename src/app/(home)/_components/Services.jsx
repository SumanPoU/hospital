// "use client";

// import {
//     Stethoscope,
//     HeartPulse,
//     Microscope,
//     Syringe,
//     Activity,
//     Baby,
//     ShieldCheck,
//     Thermometer,
//     Bone,
//     Brain,
//     Ambulance
// } from "lucide-react";
// import { motion } from "framer-motion";

// const services = [
//     { icon: Stethoscope, title: "General Consultation" },
//     { icon: HeartPulse, title: "Cardiology" },
//     { icon: Microscope, title: "Laboratory Services" },
//     { icon: Syringe, title: "Vaccination" },
//     { icon: Baby, title: "Maternity Care" },
//     { icon: Activity, title: "Emergency Care" },
//     { icon: ShieldCheck, title: "Health Insurance Support" },
//     { icon: Thermometer, title: "Fever Clinic" },
//     { icon: Bone, title: "Orthopedics" },
//     { icon: Brain, title: "Neurology" },
// ];

// export default function Services() {
//     return (
//         <section className="py-16 bg-gray-50">
//             <div className="container mx-auto max-w-6xl px-4">

//                 <motion.h2
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.4 }}
//                     className="text-3xl md:text-4xl font-bold text-center text-primary mb-12"
//                 >
//                     Our Medical Services
//                 </motion.h2>

//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                     {services.map((service, idx) => (
//                         <motion.div
//                             key={idx}
//                             initial={{ opacity: 0, y: 30 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ delay: idx * 0.1, duration: 0.4 }}
//                         >
//                             <div className="relative group h-full w-full cursor-pointer overflow-hidden bg-white hover:shadow-xl ">

//                                 {/* Background Hover Overlay (comes from bottom) */}
//                                 <div className="absolute inset-0 -translate-y-full bg-primary transition-transform duration-500 ease-out group-hover:translate-y-0"></div>

//                                 {/* Content */}
//                                 <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 transition-all duration-300 group-hover:scale-[1.03]">

//                                     <div className="
//                                         p-4 bg-primary/10 text-primary transition-all duration-300
//                                         group-hover:bg-white group-hover:text-primary
//                                     ">
//                                         <service.icon size={32} />
//                                     </div>

//                                     <h3 className="mt-4 text-base font-semibold transition-all duration-300 group-hover:text-white">
//                                         {service.title}
//                                     </h3>
//                                 </div>

//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }



"use client";

import {
    Stethoscope,
    HeartPulse,
    Microscope,
    Syringe,
    Activity,
    Baby,
    ShieldCheck,
    Thermometer,
    Bone,
    Brain,
    Ambulance
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";


const services = [
    { icon: Stethoscope, title: "General Consultation" },
    { icon: HeartPulse, title: "Cardiology" },
    { icon: Microscope, title: "Laboratory Services" },
    { icon: Syringe, title: "Vaccination" },
    { icon: Baby, title: "Maternity Care" },
    { icon: Activity, title: "Emergency Care" },
    { icon: ShieldCheck, title: "Health Insurance Support" },
    { icon: Thermometer, title: "Fever Clinic" },
    { icon: Bone, title: "Orthopedics" },
    { icon: Brain, title: "Neurology" },
];

export default function Services() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4">

                {/* Decorative Heartbeat Line */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-2"
                >
                    <Image
                        src="/heart.png"
                        alt="Heartbeat Line"
                        width={200}
                        height={50}
                        className="object-contain opacity-90"
                        priority
                    />
                </motion.div>

                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-3xl md:text-4xl font-bold text-center text-primary mb-12"
                >
                    Our Medical Services
                </motion.h2>

                {/* Services Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                        >
                            <div className="relative group h-full w-full cursor-pointer overflow-hidden bg-white hover:shadow-xl">

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 -translate-y-full bg-primary transition-transform duration-500 ease-out group-hover:translate-y-0"></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 transition-all duration-300 group-hover:scale-[1.03]">
                                    <div
                                        className="p-4 bg-primary/10 text-primary transition-all duration-300
                                        group-hover:bg-white group-hover:text-primary"
                                    >
                                        <service.icon size={32} />
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold transition-all duration-300 group-hover:text-white">
                                        {service.title}
                                    </h3>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
