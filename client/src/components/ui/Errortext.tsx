const Errortext = ({ text }: { text: string | string[] }) => {
  if (Array.isArray(text)) {
    return (
      <div>
        {text.map((t) => (
          <li className="text-red-500 text-xs mt-1 font-semibold" key={t}>
            {t}
          </li>
        ))}
      </div>
    );
  }

  return <p className="text-red-500 text-xs mt-1 font-semibold">{text}</p>;
};
export default Errortext;
