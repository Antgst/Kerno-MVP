import FeaturedSuppliersCarousel from "../components/home/FeaturedSuppliersCarousel";
import HomeBenefits from "../components/home/HomeBenefits";
import HomeFinalCta from "../components/home/HomeFinalCta";
import HomeHero from "../components/home/HomeHero";
import HomePricing from "../components/home/HomePricing";
import HomeProductPreview from "../components/home/HomeProductPreview";

function HomePage() {
  return (
    <main className="landing-page">
      <HomeHero />
      <HomeBenefits />
      <FeaturedSuppliersCarousel />
      <HomeProductPreview />
      <HomePricing />
      <HomeFinalCta />
    </main>
  );
}

export default HomePage;
