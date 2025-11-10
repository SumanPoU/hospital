import Link from "next/link";

export default function Layout({ children }) {
    return (
        <div className=" min-h-screen bg-primary/2">
            <div className="container max-w-7xl mx-auto px-2 md:px-4">

                <main className="">{children}</main>
            </div>
        </div>
    );
}
