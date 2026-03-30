"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { BsArrowUpRight, BsGithub, BsGrid3X3Gap } from "react-icons/bs";
import { Button } from "@/components/ui/button";

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((project) => project.category).filter(Boolean)));
    return ["all", ...unique];
  }, [projects]);

  const sortedProjects = useMemo(() => {
    const getTimestamp = (value) => {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const result = [...projects];
    if (sortBy === "latest") {
      result.sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => getTimestamp(a.created_at) - getTimestamp(b.created_at));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [projects, sortBy]);

  const filteredProjects = useMemo(() => {
    if (category === "all") {
      return sortedProjects;
    }
    return sortedProjects.filter((project) => project.category === category);
  }, [category, sortedProjects]);

  const featuredProject = filteredProjects[0] || null;
  const otherProjects = filteredProjects.slice(1);

  const toLabel = (value) => {
    if (!value) return "Unknown";
    return value.replace(/-/g, " ");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#232329] p-8 text-center">
          <p className="text-lg text-white/70">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4, ease: "easeIn" } }}
      className="min-h-[80vh] py-12 xl:py-16"
    >
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border border-white/10 bg-primary/80 p-6 md:p-8 xl:p-10">
          <div className="flex flex-col gap-8">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-accent">
                  <BsGrid3X3Gap />
                  Project Archive
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl xl:text-6xl">
                  Ruang Karya yang Saya Bangun dari Ide ke Produk
                </h1>
                <p className="mt-4 max-w-2xl text-white/65">
                  Setiap kartu di halaman ini adalah potongan perjalanan saya: mulai dari eksperimen kecil, sampai solusi yang siap dipakai pengguna nyata.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/50">Visible</p>
                  <p className="mt-2 text-3xl font-bold text-accent">{String(filteredProjects.length).padStart(2, "0")}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/50">Total</p>
                  <p className="mt-2 text-3xl font-bold text-white">{String(projects.length).padStart(2, "0")}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 col-span-2 md:col-span-1">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/50">Category</p>
                  <p className="mt-2 text-xl font-semibold capitalize text-white">{toLabel(category)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((cat) => {
                  const active = cat === category;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-all ${
                        active
                          ? "border-accent bg-accent text-primary"
                          : "border-white/20 bg-black/30 text-white/70 hover:border-accent/60 hover:text-accent"
                      }`}
                    >
                      {cat === "all" ? "All Projects" : toLabel(cat)}
                    </button>
                  );
                })}
              </div>

              <div className="w-full xl:w-auto">
                <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/50" htmlFor="sort-work">
                  Sort Projects
                </label>
                <select
                  id="sort-work"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none transition-all focus:border-accent xl:min-w-[220px]"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${sortBy}`}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                {filteredProjects.length > 0 && featuredProject && (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 22, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="group grid overflow-hidden rounded-3xl border border-white/10 bg-black/40 xl:grid-cols-[1.2fr_1fr]"
                  >
                    <div className="relative min-h-[260px] xl:min-h-[360px]">
                      {featuredProject.image ? (
                        <img
                          src={featuredProject.image}
                          alt={featuredProject.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#232329] text-white/50">
                          Preview not available
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                      <div className="absolute bottom-5 left-5 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                        Signature Project
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-6 md:p-8">
                      <div>
                        <p className="text-sm uppercase tracking-[0.14em] text-accent/80">
                          {toLabel(featuredProject.category)}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">{featuredProject.title}</h2>
                        <p className="mt-4 line-clamp-4 text-white/65">{featuredProject.description}</p>

                        {featuredProject.stack?.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            {featuredProject.stack.slice(0, 5).map((tech) => (
                              <span key={tech} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link href={`/work/${featuredProject.id}`}>
                          <Button size="sm" className="gap-2">
                            Lihat Cerita Proyek <BsArrowUpRight />
                          </Button>
                        </Link>
                        {featuredProject.live_url && (
                          <Link href={featuredProject.live_url} target="_blank">
                            <Button size="sm" variant="outline" className="gap-2">
                              Coba Live <BsArrowUpRight />
                            </Button>
                          </Link>
                        )}
                        {featuredProject.github_url && (
                          <Link href={featuredProject.github_url} target="_blank">
                            <Button size="sm" variant="outline" className="gap-2">
                              Lihat Repo <BsGithub />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )}

                {otherProjects.length > 0 && (
                  <motion.div layout className="grid gap-4 lg:grid-cols-2">
                    {otherProjects.map((project, index) => (
                      <motion.article
                        layout
                        key={project.id}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -5, rotateX: 1.4 }}
                        transition={{ delay: 0.07 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-5 transition-all hover:border-accent/40"
                      >
                        <div className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(0,255,153,0.18) 0%, rgba(0,255,153,0) 72%)" }} />

                        <div className="relative mb-4 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-accent/80">{toLabel(project.category)}</p>
                            <h3 className="mt-1 text-2xl font-bold text-white group-hover:text-accent transition-colors">{project.title}</h3>
                          </div>
                          <span className="text-3xl font-extrabold leading-none text-white/10">
                            {String(index + 2).padStart(2, "0")}
                          </span>
                        </div>

                        <p className="relative line-clamp-3 text-white/65">{project.description}</p>

                        {project.stack?.length > 0 && (
                          <div className="relative mt-4 flex flex-wrap gap-2">
                            {project.stack.slice(0, 4).map((tech) => (
                              <span key={tech} className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/80">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="relative mt-6 flex flex-wrap gap-2">
                          <Link href={`/work/${project.id}`}>
                            <Button size="sm" className="gap-2">
                              Detail <BsArrowUpRight />
                            </Button>
                          </Link>
                          {project.live_url && (
                            <Link href={project.live_url} target="_blank">
                              <Button size="sm" variant="outline" className="gap-2">
                                Live <BsArrowUpRight />
                              </Button>
                            </Link>
                          )}
                          {project.github_url && (
                            <Link href={project.github_url} target="_blank">
                              <Button size="sm" variant="outline" className="gap-2">
                                Repo <BsGithub />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                )}

                {filteredProjects.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-10 text-center">
                    <p className="text-xl text-white/75">Belum ada proyek di kategori ini.</p>
                    <p className="mt-2 text-white/50">Coba kategori lain, atau kembali lagi untuk melihat karya terbaru saya.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Work;
