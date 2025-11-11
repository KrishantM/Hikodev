'use client';

import { motion } from 'framer-motion';
import { Users, MapPin, Heart, Shield, Target, Zap, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  const [activeFounder, setActiveFounder] = useState('noah');

  return (
    <div className="min-h-screen bg-hiko-cream">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hiko-green mb-6 font-nunito">
              About <span className="text-hiko-yellow">Hiko</span>
            </h1>
            <p className="text-xl sm:text-2xl text-hiko-green max-w-3xl mx-auto leading-relaxed font-open-sans">
              For the spirit of adventure and the joy of the trail
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-16 border border-hiko-green/20"
          >
            <div className="text-center">
              <Image
                src="/HikoApp Logo Forest Green.png"
                alt="Hiko Logo"
                width={200}
                height={200}
                className="mx-auto mb-3"
                priority
              />
              <h2 className="text-3xl sm:text-4xl font-bold text-hiko-green mb-6 font-nunito">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-hiko-green leading-relaxed max-w-4xl mx-auto font-open-sans">
                Hiko&apos;s mission is to inspire and connect people through hiking, making outdoor exploration 
                safe, social, and rewarding. We aim to help users discover trails, track progress, share 
                experiences, and enjoy the journey with friends, all while promoting health, adventure, 
                and a deeper connection with New Zealand&apos;s natural landscapes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-hiko-green">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-hiko-cream mb-6 font-nunito">
              Meet Our Founders
            </h2>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-hiko-cream/20 rounded-full p-1">
              <button
                onClick={() => setActiveFounder('noah')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 font-open-sans ${
                  activeFounder === 'noah'
                    ? 'bg-hiko-cream text-hiko-green'
                    : 'text-hiko-cream hover:text-hiko-yellow'
                }`}
              >
                Noah Saunders
              </button>
              <button
                onClick={() => setActiveFounder('krishant')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 font-open-sans ${
                  activeFounder === 'krishant'
                    ? 'bg-hiko-cream text-hiko-green'
                    : 'text-hiko-cream hover:text-hiko-yellow'
                }`}
              >
                Krishant Maharaj
              </button>
            </div>
          </motion.div>

          {/* Founder Content */}
          <motion.div
            key={activeFounder}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-hiko-cream rounded-2xl p-8 sm:p-12 border border-hiko-yellow/30"
          >
            {activeFounder === 'noah' ? (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-hiko-green mb-4 font-nunito">
                    Kia Ora, I&apos;m Noah Saunders
                  </h3>
                  <p className="text-lg text-hiko-green mb-6 leading-relaxed font-open-sans">
                    I am the founder of Hiko, a social hiking platform designed specifically for New Zealand. 
                    With over 1.3 million New Zealanders (39% of the population) hiking annually, Hiko aims 
                    to make hiking safe, social, engaging, and accessible for everyone.
                  </p>
                  <p className="text-lg text-hiko-green mb-6 leading-relaxed font-open-sans">
                    As a BCom student and TA at University of Auckland, majoring in Business Analytics and 
                    Information Systems, I bring experience in app ideation, product planning, and outdoor 
                    recreation to this venture.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-hiko-green text-hiko-cream px-4 py-2 rounded-full text-sm font-medium font-open-sans">
                      BCom Student
                    </span>
                    <span className="bg-hiko-yellow text-hiko-green px-4 py-2 rounded-full text-sm font-medium font-open-sans">
                      Teaching Assistant
                    </span>
                    <span className="bg-hiko-green text-hiko-cream px-4 py-2 rounded-full text-sm font-medium font-open-sans">
                      Business Analytics
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-hiko-green rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-hiko-cream" />
                  </div>
                  <p className="text-hiko-green font-open-sans italic">
                    &quot;Building connections through adventure&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-hiko-green mb-4 font-nunito">
                    Kia Ora, I&apos;m Krishant Maharaj
                  </h3>
                  <p className="text-lg text-hiko-green mb-6 leading-relaxed font-open-sans">
                    I am the co-founder of Hiko, a platform designed to make hiking in New Zealand simple, 
                    social, and connected. With over a million Kiwis hiking each year, Hiko brings everything 
                    into one place — from discovering tracks to sharing experiences.
                  </p>
                  <p className="text-lg text-hiko-green mb-6 leading-relaxed font-open-sans">
                    I&apos;m in my final semester of a BCom at the University of Auckland, majoring in Business 
                    Analytics and Information Systems, and work as a Teaching Assistant for two courses. 
                    I&apos;m also the founder of Gradual, a career platform for students and graduates, and will 
                    be joining PwC as a Digital Strategy and Architecture Consultant in 2026.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-hiko-green text-hiko-cream px-4 py-2 rounded-full text-sm font-medium font-open-sans">
                      BCom Student
                    </span>
                    <span className="bg-hiko-yellow text-hiko-green px-4 py-2 rounded-full text-sm font-medium font-open-sans">
                      Digital Strategy
                    </span>
                    <span className="bg-hiko-green text-hiko-cream px-4 py-2 rounded-full text-sm font-medium font-open-sans">
                      Entrepreneur
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-hiko-green rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-16 h-16 text-hiko-cream" />
                  </div>
                  <p className="text-hiko-green font-open-sans italic">
                    &quot;Connecting technology with adventure&quot;
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-hiko-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-hiko-green mb-6 font-nunito">
              Platform Features
            </h2>
            <p className="text-lg text-hiko-green max-w-3xl mx-auto font-open-sans">
              Hiko centralizes trail information, weather forecasts, driving directions, 
              social planning, and booking resources while incorporating personalized social gamification.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: MapPin,
                title: "Trail Discovery",
                description: "Comprehensive trail information with distance, elevation, difficulty, and user reviews"
              },
              {
                icon: Shield,
                title: "Safety First",
                description: "Real-time weather forecasts, hazard alerts, and emergency information"
              },
              {
                icon: Users,
                title: "Social Planning",
                description: "Plan trips with friends, track group activities, and build hiking communities"
              },
              {
                icon: Target,
                title: "Gamification",
                description: "Track performance, earn achievements, and compete on leaderboards"
              },
              {
                icon: Heart,
                title: "Health & Wellness",
                description: "Monitor hiking progress, set goals, and celebrate milestones"
              },
              {
                icon: Globe,
                title: "NZ Focused",
                description: "Designed specifically for New Zealand's unique landscapes and hiking culture"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-hiko-green/20"
              >
                <feature.icon className="w-12 h-12 text-hiko-green mb-4" />
                <h3 className="text-xl font-semibold text-hiko-green mb-3 font-nunito">
                  {feature.title}
                </h3>
                <p className="text-hiko-green leading-relaxed font-open-sans">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-hiko-green">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Zap className="w-16 h-16 text-hiko-yellow mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-hiko-cream mb-6 font-nunito">
              Our Vision
            </h2>
            <p className="text-lg sm:text-xl text-hiko-cream leading-relaxed max-w-4xl mx-auto mb-8 font-open-sans">
              Our vision is to establish Hiko as the leading digital platform for hiking in New Zealand, 
              combining convenience, safety, and social engagement. The platform is scalable, adaptable, 
              and future-proof, with potential for expansion into tourism, adventure sports, and international markets.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-hiko-yellow mb-2 font-nunito">1.3M+</div>
                <div className="text-hiko-cream font-open-sans">New Zealanders hiking annually</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-hiko-yellow mb-2 font-nunito">39%</div>
                <div className="text-hiko-cream font-open-sans">Of population actively hiking</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-hiko-yellow mb-2 font-nunito">1000+</div>
                <div className="text-hiko-cream font-open-sans">Trails to discover and explore</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-hiko-yellow">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-hiko-green mb-6 font-nunito">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-hiko-green mb-8 leading-relaxed font-open-sans">
              Join the Hiko community and discover the beauty of New Zealand&apos;s trails 
              while connecting with fellow adventurers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-hiko-green text-hiko-cream px-8 py-3 rounded-full font-semibold hover:bg-hiko-cream hover:text-hiko-green hover:border-2 hover:border-hiko-green transition-colors duration-300 font-open-sans text-center"
              >
                Get Early Access
              </Link>
              <button className="border-2 border-hiko-green text-hiko-green px-8 py-3 rounded-full font-semibold hover:bg-hiko-green hover:text-hiko-cream transition-colors duration-300 font-open-sans">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
