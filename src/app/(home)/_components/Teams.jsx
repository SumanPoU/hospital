import Image from 'next/image';
import React from 'react';
const items = [
    {
        id: "1",
        url: "/team/1.jpg",
        title: "Dr. Suman Adhikari",
        description: "Senior Cardiologist",
        tags: ["Floral", "Highlands", "Wildflowers", "Colorful", "Resilience"],
    },
    {
        id: "2",
        url: "/team/2.jpg",
        title: "Dr. Aashika Khadka",
        description: "Founder & Chief Surgeon",
        tags: ["Twilight", "Peaks", "Silhouette", "Evening Sky", "Peaceful"],
    },
    {
        id: "3",
        url: "/team/3.jpg",
        title: "Dr. Nayan Rai",
        description: "CTO & Neurologist",
        tags: ["Rocky", "Ridges", "Contrast", "Adventure", "Clouds"],
    },
    {
        id: "4",
        url: "/team/4.jpg",
        title: "Dr. Prakash Shrestha",
        description: "Consultant Physician",
        tags: ["Innovation", "Technology", "Health", "Research", "Future"],
    },
];

function Team() {
    return (
        <div className='container max-w-7xl mx-auto py-12'>
            <div className='text-center pb-10'>
                <p className='font-bold text-lato uppercase text-gray-700'>Truseted Care</p>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-semibold  text-primary'>
                    Our Doctors
                </h1>
            </div>
            <div className="group flex max-md:flex-col justify-center gap-2 ">
                {items.map((item, i) => {
                    return (
                        <article className="group/article relative w-full  overflow-hidden md:not-[&:hover]:group-hover:w-[20%] md:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:h-1/3 before:bg-linear-to-t before:from-black/50 before:transition-opacity md:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:opacity-0 md:not-[&:hover]:group-hover:after:opacity-100 md:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 after:absolute after:inset-0 after:bg-white/30 after:backdrop-blur-sm after:transition-all focus-within:ring-3 focus-within:ring-indigo-300">
                            <a
                                className="absolute inset-0 text-white z-10  p-3 flex flex-col justify-end"
                                href="#0">
                                <h1 className=" text-xl font-medium   md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300">
                                    {item?.title}
                                </h1>
                                <span className=" text-3xl font-medium  md:whitespace-nowrap md:truncate md:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-500 group-focus-within/article:delay-500">
                                    {item?.description}
                                </span>
                            </a>
                            <Image
                                className="object-cover h-72 md:h-[420px]  w-full"
                                src={item?.url}
                                width="960"
                                height="480"
                                alt="Image 01"
                            />
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
export default Team;
