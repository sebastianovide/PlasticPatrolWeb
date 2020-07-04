import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import NavDots from "components/common/NavDots";

import { FirstSlide, MiddleSlide, FinalSlide } from "../Slides";

import "./WelcomePage.scss";

const carouselStyle = {
  wrapper: {
    maxHeight: "100vh",
    display: "flex",
    minHeight: "-webkit-fill-available"
  }
};

const NUMBER_OF_DOTS = 3;

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
        <MiddleSlide />
        <FinalSlide onButtonClick={handleClose} />
      </ReactSwipe>
      <NavDots
        numberOfDots={NUMBER_OF_DOTS}
        wrapperClass="WelcomePage__navDotsWrapper"
        navDotActiveClass="WelcomePage__navDotActive"
        navDotClass="WelcomePage__navDot"
        activeIndex={navDotActiveIndex}
        onClick={handleNavdotClick}
      />
    </div>
  );
}
