'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg shadow-indigo-500/5">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </motion.svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span 
                  className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-heading"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Smart Bin
                </motion.span>
                <motion.p 
                  className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  IoT Waste Management
                </motion.p>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <motion.div 
              className="hidden lg:flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.a 
                href="#features" 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium relative group font-body"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Features
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-indigo-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.a>
              <motion.a 
                href="#how-it-works" 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium relative group font-body"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                How it Works
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-indigo-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.a>
              <motion.a 
                href="#pricing" 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium relative group font-body"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Pricing
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-indigo-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.a>
              <motion.a 
                href="#contact" 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium relative group font-body"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Contact
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-indigo-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.a>
            </motion.div>
            
            {/* Auth Buttons - Desktop */}
            <motion.div 
              className="hidden lg:flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {user ? (
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/dashboard"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg font-heading"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-10 h-10 ring-2 ring-indigo-100 dark:ring-indigo-900 transition-all duration-200',
                          userButtonPopoverCard: 'shadow-xl border-0',
                        },
                      }}
                    />
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SignInButton mode="modal">
                      <button className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-body">
                        Sign In
                      </button>
                    </SignInButton>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SignUpButton mode="modal">
                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg font-heading">
                        Get Started
                      </button>
                    </SignUpButton>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div id="mobile-menu" className="hidden lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium py-2">
                How it Works
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium py-2">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium py-2">
                Contact
              </a>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      href="/dashboard"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <div className="flex justify-center">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: 'w-10 h-10',
                          },
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <SignInButton mode="modal">
                      <button className="w-full text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 shadow-xl border border-indigo-200/50 dark:border-indigo-700/50 backdrop-blur-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Now with AI-powered analytics
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight font-display tracking-tight"
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Smart Waste
            </motion.span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.6 },
                x: { duration: 0.8, delay: 0.6 },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Management
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light font-body"
          >
            Revolutionize your waste management with our intelligent smart bin solution. 
            Track, optimize, and reduce waste with cutting-edge IoT technology and AI analytics.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16 relative"
          >
            {/* Floating Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}></div>
            <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link 
                  href="/dashboard"
                  className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl font-heading block overflow-hidden"
                >
                  <motion.span 
                    className="relative z-10"
                    animate={{ 
                      textShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 10px rgba(255,255,255,0.3)",
                        "0 0 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    Go to Dashboard
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <SignUpButton mode="modal">
                  <button className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl font-heading overflow-hidden">
                    <motion.span 
                      className="relative z-10"
                      animate={{ 
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "0 0 10px rgba(255,255,255,0.3)",
                          "0 0 0px rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      Get Started Free
                    </motion.span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </button>
                </SignUpButton>
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="group relative border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl font-heading backdrop-blur-sm bg-white/10 dark:bg-gray-800/10"
              >
                <motion.span 
                  className="flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v6a2 2 0 002 2h2a2 2 0 002-2v-6" />
                  </motion.svg>
                  Watch Demo
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/20 to-purple-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { 
                number: "2+", 
                label: "Cities Served", 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              { 
                number: "200+", 
                label: "Smart Bins", 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )
              },
              { 
                number: "25%", 
                label: "Cost Reduction", 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                number: "99.9%", 
                label: "Uptime", 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="group text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <motion.div 
                  className="text-indigo-600 dark:text-indigo-400 mb-4 flex justify-center"
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                  animate={{ 
                    filter: [
                      "brightness(1)",
                      "brightness(1.2)",
                      "brightness(1)"
                    ]
                  }}
                  transition={{ 
                    filter: { duration: 2, repeat: Infinity, repeatDelay: 3 + index * 0.5 }
                  }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 font-display"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 1.2 + index * 0.1, 
                    type: "spring", 
                    stiffness: 200 
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    textShadow: "0 0 20px rgba(99, 102, 241, 0.5)"
                  }}
                >
                  {stat.number}
                </motion.div>
                <motion.div 
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 font-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ color: "#6366f1" }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-800 dark:via-slate-700 dark:to-indigo-900/20 py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6 font-body">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-heading">
              Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Smart Bin</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed font-body">
              Discover how our smart bin technology can transform your waste management operations with cutting-edge innovation
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Real-time Monitoring",
                description: "Track fill levels, collection schedules, and optimize routes in real-time with IoT sensors and AI analytics.",
                features: ["Fill level monitoring", "Temperature & humidity tracking", "GPS location services"]
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Gain Points",
                description: "Turn every Action into a Reward  ! Stay Active to Earn Points and Rewards",
                features: ["Qr Code Scan ", "Gain money", "Gain system rewards"]
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Efficient Operations",
                description: "Reduce costs and environmental impact with AI-optimized collection routes and automated scheduling.",
                features: ["Route optimization", "Automated scheduling", "Cost reduction analytics"]
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group bg-white/80 dark:bg-gray-700/80 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-300"
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                  animate={{ 
                    boxShadow: [
                      "0 0 0px rgba(99, 102, 241, 0)",
                      "0 0 30px rgba(99, 102, 241, 0.4)",
                      "0 0 0px rgba(99, 102, 241, 0)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 3, repeat: Infinity, repeatDelay: 2 + index * 0.5 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  whileHover={{ 
                    color: "#6366f1",
                    scale: 1.05
                  }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                >
                  {feature.description}
                </motion.p>
                <motion.ul 
                  className="text-sm text-gray-500 dark:text-gray-400 space-y-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                >
                  {feature.features.map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.2 + i * 0.1 }}
                      whileHover={{ x: 5, color: "#6366f1" }}
                    >
                      <motion.svg 
                        className="w-4 h-4 text-indigo-500 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          repeatDelay: 4 + i * 0.5 
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-indigo-900/30 dark:to-purple-900/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
       
          
       
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Waste Management?
              </span>
            </h2>
            <p className="text-indigo-100 mb-12 max-w-3xl mx-auto text-xl leading-relaxed">
              Join thousands of cities and organizations already using Smart Bin technology to optimize their waste management operations and reduce environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <Link 
                  href="/dashboard"
                  className="group relative bg-white text-indigo-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Go to Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <button className="group relative bg-white text-indigo-600 px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    <span className="relative z-10">Start Free Trial</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </SignUpButton>
              )}
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="group relative border-2 border-white text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v6a2 2 0 002 2h2a2 2 0 002-2v-6" />
                  </svg>
                  Watch Demo
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Smart Bin</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing waste management with intelligent IoT solutions and AI-powered analytics.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Smart Bin. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-6xl mx-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                  title="Smart Bin Demo Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
