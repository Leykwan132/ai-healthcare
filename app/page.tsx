"use client";

import { ArrowRight, Shield, Users, Clock, Stethoscope, Heart, Menu, X, Code } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Privacy-Focused",
    description: "Built with healthcare privacy standards in mind during our beta development"
  },
  {
    icon: Users,
    title: "For Healthcare Teams",
    description: "Streamlined workflows for doctors, nurses, and healthcare professionals"
  },
  {
    icon: Clock,
    title: "AI-Powered Assistance",
    description: "Intelligent support for patient care and documentation (Beta Features)"
  }
];

const betaStats = [
  { number: "Beta", label: "Current Version" },
  { number: "Active", label: "Development" },
  { number: "2025", label: "Launch Year" },
  { number: "Open", label: "For Testing" }
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/Vertica.gif" alt="MediBuddyAI" className="h-10 w-10 rounded-full" />
              <span className="ml-2 text-xl font-bold text-gray-900">MediBuddyAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.location.href = "/doctors/dashboard"}
                  className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors font-medium"
                >
                  Doctors
                </button>
                <button
                  onClick={() => window.location.href = "/patients/dashboard"}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Patients
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</a>
                <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600">About</a>
                <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Contact</a>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <button
                    onClick={() => window.location.href = "/doctors/dashboard"}
                    className="w-full text-left px-3 py-2 text-blue-600 font-medium"
                  >
                    Doctor Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = "/patients/dashboard"}
                    className="w-full text-left px-3 py-2 text-purple-600 font-medium"
                  >
                    Patient Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-slow-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-slow-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Beta Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 rounded-full mb-8">
              <Code className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-sm text-orange-800 font-medium">Beta Version - In Active Development</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Healthcare with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> AI Intelligence</span>
            </h1>
            
            {/* Value Proposition */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Explore our beta platform designed to empower healthcare professionals with AI-driven insights and intelligent patient care management.
            </p>

            {/* Dual User Path CTAs */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Doctor Path */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Healthcare Providers</h3>
                <p className="text-gray-600 mb-6">
                  Access clinical tools, patient management, and AI-powered diagnostic assistance.
                </p>
                <button
                  onClick={() => window.location.href = "/doctors/dashboard"}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Doctor Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>

              {/* Patient Path */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-200 hover:border-purple-400 transition-all duration-200 hover:shadow-lg">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Patients</h3>
                <p className="text-gray-600 mb-6">
                  Manage your health records, appointments, and communicate with your healthcare team.
                </p>
                <button
                  onClick={() => window.location.href = "/patients/dashboard"}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Patient Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Beta Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {betaStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Healthcare Professionals Choose MediBuddyAI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for healthcare environments with enterprise-grade security and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore Our Beta Platform?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of healthcare technology. Test our beta features and help us build the next generation of medical AI.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => window.location.href = "/doctors/dashboard"}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
            >
              Try Doctor Portal <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.href = "/patients/dashboard"}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Try Patient Portal <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <img src="/Vertica.gif" alt="MediBuddyAI" className="h-10 w-10 rounded-full" />
                <span className="ml-2 text-xl font-bold">MediBuddyAI</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering healthcare professionals with AI-driven insights and intelligent patient care management.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-semibold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 MediBuddyAI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">HIPAA Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
