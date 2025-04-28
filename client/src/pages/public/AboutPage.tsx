import {
  cpeBg,
  researcher1,
  researcher2,
  researcher3,
  researcher4,
} from "../../assets";

const AboutPage = () => {
  const researchers = [
    {
      name: "Lea-Jane H. Cascayan",
      role: "UI/UX Designer",
      description:
        "Focused on user experience research, wireframing, prototyping, and visual design",
      image: researcher1,
    },
    {
      name: "Noli Marc Castillo",
      role: "Frontend Developer and UI/UX Designer",
      description:
        "Focused on designing and developing user interfaces, ensuring both usability and functionality",
      image: researcher2,
    },
    {
      name: "Wistar M. Collado",
      role: "Backend Developer and Data Management",
      description: "Focused on backend development and database management.",
      image: researcher3,
    },
    {
      name: "Maria Erika M. Alegre",
      role: "Database Management and Networks",
      description: "Focused on database management and network configurations.",
      image: researcher4,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={cpeBg}
          alt="Department"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center">
            Department of Computer Engineering
          </h1>
        </div>
      </div>

      {/* Project Description */}
      <div className="max-w-4xl mx-auto text-center py-12 px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          About Our Project
        </h2>
        <p className="text-lg text-gray-700">
          This project presents the enhancement of the digital information board
          system used in the Computer Engineering Department. The aim is to
          modernize the way information is shared within the department by
          introducing a more dynamic, efficient, and interactive platform for
          announcements, schedules, updates, and other relevant content.
        </p>
      </div>

      {/* Research Adviser */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col sm:flex-row items-center p-6 mb-12">
        <img
          src="https://picsum.photos/200"
          alt="Research Adviser"
          className="w-48 h-48 rounded-full object-cover mb-4 sm:mb-0 sm:mr-6"
        />
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold">
            Engr. Ajay Daquioag
          </h3>
          <p className="text-gray-700">Research Adviser</p>
          <p className="text-gray-600 mt-2">
            Engr. Ajay Daquioag is a skilled engineer and professor with
            expertise in Computer Programming and Computer Networks. With a
            passion for the academy, he guides students in developing the
            technical skills and knowledge needed to succeed in the field of
            Computer Engineering.
          </p>
          <br />
          <p className="text-gray-700">Academe</p>
          <p className="text-gray-600">
            1 year Computer Programming, Computer Networks, Living in the IT
            Era, Computer Organization and Architecture, Computer Networks and
            Security, Feedbacks and Control System, Basic Occupational Health
            and
          </p>
        </div>
      </div>

      {/* Researchers Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Our Researchers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
          {researchers.map((researcher, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 text-center"
            >
              <img
                src={researcher.image}
                alt={researcher.name}
                className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
              />
              <h3 className="text-xl sm:text-2xl font-bold">
                {researcher.name}
              </h3>
              <p className="text-gray-600">{researcher.role}</p>
              <p className="text-gray-500 text-sm mt-2">
                {researcher.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
