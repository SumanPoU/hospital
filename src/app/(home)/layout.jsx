
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ScrollToTopButton from "@/components/ScrollToTopButton"

export default function HomeLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
            <div id="observe-scroll" />
            <ScrollToTopButton />
            <Footer />
        </div>
    )
}