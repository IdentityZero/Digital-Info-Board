import { formatStringUnderscores } from "../utils/formatters";

interface AuthorCardProps {
  image: string;
  name: string;
  role: string;
  position: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  image,
  name,
  role,
  position,
}) => {
  return (
    <div className="text-sm leading-6">
      <figure className="relative flex flex-col-reverse rounded-lg p-4 dark:bg-slate-800 dark:highlight-white/5">
        <figcaption className="flex items-center space-x-4">
          <img
            src={image}
            alt={`${name}'s thumbnail`}
            className="flex-none w-14 h-14 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="flex-auto">
            <div className="text-base text-slate-900 font-semibold dark:text-slate-200 capitalize">
              {name}
            </div>
            <div className="mt-0.5 dark:text-slate-300 capitalize">
              {role} - {formatStringUnderscores(position)}
            </div>
          </div>
        </figcaption>
      </figure>
    </div>
  );
};

export default AuthorCard;
