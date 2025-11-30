"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFile, FiTrash2, FiDownload } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function AdminResumePage() {
  const [cv, setCV] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const response = await fetch("/api/cv");
      const data = await response.json();
      
      if (data.success) setCV(data.data);
    } catch (error) {
      console.error("Error fetching CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setCV(result.data);
        alert("CV berhasil diupload!");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Gagal mengupload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleCVDelete = async () => {
    if (!confirm("Hapus CV ini?")) return;

    try {
      const response = await fetch(`/api/cv?id=${cv.id}`, { method: "DELETE" });
      const result = await response.json();
      
      if (result.success) {
        setCV(null);
        alert("CV berhasil dihapus!");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      alert("Gagal menghapus CV");
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center gap-4"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
        <div className="text-xl text-white/60">Loading CV...</div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">📄 CV Upload</h1>
        <p className="text-white/60 text-sm sm:text-base">Upload dan kelola CV Anda untuk ditampilkan di website</p>
      </motion.div>

      {/* CV Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-[#27272c] rounded-xl shadow-xl p-6 sm:p-8 border border-accent/10"
      >
        {cv ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-accent/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">CV Aktif</h2>
            </div>

            <div className="bg-[#232329] border border-accent/10 rounded-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FiFile className="text-3xl sm:text-4xl text-accent" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white break-all">{cv.file_name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      <span>Uploaded: {new Date(cv.uploaded_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Format: PDF</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-accent/10">
                <motion.a
                  href={cv.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="w-full h-12 text-base">
                    <FiDownload className="mr-2 text-lg" />
                    Preview & Download
                  </Button>
                </motion.a>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button 
                    variant="destructive" 
                    onClick={handleCVDelete} 
                    className="w-full h-12 text-base"
                  >
                    <FiTrash2 className="mr-2 text-lg" />
                    Hapus CV
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-blue-400 text-xl flex-shrink-0">ℹ️</div>
                <div className="text-sm text-blue-300">
                  <p className="font-semibold mb-1">Informasi CV</p>
                  <p className="text-blue-200/80">CV ini akan ditampilkan di halaman home dan dapat didownload oleh pengunjung website.</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-accent/20">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Belum Ada CV</h2>
            </div>

            <div className="border-2 border-dashed border-accent/30 rounded-xl p-12 sm:p-16 text-center bg-[#232329] hover:border-accent/50 transition-all">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6"
              >
                <FiUpload className="w-16 h-16 sm:w-20 sm:h-20 text-accent/60 mx-auto" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Upload CV Anda</h3>
              <p className="text-white/60 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Upload file CV dalam format PDF agar dapat ditampilkan dan didownload oleh pengunjung website
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCVUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    disabled={uploading} 
                    size="lg"
                    className="h-12 px-8 text-base"
                    asChild
                  >
                    <span className="cursor-pointer">
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2 text-lg" />
                          Pilih File PDF
                        </>
                      )}
                    </span>
                  </Button>
                </motion.div>
              </label>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-yellow-400 text-xl flex-shrink-0">⚠️</div>
                <div className="text-sm text-yellow-300">
                  <p className="font-semibold mb-1">Perhatian</p>
                  <ul className="text-yellow-200/80 space-y-1 list-disc list-inside">
                    <li>Hanya file PDF yang diperbolehkan</li>
                    <li>Ukuran maksimal 5MB</li>
                    <li>Pastikan CV berisi informasi terbaru Anda</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
