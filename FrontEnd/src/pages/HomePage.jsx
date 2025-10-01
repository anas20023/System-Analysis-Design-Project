import Nabvar from "../Components/Nabvar"


const HomePage = () => {
  document.title = "Home | CSE Resource Sharing Platform"
  return (
    <section className="flex flex-col font-[archivo]">
      <Nabvar />
    </section>
  )
}

export default HomePage
