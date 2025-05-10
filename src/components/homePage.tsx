// app/page.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiActivity,
  FiGrid,
  FiLayers,
  FiShield,
} from "react-icons/fi";
import sensorWatchIcon from "../sensorWatchIcon.png";

export default function HomePage() {
  const { status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const isAuthenticated = status === "authenticated";

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  const pulseAnimation = {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.85, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const fadeInDelay = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut",
      },
    },
  });

  const features = [
    {
      title: "Real-time Monitoring",
      description:
        "View sensor data in real-time with dynamic updates and notifications",
      icon: <FiActivity className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Advanced Analytics",
      description:
        "Gain insights with comprehensive data analysis and visualization tools",
      icon: <FiBarChart2 className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Multi-sensor Support",
      description:
        "Connect and monitor all your IoT sensors from a single dashboard",
      icon: <FiGrid className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Data Integration",
      description:
        "Seamlessly integrate with existing systems and export data in multiple formats",
      icon: <FiLayers className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Secure Connection",
      description:
        "End-to-end encryption ensures your sensor data remains private and secure",
      icon: <FiShield className="h-6 w-6 text-indigo-600" />,
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white" />

        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {isLoaded && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
                className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-300"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-40 -left-32 h-64 w-64 rounded-full bg-blue-300"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.07 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute bottom-0 right-20 h-80 w-80 rounded-full bg-purple-300"
              />
            </>
          )}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <motion.div
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={staggerContainer}
                className="mt-4"
              >
                <motion.h1
                  variants={fadeInUp}
                  className="text-3xl font-extrabold tracking-tight text-gray-900 flex   sm:text-4xl md:text-5xl"
                >
                  <span >Welcome to </span>
                  <span className="block text-indigo-600 ml-3"> SensorWatch</span>
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="mt-6 text-lg text-gray-500"
                >
                  Monitor, analyze, and optimize your sensor network with our
                  advanced dashboard. Get real-time data visualization and
                  insights in one powerful platform.
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:mt-12"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={isAuthenticated ? "/dashboard" : "/auth/login"}>
                      <div className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:w-auto">
                        {isAuthenticated
                          ? "Go to Dashboard"
                          : "Sign in to Dashboard"}
                        <FiArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    </Link>
                  </motion.div>
                  {!isAuthenticated && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/auth/signup">
                        <div className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-gray-50 sm:w-auto">
                          Create an account
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
            <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
              <motion.div
                variants={floatAnimation}
                initial="initial"
                animate={isLoaded ? "animate" : "initial"}
                className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md"
              >
                <motion.div
                  variants={pulseAnimation}
                  initial="initial"
                  animate={isLoaded ? "animate" : "initial"}
                  className="relative block w-full overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-16 w-16 relative mr-2 flex">
                          <Image
                            src={sensorWatchIcon}
                            alt="SensorWatch Logo"
                            width={100}
                            height={100}
                            className="object-contain"
                          />
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          SensorWatch Dashboard
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-400"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                        <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Dashboard preview elements */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-indigo-50 p-3">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            Temperature
                          </div>
                          <div className="flex items-end justify-between">
                            <div className="text-xl font-bold text-indigo-700">
                              24.5°C
                            </div>
                            <div className="h-10 w-16 bg-gradient-to-t from-indigo-500 to-blue-400"></div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3">
                          <div className="mb-1 text-xs font-medium text-gray-500">
                            Humidity
                          </div>
                          <div className="flex items-end justify-between">
                            <div className="text-xl font-bold text-green-700">
                              67%
                            </div>
                            <div className="h-10 w-16 bg-gradient-to-t from-green-500 to-green-400"></div>
                          </div>
                        </div>
                      </div>

                      <div className="h-20 rounded-lg bg-gray-100 p-2">
                        <div className="flex h-full items-end space-x-1">
                          <div className="h-30% w-full animate-pulse bg-indigo-400"></div>
                          <div className="h-50% w-full animate-pulse bg-indigo-500"></div>
                          <div className="h-70% w-full animate-pulse bg-indigo-600"></div>
                          <div className="h-40% w-full animate-pulse bg-indigo-500"></div>
                          <div className="h-60% w-full animate-pulse bg-indigo-600"></div>
                          <div className="h-80% w-full animate-pulse bg-indigo-700"></div>
                          <div className="h-50% w-full animate-pulse bg-indigo-500"></div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-purple-50 p-3">
                        <div className="mb-1 text-xs font-medium text-gray-500">
                          Status
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                          <div className="text-sm font-medium text-gray-700">
                            All systems operational
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="lg:text-center"
          >
            <motion.p
              variants={fadeInDelay(0.2)}
              className="text-base font-semibold uppercase tracking-wide text-indigo-600"
            >
              Advanced Features
            </motion.p>
            <motion.h2
              variants={fadeInDelay(0.4)}
              className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl"
            >
              Everything you need for sensor monitoring
            </motion.h2>
            <motion.p
              variants={fadeInDelay(0.6)}
              className="mx-auto mt-4 max-w-2xl text-xl text-gray-500"
            >
              SensorWatch provides comprehensive tools to monitor, analyze, and
              optimize your entire sensor network
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mt-16"
          >
            <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInDelay(0.3 + index * 0.2)}
                  whileHover={{ y: -5 }}
                  className="relative rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <dt>
                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                      {feature.title}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-50">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-indigo-600">
                Access your SensorWatch dashboard now
              </span>
            </h2>
            <p className="mt-4 max-w-md text-lg text-gray-500">
              Start monitoring your sensors in real-time and unlock the full
              potential of your data
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          >
            <div className="inline-flex rounded-md shadow">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={isAuthenticated ? "/dashboard" : "/auth/login"}>
                  <div className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  </div>
                </Link>
              </motion.div>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="#features">
                  <div className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50">
                    Learn more
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
