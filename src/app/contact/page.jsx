"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkedAlt,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
    github: "",
    linkedin: "",
    twitter: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch("/api/contact");
      const result = await response.json();

      if (result.success) {
        setContactInfo(result.data);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = "6285880760901";
    const message = encodeURIComponent("Halo! Saya tertarik untuk berdiskusi tentang project.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const info = [
    {
      icon: <FaPhoneAlt />,
      title: "Phone",
      description: contactInfo.phone || "Loading...",
      link: `tel:${contactInfo.phone}`,
      color: "text-blue-500",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      description: contactInfo.email || "Loading...",
      link: `mailto:${contactInfo.email}`,
      color: "text-red-500",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Address",
      description: contactInfo.address || "Loading...",
      color: "text-green-500",
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      name: "GitHub",
      url: contactInfo.github,
      color: "hover:text-purple-500",
    },
    {
      icon: <FaLinkedin />,
      name: "LinkedIn",
      url: contactInfo.linkedin,
      color: "hover:text-blue-500",
    },
    {
      icon: <FaTwitter />,
      name: "Twitter",
      url: contactInfo.twitter,
      color: "hover:text-sky-500",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          {/* WhatsApp CTA Card */}
          <div className="xl:w-[54%] order-2 xl:order-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-6 p-8 sm:p-12 bg-gradient-to-br from-[#27272c] to-[#1a1a1f] rounded-2xl border border-white/5 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mx-auto"
                >
                  <FaWhatsapp className="text-5xl text-green-500" />
                </motion.div>
                
                <h2 className="text-4xl sm:text-5xl font-bold text-white">
                  Mari Bekerja Sama!
                </h2>
                
                <p className="text-lg text-white/70 max-w-md mx-auto leading-relaxed">
                  Punya project menarik atau ingin berdiskusi? 
                  <span className="block mt-2 text-accent font-semibold">
                    Hubungi saya langsung via WhatsApp!
                  </span>
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                {[
                  { icon: "⚡", text: "Respon Cepat" },
                  { icon: "💬", text: "Chat Langsung" },
                  { icon: "🚀", text: "Mulai Project" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="text-sm text-white/80 font-medium">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-4"
              >
                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="w-full h-16 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
                >
                  <FaWhatsapp className="text-2xl mr-3" />
                  Chat via WhatsApp
                  <span className="ml-auto text-2xl">→</span>
                </Button>
                
                <p className="text-center text-xs text-white/40">
                  Available 24/7 • Fast Response • Professional Service
                </p>
              </motion.div>

              {/* Testimonial or Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 p-6 bg-accent/5 border border-accent/20 rounded-xl"
              >
                <p className="text-sm text-white/60 italic text-center">
                  "Saya siap membantu mewujudkan ide digital Anda menjadi kenyataan. 
                  Mari diskusikan project Anda sekarang!"
                </p>
                <p className="text-center mt-3 text-accent font-semibold text-sm">
                  - Raden Mahesa
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="flex-1 flex flex-col gap-6 order-1 xl:order-none">
            {/* Contact Cards */}
            <div className="space-y-4">
              {info.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  {item.link && !item.link.includes("undefined") ? (
                    <a
                      href={item.link}
                      className="flex items-center gap-4 p-6 bg-[#27272c] rounded-xl hover:bg-[#2a2a2f] transition-all border border-white/5 hover:border-accent/30 cursor-pointer"
                    >
                      <div className={`w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center ${item.color} text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm text-white/60 mb-1">{item.title}</h4>
                        <p className="text-base font-semibold text-white/90 break-words group-hover:text-accent transition-colors">
                          {item.description}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-6 bg-[#27272c] rounded-xl border border-white/5">
                      <div className={`w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center ${item.color} text-2xl flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm text-white/60 mb-1">{item.title}</h4>
                        <p className="text-base font-semibold text-white/90 break-words">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-[#27272c] rounded-xl border border-white/5"
            >
              <h4 className="text-lg font-semibold text-white mb-4 text-center">
                Connect With Me
              </h4>
              <div className="flex justify-center gap-4">
                {socialLinks.map((social, index) => (
                  social.url && !social.url.includes("yourusername") ? (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-xl text-white/60 hover:bg-accent/10 transition-all ${social.color} hover:scale-110`}
                      title={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ) : null
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
