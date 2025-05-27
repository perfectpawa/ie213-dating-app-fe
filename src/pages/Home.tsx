import Layout from "../components/layout/layout";
import { Feed } from "../components/Feed";
import { FeaturedProfiles } from "../components/FeaturedProfiles";

const Home = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-3 gap-6 mb-16">
          <section className="col-span-2">
            <Feed />
          </section>

          <FeaturedProfiles />
        </div>
      </div>
    </Layout>
  );
};

export default Home;