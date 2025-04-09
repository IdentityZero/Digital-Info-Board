import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full bg-cyan-950 min-h-16 text-white flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      <p className="text-sm text-center sm:text-left">
        &copy; {new Date().getFullYear()} Computer Engineering - Mariano Marcos
        State University. All rights reserved.
      </p>
      <div className="flex justify-center items-center space-x-6 mb-2 sm:mb-0">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-blue-400"
        >
          <FaFacebook />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-blue-300"
        >
          <FaTwitter />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-pink-400"
        >
          <FaInstagram />
        </a>
      </div>
    </div>
  );
};
export default Footer;
