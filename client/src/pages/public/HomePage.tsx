import useAnnouncementSlider from "../../features/announcements/hooks/useAnnouncementSlider";
import LoadingMessage from "../../components/LoadingMessage";
import { LiveAnnouncement } from "../../features/announcements";

const HomePage = () => {
  // TODO: POSSIBILITY OF EMPTY ANNOUNCEMENT (The announcement has no body or type)
  const { announcements, isLoading, error } = useAnnouncementSlider();

  if (isLoading) {
    return (
      <div className="mt-4">
        <LoadingMessage message="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 text-center">Unexpected error occured...</div>;
  }

  if (announcements.length === 0) {
    return (
      <div className="mt-4 text-center">No announcements right now...</div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <LiveAnnouncement />
    </div>
  );
};
export default HomePage;
