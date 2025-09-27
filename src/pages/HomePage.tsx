import React, { memo } from 'react';
import Header from '../components/organisms/Header';
import Hero from '../components/organisms/Hero';
import FeatureSteps from '../components/organisms/FeatureSteps';

const HomePage: React.FC = memo(() => {
  return (
    <>
      <Header />
      <Hero />
      <FeatureSteps />
    </>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;