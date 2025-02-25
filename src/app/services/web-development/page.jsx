"use client";

import { useState } from "react";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([])

  const [editingIndex, setEditingIndex] = useState(null); // Untuk mode edit

  const handleUpload = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const link = e.target.link.value;
    const image = e.target.image.value || "https://source.unsplash.com/400x300/?web";

    if (!title || !description || !link) return;

    if (editingIndex !== null) {
      // Update data jika sedang dalam mode edit
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = { title, description, link, image };
      setProjects(updatedProjects);
      setEditingIndex(null);
    } else {
      // Tambahkan data baru
      setProjects([...projects, { title, description, link, image }]);
    }

    e.target.reset();
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  return (
    <section className="min-h-screen py-12 bg-gray-900 text-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-cyan-400 text-transparent bg-clip-text">
          My Portfolio
        </h1>

        {/* Form Upload/Edit */}
        <form onSubmit={handleUpload} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col gap-4">
          <input
            name="title"
            type="text"
            placeholder="Project Title"
            defaultValue={editingIndex !== null ? projects[editingIndex].title : ""}
            required
            className="p-3 border rounded-lg bg-gray-700 text-white"
          />
          <textarea
            name="description"
            placeholder="Project Description"
            defaultValue={editingIndex !== null ? projects[editingIndex].description : ""}
            required
            className="p-3 border rounded-lg bg-gray-700 text-white"
          ></textarea>
          <input
            name="link"
            type="url"
            placeholder="Live Demo Link"
            defaultValue={editingIndex !== null ? projects[editingIndex].link : ""}
            required
            className="p-3 border rounded-lg bg-gray-700 text-white"
          />
          <input
            name="image"
            type="url"
            placeholder="Image URL (optional)"
            defaultValue={editingIndex !== null ? projects[editingIndex].image : ""}
            className="p-3 border rounded-lg bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
          >
            {editingIndex !== null ? "Update" : "Upload"}
          </button>
        </form>

        {/* Menampilkan Portfolio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.map((project, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-4 relative">
              <img src={project.image} alt={project.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-white/70 mb-2">{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                View Project →
              </a>

              {/* Tombol Edit & Delete */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
