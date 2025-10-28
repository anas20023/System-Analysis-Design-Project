import FeaturedSection from "../Components/Containers/FeaturedSection";
import SubscriptionSection from "../Components/Containers/SubscriptionSection";
import HeroSection from "../Components/Containers/HeroSection";
import Nabvar from "../Components/Nabvar"
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom"
import ContactSection from "../Components/Containers/ContactSection";
import Footer from "../Components/Containers/FooterSection";
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
      <HeroSection/>
      <FeaturedSection/> 
      <SubscriptionSection/>
      <ContactSection/>
      <Footer/>
    </section>
  )
}

export default HomePage
