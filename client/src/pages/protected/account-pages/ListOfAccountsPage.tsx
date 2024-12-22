import ClosableMessage from "../../../components/ClosableMessage";

const ListOfAccountsPage = () => {
  return (
    <div className="p-4">
      <div className="mt-2 w-full border border-black p-4 bg-white">
        <ClosableMessage className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#f0d68d] font-bold">
          Proper permission design is needed before implementing this.
        </ClosableMessage>
      </div>
    </div>
  );
};
export default ListOfAccountsPage;
