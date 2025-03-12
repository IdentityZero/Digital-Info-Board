import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";
import { FaExclamationCircle } from "react-icons/fa";

import ClosableMessage from "../../../components/ClosableMessage";
import Pagination from "../../../components/Pagination";
import LoadingMessage from "../../../components/LoadingMessage";

import { useAuth } from "../../../context/AuthProvider";
import usePagination from "../../../hooks/usePagination";
import useLoadingToast from "../../../hooks/useLoadingToast";

import CreateMember from "../../../features/fixedContent/Organization/CreateMember";
import ListMembers from "../../../features/fixedContent/Organization/ListMembers";

import { getListTypeInitState, type ListType } from "../../../types/ListType";
import { type OrganizationMembersType } from "../../../types/FixedContentTypes";
import {
  deleteOrgMemberApi,
  listPaginatedOrgMembersApi,
} from "../../../api/fixedContentRquests";

const OrganizationPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_orgMembers",
    10
  );

  const [membersList, setMembersList] = useState<
    ListType<OrganizationMembersType>
  >(getListTypeInitState());

  const totalPages = Math.max(1, Math.ceil(membersList.count / pageSize));

  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(true);

  const fetchMembersList = async (ppage: number, ppageSize: number) => {
    try {
      setHasFetchingError(false);
      setIsFetching(true);
      const res_data = await listPaginatedOrgMembersApi(ppage, ppageSize);
      setMembersList(res_data);
    } catch (error) {
      setHasFetchingError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const addNewMember = (newMember: OrganizationMembersType) => {
    setMembersList((prev) => {
      const updatedList = [newMember, ...prev.results];

      if (updatedList.length > pageSize) {
        updatedList.pop();
      }

      return { ...prev, count: prev.count + 1, results: updatedList };
    });
  };

  const handleDelete = async (id: number) => {
    const del_conf = window.confirm("Are you sure you want to delete?");

    if (!del_conf) return;

    loading("Deleting. Please wait...");

    try {
      await deleteOrgMemberApi(userApi, id);
      update({
        render: "Delete successful.",
        type: "success",
      });
      setMembersList((prev) => {
        const updated = prev.results.filter((member) => member.id !== id);
        return { ...prev, results: updated, count: prev.count - 1 };
      });
    } catch (error) {
      update({
        render: "Delete failed. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchMembersList(page, pageSize);
  }, [page, pageSize]);

  return (
    <div>
      <ClosableMessage
        className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-cyanBlue font-bold"
        icon={FaExclamationCircle}
      >
        Contents here are separate from user informations
      </ClosableMessage>
      <section className="mt-2">
        <CreateMember onSuccess={addNewMember} />
      </section>
      <section className="mt-2">
        {isFetching ? (
          <LoadingMessage message="Fetching members list" />
        ) : hasFetchingError ? (
          <div className="w-full text-center">Error fetching members list</div>
        ) : (
          <>
            <ListMembers
              members={membersList.results}
              handleDelete={handleDelete}
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
  );
};
export default OrganizationPage;
