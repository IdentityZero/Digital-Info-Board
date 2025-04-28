const HelpPage = () => {
  const guidelines = [
    {
      title: "Current Display",
      content:
        "Shows the content currently being displayed on the digital board in real-time.",
    },
    {
      title: "Upload Content",
      content:
        "Allows users to upload videos, images, or text with category selection via dropdown for organized posting.",
    },
    {
      title: "Contents",
      content:
        "Lists all uploaded content with options to edit or delete based on user permissions.",
    },
    {
      title: "Permissions (Admin only)",
      content:
        "Manage which users can post content; add or remove access privileges.",
    },
    {
      title: "Default Display",
      content:
        "Displays the department’s standard content: <br>- Faculty and Organization profiles <br>- Media Displays <br>- Upcoming Events <br>- Weather forecast",
    },
    {
      title: "Calendar",
      content: "Users can add events and adjust the Calendar Display Settings.",
    },
    {
      title: "Profile",
      content:
        "Users can edit their profile; admins can send invitation code for new users and also deactivate or delete existing accounts.",
    },
    {
      title: "Settings (Admin only)",
      content:
        "Option to safely shut down the Raspberry Pi or access other system-level settings.",
    },
    {
      title: "Notifications",
      content:
        "Send notifications to users regarding updates, events, or important announcements, with the option to turn them on/off.",
    },
    {
      title: "Feedback",
      content:
        "Users can provide feedback on the displayed content or the system's functionality, which is reviewed by the admins.",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Guidelines
      </h1>
      <ol className="list-decimal pl-6 space-y-4 text-lg text-gray-700">
        {guidelines.map((guideline) => (
          <li>
            <h3 className="font-semibold text-xl text-gray-800">
              {guideline.title}
            </h3>
            <p
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: guideline.content }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};
export default HelpPage;
