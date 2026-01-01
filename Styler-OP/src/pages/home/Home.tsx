import { Button } from "../../components/ui/Button";
import { useAppDispatch, useAppSelector } from "../../hooks/authHooks";
import { logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { logger } from "../../utils/loggers";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/auth");
    } catch (error) {
      logger.error("Logout failed", error);
    }
  };
  return (
    <>
      <div>Home{user?.username}</div>
      {""}
      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={isLoading}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
}

export default Home;
