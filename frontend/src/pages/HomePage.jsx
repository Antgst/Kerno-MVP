import FeaturedSuppliersCarousel from "../components/home/FeaturedSuppliersCarousel";
import HomeBenefits from "../components/home/HomeBenefits";
import HomeFinalCta from "../components/home/HomeFinalCta";
import HomeHero from "../components/home/HomeHero";
import HomeHowItWorks from "../components/home/HomeHowItWorks";
import HomePricing from "../components/home/HomePricing";
import HomeProductPreview from "../components/home/HomeProductPreview";
import PublicFooter from "../components/home/PublicFooter";

function HomePage() {
  return (
    <main className="landing-page">
      <HomeHero />
      <HomeHowItWorks />
      <HomeBenefits />
      <FeaturedSuppliersCarousel />
      <HomeProductPreview />
      <HomePricing />
      <HomeFinalCta />
      <PublicFooter />
    </main>
  );
}

export default HomePage;
