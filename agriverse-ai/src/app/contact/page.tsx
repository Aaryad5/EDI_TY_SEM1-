"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const FAQS = [
  {
    q: "Can I use AgriVerse AI without IoT hardware or sensors?",
    a: "Yes, absolutely! AgriVerse AI works completely with manual soil test reports and automated satellite and weather data feeds. Physical IoT probes are purely optional enhancements.",
  },
  {
    q: "Is AgriVerse AI free for smallholder farmers?",
    a: "Yes. Our core recommendation engine, 7-day weather intelligence, and digital twin simulation tools are 100% free for individual farmers.",
  },
  {
    q: "How accurate are the crop recommendations for my region?",
    a: "Our models achieve over 93% accuracy by synthesizing local soil characteristics, 30-year precipitation histories, and seasonal temperature variations.",
  },
  {
    q: "How do I connect my soil test card from a government lab?",
    a: "When adding your farm data, simply enter the values for pH, N, P, and K directly from your Soil Health Card, or choose 'Auto-fill from Regional Soil Grids' if you don't have a lab report yet.",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    subject: "General Inquiry",
    message: "",
  });
  const [sending, setSending] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate network submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSending(false);
    setSubmitted(true);
    toast({
      variant: "success",
      title: "Inquiry Received",
      description: "Thank you! Our agronomy advisory team will respond within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <PublicNavbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="border-b border-agri/10 bg-gradient-to-b from-fresh/10 via-cream to-cream py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-agri/20 bg-white/80 px-3.5 py-1 text-xs font-semibold text-agri backdrop-blur mb-4">
              <MessageSquare className="h-3.5 w-3.5 text-agri" />
              Agronomy Support & Research Inquiries
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark sm:text-5xl md:text-6xl">
              We're Here to Help Your <span className="text-agri">Farm Thrive</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-dark/70 sm:text-lg">
              Have questions about sensor integration, crop suitability models, or enterprise FPO partnerships?
              Reach out to our field engineering and agronomy team.
            </p>
          </div>
        </section>

        {/* Form and Info Section */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <Card className="border border-agri/15 bg-white shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-dark">Send Us a Message</h2>
                    <p className="mt-1 text-xs text-dark/60">
                      Fill in the details below and our agronomists will review your request.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="rounded-2xl border border-agri/20 bg-fresh/10 p-8 text-center space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold text-dark">Message Dispatched Successfully</h3>
                      <p className="text-sm text-dark/70 max-w-md mx-auto">
                        Your inquiry has been routed to our regional field team. Expect an email or WhatsApp follow-up within one business day.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", location: "", subject: "General Inquiry", message: "" });
                        }}
                      >
                        Send Another Inquiry
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="name" className="text-xs font-semibold text-dark">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            required
                            placeholder="e.g. Ramesh Patil"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-cream/40"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-semibold text-dark">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="ramesh@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-cream/40"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-semibold text-dark">
                            Phone / WhatsApp
                          </Label>
                          <Input
                            id="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-cream/40"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="location" className="text-xs font-semibold text-dark">
                            Farm Location / District
                          </Label>
                          <Input
                            id="location"
                            placeholder="e.g. Pune, Maharashtra"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="bg-cream/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="subject" className="text-xs font-semibold text-dark">
                          Inquiry Type
                        </Label>
                        <select
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full rounded-md border border-input bg-cream/40 px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-agri"
                        >
                          <option value="General Inquiry">General Platform Inquiry</option>
                          <option value="IoT Sensor Setup">IoT Sensor & Probe Connectivity</option>
                          <option value="Agronomic Advice">Crop & Soil Recommendation Clarification</option>
                          <option value="Research & Academic">University Research Collaboration</option>
                          <option value="FPO & Government">FPO & Cooperative Deployment</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message" className="text-xs font-semibold text-dark">
                          Your Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          required
                          rows={4}
                          placeholder="Tell us about your farm, crop goals, or questions..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-cream/40 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={sending}
                        className="w-full justify-center"
                      >
                        {sending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending inquiry...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Inquiry
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-agri/15 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-dark">Contact Information</h3>

                <div className="flex items-start gap-3.5 text-sm">
                  <div className="rounded-xl bg-fresh/20 p-2.5 text-forest shrink-0">
                    <MapPin className="h-5 w-5 text-agri" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Agronomy Center & Labs</p>
                    <p className="text-xs text-dark/70 mt-0.5">
                      AgriVerse Precision Labs, Shivaji Nagar, Pune, Maharashtra 411005, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <div className="rounded-xl bg-fresh/20 p-2.5 text-forest shrink-0">
                    <Phone className="h-5 w-5 text-agri" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Farmer Helpline (Toll-Free)</p>
                    <p className="text-xs text-dark/70 mt-0.5">+91 1800 572 4900 (Mon–Sat)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <div className="rounded-xl bg-fresh/20 p-2.5 text-forest shrink-0">
                    <Mail className="h-5 w-5 text-agri" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Electronic Mail</p>
                    <p className="text-xs text-dark/70 mt-0.5">support@agriverse.ai / research@agriverse.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <div className="rounded-xl bg-fresh/20 p-2.5 text-forest shrink-0">
                    <Clock className="h-5 w-5 text-agri" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Advisory Hours</p>
                    <p className="text-xs text-dark/70 mt-0.5">Monday to Saturday: 8:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>

              {/* Quick FAQ Mini Card */}
              <div className="rounded-2xl border border-agri/15 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-agri" />
                  <h3 className="text-base font-bold text-dark">Quick Answers</h3>
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-agri/10 bg-cream/30 p-3">
                      <p className="text-xs font-bold text-dark">{faq.q}</p>
                      <p className="mt-1 text-xs text-dark/70 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
