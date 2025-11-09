"use client"

import HospitalContactForm from "@/components/contact-form"

export default function HospitalContactSection() {
  return (
    <div className="w-full bg-white py-12 md:py-20">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="space-y-3 text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl text-roboto font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-nunito">
            Have questions? Our dedicated team is here to help. Contact us anytime for medical inquiries, appointments,
            or general information.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Contact Form */}
          <div className="bg-white  shadow-lg p-8 md:p-10 border border-gray-100">
            <HospitalContactForm />
          </div>

          {/* Right: Map Iframe */}
          <div className="space-y-6">
            <div className="bg-white  shadow-lg overflow-hidden border border-gray-100">
              <iframe
                title="Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56523.232887055274!2d85.35267761405866!3d27.695602121438533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a3ae5927b6b%3A0x932d285949940f73!2sSumaya%20Medical%20Hall!5e0!3m2!1sen!2snp!4v1762706237054!5m2!1sen!2snp"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full "
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
