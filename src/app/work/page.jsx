"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Work = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all projects");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
        setFilteredProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = (cat) => {
    setCategory(cat);
    if (cat === "all projects") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === cat));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4, ease: "easeIn" } }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row xl:gap-[30px]">
          <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
            <div className="flex flex-col gap-[30px] h-[50%]">
              {/* Outline num */}
              <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                {String(filteredProjects.length).padStart(2, "0")}
              </div>
              {/* Project category */}
              <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                {category}
              </h2>
              {/* Project description */}
              <p className="text-white/60">
                {filteredProjects.length === 0
                  ? "No projects found in this category."
                  : `Explore ${filteredProjects.length} amazing ${category === "all projects" ? "" : category} project${filteredProjects.length > 1 ? "s" : ""} below.`}
              </p>
            </div>
          </div>

          <div className="w-full xl:w-[50%]">
            <Tabs defaultValue={category} className="flex flex-col gap-[60px]">
              <TabsList className="w-full grid grid-cols-4 mx-auto gap-6 xl:border border-accent">
                <TabsTrigger value="all projects" onClick={() => filterProjects("all projects")}>
                  All Projects
                </TabsTrigger>
                <TabsTrigger value="fullstack" onClick={() => filterProjects("fullstack")}>
                  Full Stack
                </TabsTrigger>
                <TabsTrigger value="frontend" onClick={() => filterProjects("frontend")}>
                  Frontend
                </TabsTrigger>
                <TabsTrigger value="backend" onClick={() => filterProjects("backend")}>
                  Backend
                </TabsTrigger>
              </TabsList>

              {/* Tab content */}
              <div className="min-h-[70vh] w-full">
                <TabsContent value={category} className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#232329] h-full p-6 rounded-xl flex flex-col justify-between group hover:bg-[#27272c] transition-all duration-300"
                      >
                        {/* Image */}
                        {project.image && (
                          <div className="w-full h-[160px] sm:h-[200px] relative mb-4 overflow-hidden rounded-lg bg-white/5">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white/40">Image not available</div>';
                              }}
                            />
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-all">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-white/60 mb-4 line-clamp-3">{project.description}</p>

                        {/* Stack */}
                        {project.stack && project.stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.stack.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs bg-white/10 px-3 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex items-center gap-4 border-t border-white/20 pt-4">
                          <Link href={`/work/${project.id}`}>
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger className="w-[50px] h-[50px] rounded-full bg-white/5 flex justify-center items-center group-hover:bg-accent transition-all">
                                  <BsArrowUpRight className="text-white text-2xl group-hover:text-primary" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Link>

                          {project.live_url && (
                            <Link href={project.live_url} target="_blank">
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger className="w-[50px] h-[50px] rounded-full bg-white/5 flex justify-center items-center group-hover:bg-accent transition-all">
                                    <BsArrowUpRight className="text-white text-2xl group-hover:text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Live Project</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Link>
                          )}

                          {project.github_url && (
                            <Link href={project.github_url} target="_blank">
                              <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                  <TooltipTrigger className="w-[50px] h-[50px] rounded-full bg-white/5 flex justify-center items-center group-hover:bg-accent transition-all">
                                    <BsGithub className="text-white text-2xl group-hover:text-primary" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>GitHub Repository</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredProjects.length === 0 && (
                    <div className="text-center text-white/60 py-20">
                      <p className="text-xl">No projects found in this category.</p>
                      <p className="mt-2">Check back later for updates!</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Work;
