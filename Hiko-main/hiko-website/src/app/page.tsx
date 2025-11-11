'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import EmailSignup from '@/components/EmailSignup';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-hiko-green via-[#02685A] to-[#01352F] animate-gradient-shift"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen text-center px-5 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="mb-6"
          >
            <Image
              src="/HikoApp Logo Cream.png"
              alt="Hiko Logo"
              width={360}
              height={120}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 font-montserrat"
          >
            Kia ora – We&apos;re Almost Ready!
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.35 }}
            className="text-lg sm:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed font-source-sans"
          >
            <span className="text-hiko-yellow font-semibold">Hiko</span> is New Zealand&apos;s social hiking platform — 
            connect with others, explore Aotearoa, and share the spirit of adventure.
          </motion.p>

          {/* Email Signup Form */}
          <motion.div
            id="waitlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7 }}
          >
            <EmailSignup />
          </motion.div>

          {/* Instagram Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.1 }}
            className="mt-8 flex items-center justify-center gap-2 text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.3" fill="white"/>
            </svg>
            <a 
              href="https://instagram.com/hiko_nz" 
              target="_blank" 
              rel="noopener"
              className="font-bold hover:underline"
            >
              @hiko_nz
            </a>
          </motion.div>
        </div>
      </div>

      {/* App Preview Section */}
      <div className="relative z-10 bg-hiko-cream py-20 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-hiko-green mb-6 font-montserrat">
              See Hiko in Action
            </h2>
            <p className="text-xl text-hiko-green/80 max-w-3xl mx-auto font-source-sans">
              Experience New Zealand&apos;s trails like never before with our intuitive map interface, 
              real-time weather updates, and comprehensive hut information.
            </p>
          </motion.div>

          {/* App Preview Content */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md">
                <Image
                  src="/Figma Image.png"
                  alt="Hiko App Preview"
                  width={400}
                  height={800}
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Feature List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Interactive Trail Maps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-hiko-green rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-hiko-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-hiko-green mb-2 font-montserrat">
                    Interactive Trail Maps
                  </h3>
                  <p className="text-hiko-green/80 font-source-sans">
                    Navigate New Zealand&apos;s stunning landscapes with detailed topographic maps, 
                    trail markers, and real-time GPS tracking.
                  </p>
                </div>
              </motion.div>

              {/* Hut Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-hiko-green rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-hiko-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
            <div>
                  <h3 className="text-xl font-semibold text-hiko-green mb-2 font-montserrat">
                    Comprehensive Hut Database
                  </h3>
                  <p className="text-hiko-green/80 font-source-sans">
                    Access detailed information about DOC huts, facilities, booking availability, 
                    and user reviews from fellow hikers.
                  </p>
                </div>
              </motion.div>

              {/* Weather Integration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-hiko-green rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-hiko-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
            </div>
            <div>
                  <h3 className="text-xl font-semibold text-hiko-green mb-2 font-montserrat">
                    Real-Time Weather
                  </h3>
                  <p className="text-hiko-green/80 font-source-sans">
                    Stay prepared with live weather updates, forecasts, and trail conditions 
                    to ensure safe and enjoyable adventures.
                  </p>
                </div>
              </motion.div>

              {/* Social Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-hiko-green rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-hiko-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
            </div>
            <div>
                  <h3 className="text-xl font-semibold text-hiko-green mb-2 font-montserrat">
                    Connect with Fellow Hikers
                  </h3>
                  <p className="text-hiko-green/80 font-source-sans">
                    Share experiences, discover new trails, and connect with the hiking community 
                    across Aotearoa New Zealand.
                  </p>
            </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-lg text-hiko-green/80 mb-6 font-source-sans">
              Ready to explore New Zealand&apos;s trails?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('waitlist')?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }}
              className="bg-hiko-green text-hiko-cream px-8 py-4 rounded-full text-lg font-semibold hover:bg-hiko-green/90 transition-colors duration-300 font-montserrat cursor-pointer"
            >
              Join the Waitlist
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
