import { User, Heart, MessageCircle } from "lucide-react";
import Layout from "../components/layout/layout";
import { Feed } from "../components/Feed";
import { FeaturedProfiles } from "../components/FeaturedProfiles";

const Home = () => {
  return (
    <Layout>      <div className="max-w-7xl mx-auto px-4">       
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-16">
          <section className="xl:col-span-2 w-full">
            <Feed />
          </section>
          <section className="xl:col-span-1 w-full">
            <FeaturedProfiles />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Home;