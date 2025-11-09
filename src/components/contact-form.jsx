"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { Phone, Mail, Clock } from "lucide-react"

const ServiceTypes = [
  "Emergency Care",
  "Outpatient Consultation",
  "Appointment Booking",
  "Medical Records",
  "Billing Inquiry",
  "Other",
]

export default function HospitalContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, serviceType: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/public/mail/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent. We'll get back to you soon.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          message: "",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error!",
          description: errorData.message || "Failed to send message.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast({
        title: "Error!",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-semibold text-roboto">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="border-gray-300 text-nunito"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-semibold text-roboto">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="border-gray-300 text-nunito"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-semibold text-roboto">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              className="border-gray-300 text-nunito"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType" className="text-gray-700 font-semibold text-roboto">
              Service Type
            </Label>
            <Select onValueChange={handleSelectChange} value={formData.serviceType}>
              <SelectTrigger id="serviceType" className="border-gray-300 text-nunito">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="">
                {ServiceTypes.map((service) => (
                  <SelectItem key={service} value={service} className="cursor-pointer text-nunito">
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-700 font-semibold text-roboto">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us how we can help you..."
            value={formData.message}
            onChange={handleChange}
            className="border-gray-300  min-h-32 resize-none text-nunito"
          />
        </div>

        <Button
          type="submit"
          className="w-fit bg-gradient-to-r from-teal-500 to-cyan-500 text-nunito hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3  transition-all duration-300 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>

    </div>
  )
}
