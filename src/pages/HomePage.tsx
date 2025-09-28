import React, { memo } from 'react';
import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import FeatureSteps from '../components/organisms/FeatureSteps';

const HomePageComponent: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeatureSteps />
    </>
  );
};

const HomePage = memo(HomePageComponent);

HomePage.displayName = 'HomePage';

export default HomePage;