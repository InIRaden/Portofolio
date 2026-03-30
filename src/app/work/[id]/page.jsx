"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowUpRight, BsGithub, BsArrowLeft, BsCalendar3, BsLayers } from "react-icons/bs";
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#232329] p-8 text-center">
          <p className="text-lg text-white/70">Loading project...</p>
        </div>
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
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }}
      className="min-h-screen py-8 md:py-12"
    >
      <div className="container mx-auto px-4">
        <Link href="/work" className="inline-block">
          <Button variant="outline" className="mb-6 flex items-center gap-2">
            <BsArrowLeft /> Back to Projects
          </Button>
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-primary/80">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative min-h-[300px] md:min-h-[420px]"
          >
            {project.image ? (
              <>
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[#232329] flex items-center justify-center">
                <p className="text-white/60">No image available</p>
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10">
              <p className="mb-3 inline-flex w-fit rounded-full border border-accent/40 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {project.category}
              </p>
              <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-3xl text-white/70">{project.description}</p>
            </div>
          </motion.div>

          <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.35fr_0.65fr]">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-6"
            >
              <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
                <h2 className="mb-3 text-2xl font-bold text-white">Project Overview</h2>
                <p className="whitespace-pre-line leading-relaxed text-white/65">{project.description}</p>
              </section>

              {project.stack && project.stack.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
                    <BsLayers className="text-accent" />
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech, index) => (
                      <span
                        key={`${tech}-${index}`}
                        className="rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
                <h2 className="mb-4 text-2xl font-bold text-white">Gallery</h2>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#232329]">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex min-h-[220px] items-center justify-center text-white/55">
                      No preview image available
                    </div>
                  )}
                </div>
              </section>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 xl:sticky xl:top-8 xl:self-start"
            >
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Project Facts</h3>
                <div className="space-y-4 text-sm">
                  <div className="rounded-xl border border-white/10 bg-primary/60 p-3">
                    <p className="text-white/50">Category</p>
                    <p className="mt-1 font-semibold capitalize text-white">{project.category}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-primary/60 p-3">
                    <p className="flex items-center gap-2 text-white/50">
                      <BsCalendar3 className="text-accent" /> Created
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {project.updated_at && (
                    <div className="rounded-xl border border-white/10 bg-primary/60 p-3">
                      <p className="text-white/50">Last Updated</p>
                      <p className="mt-1 font-semibold text-white">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Open Project</h3>
                <div className="flex flex-col gap-3">
                  {project.live_url && (
                    <Link href={project.live_url} target="_blank">
                      <Button className="w-full justify-center gap-2">
                        View Live Project <BsArrowUpRight />
                      </Button>
                    </Link>
                  )}

                  {project.github_url && (
                    <Link href={project.github_url} target="_blank">
                      <Button variant="outline" className="w-full justify-center gap-2">
                        View on GitHub <BsGithub />
                      </Button>
                    </Link>
                  )}

                  {!project.live_url && !project.github_url && (
                    <p className="text-sm text-white/55">External links are not available for this project.</p>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
