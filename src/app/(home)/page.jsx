import Hero from "./_components/Slider"
// import Hero from "./_components/Hero"
import About from "./_components/About"
import Team from "./_components/Teams"
import Services from "./_components/Services"
import HospitalContactSection from "./_components/ContactSection"

export default function Home() {
    return (
        <div>
            <Hero />
            <About />
            <Services />
            <Team />
            <HospitalContactSection />
        </div>
    )
}