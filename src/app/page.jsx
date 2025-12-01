"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";

// components
import Social from "@/components/Social";
import Photo from "@/components/Photo";
import Stats from "@/components/Stats";

const Home = () => {
  const [cvData, setCvData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const response = await fetch("/api/cv");
      const data = await response.json();
      if (data.success && data.data) {
        setCvData(data.data);
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
    }
  };

  const handleDownloadCV = async () => {
    if (!cvData) {
      alert("CV belum tersedia untuk didownload");
      return;
    }

    setDownloading(true);
    try {
      // Direct download from Supabase URL
      const link = document.createElement('a');
      link.href = cvData.file_path;
      link.download = cvData.file_name || 'CV_Raden_Mahesa.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Gagal mendownload CV");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section>
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
          {/* text */}
          <div className="text-center xl:text-left order-2 xl:order-none">
            <span className="text-xl">Software Developer</span>
            <h1 className="h1 mb-6">
              Hello, i'm <br />
              <span className="text-gradient bg-gradient-to-r from-yellow-500 to-cyan-500 bg-clip-text text-transparent">
                Raden Mahesa
              </span>
            </h1>
            <p className="max-w-[500px] mb-9 text-white/80">
              I am a beginner in the field of Software Engineering, and although
              I have no previous work experience, I am very enthusiastic to
              learn and grow in this industry. I have a strong knowledge base in
              programming and always strive to improve my technical skills
              through personal projects as well as the trainings I take part in.
            </p>

            {/* btn and socials */}
            <div className="flex flex-col xl:flex-row items-center gap-8">
              <Button
                variant="outline"
                size="lg"
                className="uppercase flex items-center gap-2"
                onClick={handleDownloadCV}
                disabled={!cvData || downloading}
              >
                <span>{downloading ? "Downloading..." : "Download CV"}</span>
                <FiDownload className="text-xl" />
              </Button>
              <div className="mb-8 xl:mb-0">
                <Social
                  containerStyles="flex gap-6"
                  iconStyles="w-9 h-9 border border-white rounded-full flex justify-center items-center text-white text-base hover:bg-white hover:text-primary hover:transition-all duration-500"
                />
              </div>
            </div>
          </div>
          {/* photo */}
          <div className="order-1 xl:order-none mb-8 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
      <Stats />
    </section>
  );
};

export default Home;
