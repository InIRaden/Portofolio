import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";

// components
import Social from "@/components/Social";
import Photo from "@/components/Photo";
import Stats from "@/components/Stats";

const Home = () => {
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
              >
                <span>Download CV</span>
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