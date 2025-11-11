'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-hiko-cream">
      {/* Main Content Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/HikoApp Logo Forest Green.png"
              alt="Hiko Logo"
              width={180}
              height={180}
              className="mx-auto"
              priority
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hiko-green mb-6 font-montserrat"
          >
            We&apos;re Building Something Amazing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-hiko-green mb-12 leading-relaxed font-source-sans"
          >
            Hiko is currently in development. We&apos;re working hard to bring you the best 
            social hiking platform for New Zealand.
          </motion.p>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-hiko-green rounded-2xl p-8 sm:p-10 text-center shadow-2xl mb-12"
          >
            <div className="flex justify-center mb-5">
              <div className="bg-hiko-yellow rounded-full p-3">
                <Calendar className="w-8 h-8 text-hiko-green" />
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-hiko-cream mb-4 font-montserrat">
              Coming Early January 2026
            </h2>
            
            <p className="text-base sm:text-lg text-hiko-cream/90 mb-5 leading-relaxed font-source-sans max-w-2xl mx-auto">
              We&apos;re putting the finishing touches on Hiko and can&apos;t wait to share it with you. 
              Expect the full launch in early January 2026.
            </p>

            <div className="flex items-center justify-center gap-2 text-hiko-yellow font-semibold text-base font-source-sans">
              <Clock className="w-4 h-4" />
              <span>Stay tuned for updates</span>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-6"
          >
            <p className="text-lg text-hiko-green font-source-sans">
              Be among the first to experience Hiko when we launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/#waitlist"
                className="bg-hiko-green text-hiko-cream px-8 py-3 rounded-full font-semibold hover:bg-hiko-green/90 transition-colors duration-300 font-source-sans text-center"
              >
                Join the Waitlist
              </Link>
              <Link 
                href="/"
                className="border-2 border-hiko-green text-hiko-green px-8 py-3 rounded-full font-semibold hover:bg-hiko-green hover:text-hiko-cream transition-colors duration-300 font-source-sans text-center"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

