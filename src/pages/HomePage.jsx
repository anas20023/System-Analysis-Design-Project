import Nabvar from "../Components/Nabvar"
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom"
const HomePage = () => {
  document.title = "Home | CSE Resource Sharing Platform"
  const navigate = useNavigate();
  const handleLogout = () => {
    removeToken()
    navigate("/");
  }
  return (
    <section className="flex flex-col font-[archivo]">
      <Nabvar onLogout={handleLogout} />
    </section>
  )
}

export default HomePage
