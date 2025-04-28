const DashBoardPage = () => {
  return (
    <div className="p-8 min-h-[calc(100vh-80px)]">
      <div className="border border-y-8 border-r-4 border-black h-full rounded-md px-4 py-6">
        <h2 className="font-bold text-2xl text-center tracking-wide mb-8">
          About the Thesis
        </h2>
        <p className="text-lg leading-relaxed text-gray-700">
          This thesis presents the enhancement of the digital information board
          system used in the Computer Engineering Department. The aim is to
          modernize the way information is shared within the department by
          introducing a more dynamic, efficient, and interactive platform for
          announcements, schedules, updates, and other relevant content.
        </p>
        <br />
        <p className="text-lg leading-relaxed text-gray-700">
          The project introduces a dual-monitor setup, which allows for
          simultaneous display of multiple types of content. This provides
          better organization and visibility, avoiding screen clutter and making
          it easier for students and faculty to access relevant information at a
          glance.
        </p>
        <br />
        <p className="text-lg leading-relaxed text-gray-700">
          A significant upgrade in this system is the development of a custom
          web application. This application acts as the core content management
          system, allowing authorized users to update and manage content. It has
          a clean interface, secure login system, and support for images,
          videos, and text.
        </p>
        <br />
        <p className="text-lg leading-relaxed text-gray-700">
          The system is powered by a Raspberry Pi (RPI), which serves as the
          access point and media controller. The RPI retrieves data from the web
          application and sends it to the monitors for display.
        </p>
        <br />
        <p className="text-lg leading-relaxed text-gray-700">
          This project was developed by a group of four Computer Engineering
          students, each contributing to different areas including hardware
          setup, software development, UI/UX design, and system integration.
          Throughout the process, the team applied knowledge in networking,
          embedded systems, web technologies, and project management.
        </p>
        <br />
      </div>
    </div>
  );
};
export default DashBoardPage;
