const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="relative">
        <img
          src="https://picsum.photos/1200/400"
          alt="Department"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Department of Computer Engineering
          </h1>
        </div>
      </div>

      {/* Project Description */}
      <div className="max-w-4xl mx-auto text-center py-12 px-6">
        <h2 className="text-3xl font-bold mb-4">About Our Project</h2>
        <p className="text-lg text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae
          scelerisque enim ligula venenatis dolor.
        </p>
      </div>

      {/* Research Adviser */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row items-center p-6 mb-12">
        <img
          src="https://picsum.photos/200"
          alt="Research Adviser"
          className="w-48 h-48 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
        />
        <div>
          <h3 className="text-2xl font-bold">Dr. John Doe</h3>
          <p className="text-gray-700">Research Adviser</p>
          <p className="text-gray-600 mt-2">
            Dr. Doe is an expert in embedded systems, artificial intelligence,
            and software engineering. With years of experience, he guides
            students to develop innovative solutions.
          </p>
        </div>
      </div>

      {/* Researchers Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Our Researchers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {[
            "Lea-Jane H. Cascayan",
            "Noli Marc Castillo",
            "Wistar M. Collado",
            "Maria Erika M. Alegre",
          ].map((name, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-center"
            >
              <img
                src={`https://picsum.photos/150?random=${index + 1}`}
                alt={name}
                className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
              />
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-gray-600">Software Developer</p>
              <p className="text-gray-500 text-sm mt-2">
                Focused on backend development and database management.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
