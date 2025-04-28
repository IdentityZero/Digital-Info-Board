import { cpeBg } from "../../assets";

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <div className="relative">
        <img
          src={cpeBg}
          alt="Contact Us"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Contact Us
          </h1>
        </div>
      </div>

      {/* Contact Form & Details */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 gap-12">
        {/* Contact Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-700 mb-4">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello.
          </p>
          <div className="space-y-4">
            <p className="text-lg">
              <strong>📍 Address:</strong> Marcos Ave, Paoay, 2902 Ilocos Norte
            </p>
            <p className="text-lg">
              <strong>✉️ Email:</strong> boarddib@gmail.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg"
                placeholder="Your Email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Message
              </label>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Google Map */}
      <div className="w-full h-[400px]">
        <iframe
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1896.6256853699729!2d120.54268283860165!3d18.059914245803064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x338ec06cb0944a7f%3A0xaf32e68a68e54d13!2sCollege%20of%20Engineering!5e0!3m2!1sen!2sph!4v1743168410924!5m2!1sen!2sph"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUsPage;
