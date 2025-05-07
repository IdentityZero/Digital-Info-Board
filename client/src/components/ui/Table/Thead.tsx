const Thead = ({ headers }: { headers: string[] }) => {
  return (
    <thead>
      <tr className="bg-gray-100 text-left text-sm sm:text-base">
        {headers.map((header, index) => (
          <th className="px-4 py-2 sm:px-6 sm:py-3 text-center" key={index}>
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};
export default Thead;
