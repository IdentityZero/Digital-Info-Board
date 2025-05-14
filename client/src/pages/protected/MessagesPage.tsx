import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";
import { FaTrash } from "react-icons/fa";

import Table from "../../components/ui/Table/Table";
import Thead from "../../components/ui/Table/Thead";
import LoadingOrErrorWrapper from "../../components/LoadingOrErrorWrapper";
import Pagination from "../../components/Pagination";
import IconWithTooltip from "../../components/IconWithTooltip";

import {
  formatTimestamp,
  truncateStringVariableLen,
} from "../../utils/formatters";

import useLoadingToast from "../../hooks/useLoadingToast";
import usePagination from "../../hooks/usePagination";
import { useAuth } from "../../context/AuthProvider";

import { getListTypeInitState, ListType } from "../../types/ListType";
import { ContactUsMessageType } from "../../types/ContactUsTypes";

import {
  deleteMessageApi,
  listPaginatedMessagesApi,
} from "../../api/contactUsRequest";

import DetailModal from "../../features/message/DetailModal";

const MessagesPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_contactUsMessages",
    10
  );

  const [messagesList, setMessagesList] = useState<
    ListType<ContactUsMessageType>
  >(getListTypeInitState());

  const totalPages = Math.max(1, Math.ceil(messagesList.count / pageSize));

  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(true);

  const [idClicked, setIdClicked] = useState<number | null>(null);

  const fetchMessagesList = async (ppage: number, ppageSize: number) => {
    try {
      setHasFetchingError(false);
      setIsFetching(true);
      const res_data = await listPaginatedMessagesApi(
        userApi,
        ppage,
        ppageSize
      );
      setMessagesList(res_data);
    } catch (error) {
      setHasFetchingError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMessagesList(page, pageSize);
  }, [page, pageSize]);

  const handleOnSuccess = (updatedData: ContactUsMessageType) => {
    setMessagesList((prev) => ({
      ...prev,
      results: prev.results.map((item) =>
        item.id === updatedData.id ? updatedData : item
      ),
    }));
    setIdClicked(null);
  };

  const handleDelete = async (id: number) => {
    const conf = confirm("Are you sure you want to delete this message?");

    if (!conf) return;

    loading("Deleting message. Please wait...");
    try {
      await deleteMessageApi(userApi, id);
      update({
        render: "Message deleted successfully.",
        type: "success",
      });
      setMessagesList((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.id !== id),
        count: prev.count + 1,
      }));
    } catch (error) {
      update({
        render: "Delete failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <LoadingOrErrorWrapper isLoading={isFetching} hasError={hasFetchingError}>
      <div className="p-4">
        <Table>
          <Thead
            headers={["ID", "Name", "Email", "Message", "Date Read", "Actions"]}
          />
          <tbody>
            {messagesList.results.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No data retrieved
                </td>
              </tr>
            )}
            {messagesList.results.map((message) => (
              <tr
                id={String(message.id)}
                key={message.id}
                className="border transition-shadow duration-200 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setIdClicked(message.id);
                }}
              >
                <td className="p-2 border text-center font-bold underline">
                  {message.id}
                </td>
                <td className="p-2 border whitespace-nowrap">{message.name}</td>
                <td className="p-2 border whitespace-nowrap">
                  {message.email}
                </td>
                <td className="p-2 border">
                  {truncateStringVariableLen(message.message, 70, 70)}
                </td>
                <td className="p-2 border whitespace-nowrap">
                  {message.responded_at
                    ? formatTimestamp(message.responded_at)
                    : "Unread"}
                </td>
                <td className="p-2">
                  <div className="h-full flex justify-center items-center gap-4">
                    <button
                      className="w-fit h-fit"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                    >
                      <IconWithTooltip
                        icon={FaTrash}
                        label="Delete"
                        iconClassName="text-xl text-btDanger hover:text-btDanger-hover active: active:text-btDanger-active cursor-pointer"
                        labelClassName="p-1 px-2 rounded-md shadow-md bg-btDanger text-white text-center"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          pageSize={pageSize}
          page={page}
          totalPages={totalPages}
          setPageSize={setPageSize}
          setPage={setPage}
        />
        {idClicked && (
          <DetailModal
            id={idClicked}
            onClose={() => setIdClicked(null)}
            onSuccess={handleOnSuccess}
          />
        )}
      </div>
    </LoadingOrErrorWrapper>
  );
};
export default MessagesPage;
