import Pagination, { PaginationProps } from "../../../components/Pagination";
import Table from "../../../components/ui/Table/Table";
import Thead from "../../../components/ui/Table/Thead";
import { PaginatedAnnouncementListTypeV1 } from "../../../types/AnnouncementTypes";
import AnnouncementTableRow from "./AnnouncementTableRow";

type AnnouncementTableListProps = {
  announcements: PaginatedAnnouncementListTypeV1;
  handleDelete: (announcement_id: string) => void;
  handleRestore?: (announcement_id: string) => void;
  allowView?: boolean;
} & PaginationProps;

const AnnouncementTableList = ({
  announcements,
  handleDelete,
  handleRestore,
  pageSize,
  totalPages,
  page,
  setPageSize,
  setPage,
  allowView = true,
}: AnnouncementTableListProps) => {
  return (
    <>
      <Table>
        <Thead
          headers={[
            "ID",
            "Title",
            "Start Date",
            "End Date",
            "Duration",
            "Approved",
            "Within Display Period",
            "Actions",
          ]}
        />

        <tbody className="overflow-x-scroll ">
          {announcements.results.map((announcement) => (
            <AnnouncementTableRow
              allowView={allowView}
              key={announcement.id}
              announcement={announcement}
              handleDelete={handleDelete}
              handleRestore={handleRestore}
            />
          ))}
        </tbody>
      </Table>
      {announcements.results.length === 0 && (
        <div className="w-full text-center mt-2">
          <h2 className="font-semibold">No contents can be shown.</h2>
        </div>
      )}
      <Pagination
        pageSize={pageSize}
        page={page}
        totalPages={totalPages}
        setPageSize={setPageSize}
        setPage={setPage}
      />
    </>
  );
};
export default AnnouncementTableList;
