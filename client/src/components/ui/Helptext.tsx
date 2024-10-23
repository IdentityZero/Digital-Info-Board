const Helptext = ({ text }: { text: string | string[] }) => {
  if (Array.isArray(text)) {
    return (
      <div>
        {text.map((t) => (
          <li className="text-gray-500 text-xs mt-1" key={t}>
            {t}
          </li>
        ))}
      </div>
    );
  }

  return <p className="text-gray-500 text-xs mt-1">{text}</p>;
};
export default Helptext;
