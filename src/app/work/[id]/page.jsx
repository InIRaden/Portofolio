"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowUpRight, BsGithub, BsArrowLeft } from "react-icons/bs";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage({ params }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setProject(data.data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-2xl">Project not found</div>
        <Link href="/work">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }}
      className="min-h-screen py-12"
    >
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/work">
          <Button variant="outline" className="mb-8 flex items-center gap-2">
            <BsArrowLeft /> Back to Projects
          </Button>
        </Link>

        <div className="grid xl:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            {project.image ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#232329]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-[#232329] flex items-center justify-center">
                <p className="text-white/60">No image available</p>
              </div>
            )}

            {/* Tech Stack */}
            {project.stack && project.stack.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {project.stack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            {/* Category Badge */}
            <div className="inline-block mb-4">
              <span className="bg-accent text-primary px-4 py-1 rounded-full text-sm font-semibold uppercase">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl xl:text-5xl font-bold mb-6">{project.title}</h1>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">About This Project</h3>
              <p className="text-white/60 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Project Info */}
            <div className="bg-[#232329] rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Project Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/60">Category</span>
                  <span className="font-medium capitalize">{project.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-white/60">Created</span>
                  <span className="font-medium">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                {project.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Last Updated</span>
                    <span className="font-medium">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.live_url && (
                <Link href={project.live_url} target="_blank">
                  <Button className="flex items-center gap-2">
                    <BsArrowUpRight />
                    View Live Project
                  </Button>
                </Link>
              )}

              {project.github_url && (
                <Link href={project.github_url} target="_blank">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BsGithub />
                    View on GitHub
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Additional Section - Related Projects (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-6">Project Details</h3>
          <div className="bg-[#232329] rounded-xl p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/60 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
