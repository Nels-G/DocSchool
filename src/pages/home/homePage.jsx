import BookSection from "../../components/bookSection/bookSection";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import Hero from "../../components/hero/hero";
import "./homePage.css";

function HomePage() {
  return (
    <div className="home-container">
      <Header/>
      <Hero/>
      <BookSection/>
      <Footer/>
    </div>
  );
}

export default HomePage;
