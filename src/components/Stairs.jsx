import { animate, motion } from "framer-motion";

// variants
const stairAnimation = {
    initial: {
        top: "0%",
    },
    animate: {
        top: "100%",
    },
    exit: {
        top: ["100%", "0%"] // Menentukan animasi keluar
    }
};

// menghitung indeks mundur untuk penundaan bertahap
const reverseIndex = (index) => {
  const totalSteps = 6; //jumlah steps
  return totalSteps - index - 1;
};

const Stairs = () => {
  return (
    <>
      {/* 
    membuat 6 divisi gerakan, masing-masing mewakili anak tangga. 
    Setiap div akan memiliki animasi yang sama yang ditentukan oleh objek stairAnimation. 
    Penundaan untuk setiap div dihitung secara sinematik berdasarkan indeks yang dicadangkan, 
    menciptakan efek terhuyung-huyung dengan penundaan yang menurun untuk setiap langkah berikutnya. 
    */}
      {[...Array(6)].map((_, index) => {
        return ( // mengembalikan elemen
          <motion.div
            key={index}
            variants={stairAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              delay: reverseIndex(index) * 0.1,
            }}
            className="h-full w-full bg-white relative"
          />
        );
      })}
    </>
  );
};

export default Stairs;
