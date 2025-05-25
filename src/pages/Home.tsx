import { User, Heart, MessageCircle } from "lucide-react";
import Layout from "../components/layout/layout";
import { Feed } from "../components/Feed";
import { FeaturedProfiles } from "../components/FeaturedProfiles";

const Home = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-3 gap-6 mb-16">
          <section className="col-span-2">
            {/* <h2 className="text-2xl font-semibold mb-6 text-white inline-flex items-center">
              <p className="text-[#4edcd8] mr-2" />
              Feed
            </h2> */}
            <Feed />
          </section>

          <FeaturedProfiles />
        </div>
      </div>
    </Layout>
  );
};

export default Home;