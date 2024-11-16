import React from "react";

const Work = () => {
  return (
    <section className="min-h-screen bg-black text-white px-8 py-16">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-cyan-500">
          My Work & Projects
        </h1>
        <p className="text-gray-400 mt-4">
          Explore some of the projects and experiences that I have worked on.
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
          <h2 className="text-xl font-semibold text-green-400">Project 1</h2>
          <p className="text-gray-300 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas iusto nulla fugiat, modi veritatis doloremque quae officia architecto temporibus, quidem incidunt tempora magnam. In alias consequuntur sit sunt, consequatur pariatur.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
          <h2 className="text-xl font-semibold text-blue-400">Project 2</h2>
          <p className="text-gray-300 mt-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis porro commodi aliquid obcaecati amet labore deserunt quo dolores voluptate incidunt corrupti, optio, vitae culpa animi quam. Labore minima quod maxime.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
          <h2 className="text-xl font-semibold text-yellow-400">Project 3</h2>
          <p className="text-gray-300 mt-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime quam vel nostrum, iste nisi deserunt optio magni placeat illum vero repellat, ipsum aut officia, voluptatibus esse ab eum saepe quis!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Work;
