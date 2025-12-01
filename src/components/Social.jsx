import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

const Socials = [
  { icon: <FaGithub />, path: "https://github.com/InIRaden" },
  { icon: <FaLinkedinIn />, path: "https://www.linkedin.com/in/raden-mahesa" },
  { icon: <FaInstagram />, path: "https://www.instagram.com/ramdm__" },
];

const Social = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {Socials.map((item, index) => {
        return (
          <Link key={index} href={item.path} className={iconStyles}>
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Social;
