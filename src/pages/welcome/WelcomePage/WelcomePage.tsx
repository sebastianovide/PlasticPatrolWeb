import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import NavDots from "components/common/NavDots";

import chart from "assets/images/intro/chart.png";
import seeItSnapItMapIt from "assets/images/intro/seeItSnapItMapIt.png";

import { FirstSlide, MiddleSlide, FinalSlide } from "../Slides";

import "./WelcomePage.scss";

const globalResearchSlideProps = {
  topText: "Global research",
  imgSrc: chart,
  bottomText:
    "Data you collect helps develop solutions to stop pollution at the source"
};

const seeItSnapItSlideProps = {
  topText: "Be part of the solution",
  imgSrc: seeItSnapItMapIt,
  bottomText: "Photograph and document rubbish you find - it's simple"
};

const carouselStyle = {
  wrapper: {
    maxHeight: "100vh",
    display: "flex",
    minHeight: "-webkit-fill-available"
  }
};

export default function WelcomePage({ handleClose }: any) {
  const reactSwipeEl = useRef();
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);

  const handleNavdotClick = (index: number) => {
    setNavDotActiveIndex(index);
    // @ts-ignore
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = (index: number) => {
    setNavDotActiveIndex(index);
  };

  return (
    <div className="WelcomePage__container">
      {/* @ts-ignore */}
      <ReactSwipe
        style={carouselStyle}
        // @ts-ignore
        ref={(el) => (reactSwipeEl.current = el)}
        swipeOptions={{
          startSlide: navDotActiveIndex,
          callback: onSwipe,
          continuous: false,
          widthOfSiblingSlidePreview: 0
        }}
      >
        <FirstSlide />
        <MiddleSlide {...globalResearchSlideProps} />
        <MiddleSlide {...seeItSnapItSlideProps} />
        <FinalSlide onButtonClick={handleClose} />
      </ReactSwipe>
      <NavDots
        numberOfDots={4}
        wrapperClass="WelcomePage__navDotsWrapper"
        navDotActiveClass="WelcomePage__navDotActive"
        navDotClass="WelcomePage__navDot"
        activeIndex={navDotActiveIndex}
        onClick={handleNavdotClick}
      />
    </div>
  );
}
