import { useEffect, useState } from "react";
import LoadingMessage from "../../../components/LoadingMessage";
import { useAuth } from "../../../context/AuthProvider";

import { SendInvitation } from "../../../features/accounts";
import InvitationList from "../../../features/accounts/InvitationList";
import {
  listUserInvitationInitState,
  ListUserInvitationType,
  RetrieveUserInvitationType,
} from "../../../types/UserTypes";
import { listUserInvitationsApi } from "../../../api/userRequest";
import usePagination from "../../../hooks/usePagination";
import Pagination from "../../../components/Pagination";

const NewUsersPage = () => {
  const { userApi } = useAuth();

  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_invitation",
    10
  );
  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [invitations, setInvitations] = useState<ListUserInvitationType>(
    listUserInvitationInitState
  );

  // Add to the list. Used by SendInvitation Component
  const addInvitation = (newInvitation: RetrieveUserInvitationType) => {
    setInvitations((prev) => {
      const updatedResults = [newInvitation, ...prev.results];

      if (updatedResults.length > pageSize) {
        updatedResults.pop();
      }

      return {
        ...prev,
        count: prev.count + 1,
        results: updatedResults,
      };
    });
  };

  const fetchInvitations = async (ppage: number, ppageSize: number) => {
    // Used ppage and ppageSize to distinguish from the page and pageSize
    try {
      setIsFetching(true);
      const res_data = await listUserInvitationsApi(userApi, ppage, ppageSize);
      setInvitations(res_data);
    } catch (error) {
      setHasFetchingError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(invitations.count / pageSize));

  useEffect(() => {
    fetchInvitations(page, pageSize);
  }, [page, pageSize]);

  return (
    <div className="p-4">
      <div className="mt-2 w-full border border-black px-4 py-2 bg-white">
        <section className="mt-2">
          <SendInvitation addInvitation={addInvitation} />
        </section>
        <section className="mt-4">
          {isFetching ? (
            <LoadingMessage message="Loading invitations..." />
          ) : hasFetchingError ? (
            <div>Unexpected error occured while fetching your invitations.</div>
          ) : (
            <>
              <InvitationList
                invitations={invitations}
                setInvitations={setInvitations}
              />
              <Pagination
                pageSize={pageSize}
                page={page}
                totalPages={totalPages}
                setPageSize={setPageSize}
                setPage={setPage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};
export default NewUsersPage;
