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
import useLocalStorage from "../../../hooks/useLocalStorage";

const NewUsersPage = () => {
  const { userApi } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useLocalStorage("page_size", 10);
  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [invitations, setInvitations] = useState<ListUserInvitationType>(
    listUserInvitationInitState
  );

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
              <div className="flex justify-end items-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="itemsPerPage">Items:</label>
                  <select
                    className="px-2 py-1 border rounded"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};
export default NewUsersPage;
