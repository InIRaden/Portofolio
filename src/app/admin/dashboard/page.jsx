"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiBriefcase, FiFileText, FiMail, FiUpload, FiBarChart2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    resumeItems: 0,
    cvUploaded: false,
    statsCount: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, statsRes, cvRes, resumeRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/stats"),
        fetch("/api/cv"),
        fetch("/api/resume")
      ]);
      
      const projectsData = await projectsRes.json();
      const statsData = await statsRes.json();
      const cvData = await cvRes.json();
      const resumeData = await resumeRes.json();
      
      let totalResumeItems = 0;
      if (resumeData.success && resumeData.data) {
        totalResumeItems = (resumeData.data.about?.length || 0) + 
                          (resumeData.data.experience?.length || 0) + 
                          (resumeData.data.education?.length || 0) + 
                          (resumeData.data.skills?.length || 0);
      }
      
      setStats({
        projects: projectsData.success ? projectsData.data.length : 0,
        resumeItems: totalResumeItems,
        cvUploaded: cvData.success && cvData.data ? true : false,
        statsCount: statsData.success ? statsData.data.length : 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const cards = [
    {
      title: "Projects",
      count: stats.projects,
      icon: FiBriefcase,
      link: "/admin/projects",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Resume Items",
      count: stats.resumeItems,
      icon: FiFileText,
      link: "/admin/resume",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Statistics",
      count: stats.statsCount,
      icon: FiBarChart2,
      link: "/admin/stats",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Contact Info",
      count: "6",
      icon: FiMail,
      link: "/admin/contact",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "CV Upload",
      count: stats.cvUploaded ? "✓" : "✗",
      icon: FiUpload,
      link: "/admin/resume",
      color: "from-orange-500 to-red-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/60 text-sm sm:text-base">Welcome back! Manage your portfolio content here.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={card.link}>
                <div className="bg-[#27272c] p-5 sm:p-6 rounded-xl hover:bg-[#2a2a2f] transition-all cursor-pointer border border-accent/10 hover:border-accent/30 shadow-lg hover:shadow-accent/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="text-white text-lg sm:text-xl" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold">{card.count}</div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">{card.title}</h3>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-[#27272c] p-5 sm:p-6 rounded-xl border border-accent/10 shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link href="/admin/projects">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full" variant="outline">
                <FiBriefcase className="mr-2" />
                <span className="hidden sm:inline">Manage Projects</span>
                <span className="sm:hidden">Projects</span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/admin/resume">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full" variant="outline">
                <FiFileText className="mr-2" />
                <span className="hidden sm:inline">Update Resume</span>
                <span className="sm:hidden">Resume</span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/admin/stats">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full" variant="outline">
                <FiBarChart2 className="mr-2" />
                <span className="hidden sm:inline">Update Stats</span>
                <span className="sm:hidden">Stats</span>
              </Button>
            </motion.div>
          </Link>
          <Link href="/admin/contact">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full" variant="outline">
                <FiMail className="mr-2" />
                <span className="hidden sm:inline">Update Contact</span>
                <span className="sm:hidden">Contact</span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-[#27272c] p-5 sm:p-6 rounded-xl border border-accent/10 shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Add Your Projects", desc: "Showcase your best work in the Projects section" },
            { title: "Update Statistics", desc: "Keep your homepage stats current and accurate" },
            { title: "Update Resume", desc: "Keep your experience and skills up to date" },
            { title: "Set Contact Info", desc: "Make sure your contact details are correct" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-start gap-3 p-3 sm:p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base">{item.title}</h4>
                <p className="text-xs sm:text-sm text-white/60">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
