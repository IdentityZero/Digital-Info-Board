import { useState } from "react";

import { cpeBg } from "../../assets";

import { CreateContactUsMessageType } from "../../types/ContactUsTypes";

import { createMessageApi } from "../../api/contactUsRequest";
import axios from "axios";

const ContactUsPage = () => {
  const [contactMessageObj, setContactMessageObj] =
    useState<CreateContactUsMessageType>({ message: "", email: "", name: "" });

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccesful, setIsSuccesful] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    "Oops! Something went wrong. Please try again."
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSuccesful(null);

    try {
      setIsSaving(true);
      await createMessageApi(contactMessageObj);
      setIsSuccesful(() => {
        return true;
      });
      setContactMessageObj({ message: "", email: "", name: "" });
    } catch (error) {
      setIsSuccesful(() => {
        return false;
      });

      if (!axios.isAxiosError(error)) {
        return;
      }

      const err = error.response?.data["error"];
      if (!err || typeof err !== "string") {
        return;
      }
      setErrorMessage(err);
    } finally {
      setIsSaving(false);
    }
  };

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
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Send a Message</h2>
          {isSuccesful === true && (
            <div className="w-full bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-xl shadow-md mb-4 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-base font-medium">
                Your message was sent successfully!
              </span>
            </div>
          )}
          {isSuccesful === false && (
            <div className="w-full bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md mb-4 flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-base font-medium">{errorMessage}</span>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                value={contactMessageObj.name}
                onChange={(e) =>
                  setContactMessageObj((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                name="name"
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="Your Name"
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                value={contactMessageObj.email}
                onChange={(e) =>
                  setContactMessageObj((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                name="email"
                type="email"
                className="w-full p-3 border rounded-lg"
                placeholder="Your Email"
                required
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Message
              </label>
              <textarea
                value={contactMessageObj.message}
                onChange={(e) =>
                  setContactMessageObj((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                name="message"
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Your Message"
                required
                disabled={isSaving}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSaving}
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
