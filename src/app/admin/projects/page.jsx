"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiUpload } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function AdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "fullstack",
    image: "",
    stack: "",
    live_url: "",
    github_url: ""
  });

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
      alert("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload
      });
      const data = await response.json();
      
      if (data.success) {
        const imageUrl = data.data?.url || data.url;
        if (imageUrl) {
          setFormData(prev => ({ ...prev, image: imageUrl }));
          alert("Image uploaded successfully!");
        } else {
          alert("Upload succeeded but no URL returned");
        }
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      stack: formData.stack.split(",").map(s => s.trim()).filter(s => s)
    };

    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      
      const method = editingProject ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(editingProject ? "Project updated!" : "Project created!");
        resetForm();
        fetchProjects();
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project");
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image: project.image || "",
      stack: Array.isArray(project.stack) ? project.stack.join(", ") : "",
      live_url: project.live_url || "",
      github_url: project.github_url || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE"
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("Project deleted!");
        fetchProjects();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "fullstack",
      image: "",
      stack: "",
      live_url: "",
      github_url: ""
    });
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Projects</h1>
          <p className="text-white/60 text-sm sm:text-base mt-1">Manage your portfolio projects</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {showForm ? <FiX /> : <FiPlus />}
            {showForm ? "Cancel" : "Add Project"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-[#27272c] p-4 sm:p-6 lg:p-8 rounded-xl mb-6 sm:mb-8 border border-accent/10 shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Project Title"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm sm:text-base font-medium">Description *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Project Description"
                rows={4}
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm sm:text-base font-medium">Image</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full"
                />
                {uploading && <span className="text-sm text-white/60">Uploading...</span>}
              </div>
              {formData.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3"
                >
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full sm:w-48 h-32 sm:h-32 object-cover rounded-lg border border-accent/20"
                  />
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium">Tech Stack (comma separated)</label>
                <Input
                  name="stack"
                  value={formData.stack}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium">Live URL</label>
                <Input
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm sm:text-base font-medium">GitHub URL</label>
              <Input
                name="github_url"
                value={formData.github_url}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button type="submit" className="flex items-center gap-2 w-full sm:w-auto">
                  <FiSave />
                  {editingProject ? "Update" : "Create"} Project
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-xl sm:text-2xl font-bold">All Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#27272c] p-8 sm:p-12 rounded-xl text-center border border-accent/10"
          >
            <FiPlus className="text-5xl sm:text-6xl text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-sm sm:text-base">No projects yet. Add your first project!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-[#27272c] p-4 sm:p-6 rounded-xl border border-accent/10 hover:border-accent/30 transition-all shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {project.image && (
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={project.image}
                      alt={project.title}
                      className="w-full sm:w-32 lg:w-40 h-32 lg:h-40 object-cover rounded-lg border border-accent/20"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-white/60 text-sm sm:text-base mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-accent text-primary text-xs sm:text-sm px-2 sm:px-3 py-1 rounded font-medium">
                        {project.category}
                      </span>
                      {Array.isArray(project.stack) &&
                        project.stack.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="bg-white/10 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      {project.stack && project.stack.length > 3 && (
                        <span className="bg-white/10 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 justify-end">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(project)}
                        className="w-full sm:w-auto"
                      >
                        <FiEdit />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                        className="w-full sm:w-auto"
                      >
                        <FiTrash2 />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
