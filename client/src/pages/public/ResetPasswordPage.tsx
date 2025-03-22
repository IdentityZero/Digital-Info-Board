import { useParams } from "react-router-dom";
import ResetPassword from "../../features/accounts/ResetPassword";

const ResetPasswordPage = () => {
  const { id, token } = useParams();

  if (!id || !token) {
    return (
      <div className="mt-2 text-center">
        Unexpected error occured. Please try again.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center">
      <ResetPassword id={id} token={token} />
    </div>
  );
};
export default ResetPasswordPage;
