
import Header from "@/components/Header"
export default function HomeLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}