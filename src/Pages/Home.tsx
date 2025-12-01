import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
  Star,
  Stethoscope,
  Brain,
  Bone,
  Eye,
  Baby,
  Activity,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  FileText,
  CreditCard,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const auth = await base44.auth.isAuthenticated();
    setIsAuthenticated(auth);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactMessage.create({
      ...contactForm,
      subject: 'Website Enquiry'
    });
    setSubmitting(false);
    setSubmitted(true);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const services = [
    { icon: Stethoscope, title: 'General Surgery', desc: 'Comprehensive surgical procedures with expert care' },
    { icon: Bone, title: 'Orthopaedics', desc: 'Joint replacements, sports injuries & bone health' },
    { icon: Heart, title: 'Cardiology', desc: 'Heart health monitoring and cardiac procedures' },
    { icon: Brain, title: 'Neurology', desc: 'Brain and nervous system specialist care' },
    { icon: Baby, title: 'Paediatrics', desc: 'Dedicated care for children of all ages' },
    { icon: Eye, title: 'Ophthalmology', desc: 'Complete eye care and vision correction' },
  ];

  const features = [
    { icon: Calendar, title: 'Easy Booking', desc: 'Book appointments online 24/7' },
    { icon: FileText, title: 'Digital Records', desc: 'Access your medical history anytime' },
    { icon: MessageCircle, title: 'AI Assistant', desc: 'Get instant health guidance' },
    { icon: CreditCard, title: 'Simple Payments', desc: 'Pay online or via medical aid' },
  ];

  const testimonials = [
    { name: 'Thabo M.', text: 'The staff at MediCare are incredibly caring. My surgery went smoothly and recovery was quick!', rating: 5 },
    { name: 'Priya N.', text: 'Booking online was so easy. The doctors explained everything clearly and I felt completely at ease.', rating: 5 },
    { name: 'Johan V.', text: 'World-class facilities right here in South Africa. Highly recommend for any surgical needs.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MediCare</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-600 hover:text-teal-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-600 hover:text-teal-600 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-teal-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-teal-600 transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    My Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={createPageUrl('BookAppointment')}>
                    <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                      Book Now
                    </Button>
                  </Link>
                  <Button
                    onClick={() => base44.auth.redirectToLogin(createPageUrl('Dashboard'))}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100 p-4"
          >
            <div className="flex flex-col gap-4">
              <a href="#services" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#about" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#testimonials" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <a href="#contact" className="text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              <hr />
              {isAuthenticated ? (
                <Link to={createPageUrl('Dashboard')}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">My Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to={createPageUrl('BookAppointment')}>
                    <Button variant="outline" className="w-full border-teal-600 text-teal-600">Book Now</Button>
                  </Link>
                  <Button
                    onClick={() => base44.auth.redirectToLogin(createPageUrl('Dashboard'))}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
                🏥 Premier Private Healthcare
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health, Our
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600"> Priority</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Experience world-class surgical care at MediCare Private Surgery.
                Our expert team and state-of-the-art facilities ensure the best outcomes for you and your family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('BookAppointment')}>
                  <Button size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-lg px-8 py-6">
                    Book Appointment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="tel:+27123456789">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-gray-300">
                    <Phone className="mr-2 w-5 h-5" />
                    +27 12 345 6789
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-8 mt-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">15+</div>
                  <div className="text-gray-500 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">50+</div>
                  <div className="text-gray-500 text-sm">Expert Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">10k+</div>
                  <div className="text-gray-500 text-sm">Happy Patients</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop&q=80"
                  alt="Medical professionals"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 md:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">HPCSA Registered</div>
                    <div className="text-gray-500 text-sm">All doctors certified</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white">
                <feature.icon className="w-6 h-6 text-teal-200" />
                <div>
                  <div className="font-semibold">{feature.title}</div>
                  <div className="text-teal-200 text-sm hidden sm:block">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-medium">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Comprehensive Medical Care
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From routine check-ups to complex surgeries, our specialists provide exceptional care across all medical disciplines.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                      <service.icon className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={createPageUrl('BookAppointment')}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Book a Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&auto=format&fit=crop&q=80"
                alt="Modern hospital facility"
                className="rounded-3xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-teal-600 font-medium">About MediCare</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Leading Private Healthcare in South Africa
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For over 15 years, MediCare Private Surgery has been at the forefront of private healthcare in South Africa.
                Our state-of-the-art facility combines cutting-edge technology with compassionate care.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'HPCSA registered specialists',
                  'Latest surgical equipment & technology',
                  'All major medical aids accepted',
                  '24/7 emergency services',
                  'Comfortable private recovery suites'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link to={createPageUrl('BookAppointment')}>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Schedule a Visit
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 px-4 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-medium">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              What Our Patients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-teal-600 font-medium">Get in Touch</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions? Our friendly team is here to help. Reach out via phone, email, or fill in the form.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-600">123 Medical Drive, Sandton<br />Johannesburg, 2196</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-600">+27 12 345 6789</div>
                    <div className="text-gray-500 text-sm">Mon-Fri 8am-6pm, Sat 8am-1pm</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@medicare.co.za</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Emergency</div>
                    <div className="text-gray-600">24/7 Emergency Line: +27 12 345 6700</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>

                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h4>
                      <p className="text-gray-600">We'll get back to you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Input
                          placeholder="Your Name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                          className="h-12"
                        />
                        <Input
                          placeholder="Phone Number"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="h-12"
                        />
                      </div>
                      <Textarea
                        placeholder="How can we help you?"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        className="min-h-[120px]"
                      />
                      <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 h-12"
                        disabled={submitting}
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">MediCare</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premier private healthcare in South Africa. Your health, our priority.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#services" className="block hover:text-teal-400 transition-colors">Services</a>
                <a href="#about" className="block hover:text-teal-400 transition-colors">About Us</a>
                <Link to={createPageUrl('BookAppointment')} className="block hover:text-teal-400 transition-colors">Book Appointment</Link>
                <a href="#contact" className="block hover:text-teal-400 transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <div>General Surgery</div>
                <div>Orthopaedics</div>
                <div>Cardiology</div>
                <div>Neurology</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Medical Aids Accepted</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <div>Discovery Health</div>
                <div>Bonitas</div>
                <div>Momentum Health</div>
                <div>GEMS & More</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 MediCare Private Surgery. All rights reserved.</p>
            <p className="p-10 bg-red-500 text-white" >hello</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
