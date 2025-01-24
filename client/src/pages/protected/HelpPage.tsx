import { useEffect, useState } from "react";
import { AnnouncementRetrieveType } from "../../types/AnnouncementTypes";
import { useAuth } from "../../context/AuthProvider";
import { retrieveTextAnnouncementApi } from "../../api/announcementRequest";
import { AnnouncementThumbnail } from "../../features/announcements";

const HelpPage = () => {
  const { userApi } = useAuth();
  const [data, setData] = useState<AnnouncementRetrieveType | undefined>(
    undefined
  );
  const id = "410";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_data = await retrieveTextAnnouncementApi(userApi, id);
        setData(res_data);
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <>
      {data && (
        <div>
          <AnnouncementThumbnail data={data as AnnouncementRetrieveType} />
        </div>
      )}
    </>
  );
};
export default HelpPage;
