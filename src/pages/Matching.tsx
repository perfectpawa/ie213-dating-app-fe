import MatchingOpponentsList from "../components/Matching/MatchingOpponentsList";
import MatchingSwiperList from "../components/Matching/MatchingSwiperList";
import MatchingCard from "../components/Matching/MatchingCard";
import Layout from "../components/layout/layout";


const Matching = () => {
  return (
      <Layout>
        <div className="w-full h-full flex justify-center">
          <div className="flex-2 h-full flex flex-row flex-wrap gap-2">
            <MatchingCard />
            <MatchingCard />
            <MatchingCard />
            <MatchingCard />
            <MatchingCard />
            <MatchingCard />
            <MatchingCard />
            <MatchingCard />
          </div>
          {/*<div className="h-full flex-1">*/}
          {/*  <MatchingOpponentsList />*/}
          {/*  <MatchingSwiperList />*/}
          {/*</div>*/}
        </div>
      </Layout>
  );
};

export default Matching;
