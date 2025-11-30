"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiSave } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminContactPage() {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    github: "",
    linkedin: "",
    twitter: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (data.success) {
        setContactInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo)
      });

      const data = await response.json();
      if (data.success) {
        alert("Contact info updated successfully!");
      } else {
        alert(data.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating contact info:", error);
      alert("Failed to update contact info");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const fields = [
    { key: "email", label: "Email Address", icon: FiMail, type: "email", placeholder: "your.email@example.com" },
    { key: "phone", label: "Phone Number", icon: FiPhone, type: "tel", placeholder: "+1 234 567 8900" },
    { key: "address", label: "Address", icon: FiMapPin, type: "text", placeholder: "Your City, Country" },
    { key: "github", label: "GitHub URL", icon: FiGithub, type: "url", placeholder: "https://github.com/username" },
    { key: "linkedin", label: "LinkedIn URL", icon: FiLinkedin, type: "url", placeholder: "https://linkedin.com/in/username" },
    { key: "twitter", label: "Twitter URL", icon: FiTwitter, type: "url", placeholder: "https://twitter.com/username" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">Contact Information</h1>
          <p className="text-white/60 text-sm sm:text-base">Manage your contact details displayed to visitors</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <FiSave />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-[#27272c] p-4 sm:p-6 lg:p-8 rounded-xl border border-accent/10 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <label className="block mb-2 font-medium flex items-center gap-2 text-sm sm:text-base">
                  <Icon className="text-accent" />
                  {field.label}
                </label>
                <Input
                  type={field.type}
                  value={contactInfo[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-[#27272c] p-4 sm:p-6 lg:p-8 rounded-xl border border-accent/10 shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {fields.map((field, index) => {
            const Icon = field.icon;
            const value = contactInfo[field.key];
            if (!value) return null;
            
            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 p-3 sm:p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="text-accent text-lg sm:text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm text-white/60">{field.label}</div>
                  <div className="font-medium text-sm sm:text-base break-all">{value}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
        {!fields.some(field => contactInfo[field.key]) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/60 py-8 text-sm sm:text-base"
          >
            Fill in the form above to see a preview
          </motion.p>
        )}
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="bg-blue-500/10 border border-blue-500/30 p-3 sm:p-4 rounded-lg"
      >
        <p className="text-xs sm:text-sm text-blue-400">
          💡 <strong>Tip:</strong> These contact details will be displayed on your public contact page.
          Make sure all URLs are complete and accurate.
        </p>
      </motion.div>
    </motion.div>
  );
}
