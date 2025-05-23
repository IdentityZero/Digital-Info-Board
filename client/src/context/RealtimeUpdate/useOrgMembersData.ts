import { useState } from "react";

import { sortItemsByPosition } from "../../utils/utils";

import { OrganizationMembersType } from "../../types/FixedContentTypes";
import { listOrgmembersApi } from "../../api/fixedContentRquests";

const useOrgMembersData = () => {
  const [orgMembers, setOrgMembers] = useState<OrganizationMembersType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const fetchOrgMembers = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setIsLoading(true);
        const res_data = await listOrgmembersApi();
        setOrgMembers(res_data);
        setIsReady(true);
      } catch (error) {
        delay = Math.min(delay * 2, 30000);
        setTimeout(retryFetch, delay);
      } finally {
        setIsLoading(false);
      }
    };
    retryFetch();
  };

  const updateSequence = (data: { id: number; new_position: number }[]) => {
    setOrgMembers((prev) => sortItemsByPosition(structuredClone(prev), data));
  };

  const insertItem = (newItem: OrganizationMembersType) => {
    // We can do this because added items are automatically on the last. Handling of sequence will be different
    setOrgMembers((prev) => [...prev, newItem]);
  };

  const updateItem = (id: number, updatedItem: OrganizationMembersType) => {
    setOrgMembers((prev) => {
      return prev.map((item) => (item.id == id ? updatedItem : item));
    });
  };

  const deleteItem = (id: number) => {
    setOrgMembers((prev) => prev.filter((item) => item.id !== id));
  };

  // useEffect(() => {
  //   fetchOrgMembers();
  // }, []);

  return {
    fetchOrgMembers,
    orgMembers,
    deleteItem,
    insertItem,
    updateItem,
    updateSequence,
    isLoading,
    isReady,
  };
};
export default useOrgMembersData;
