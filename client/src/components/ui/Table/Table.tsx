const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full overflow-x-auto border border-white/20 backdrop-blur-md bg-white/10 rounded-lg shadow-md">
        {children}
      </table>
    </div>
  );
};
export default Table;
