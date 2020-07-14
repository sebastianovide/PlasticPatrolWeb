import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import NavDots from "components/common/NavDots";

import { FirstSlide, MiddleSlide, FinalSlide } from "../Slides";

import "./WelcomePage.scss";
import { useHistory } from "react-router-dom";
import config from "custom/config";

const carouselStyle = {
  wrapper: {
    maxHeight: "100vh",
    display: "flex",
    minHeight: "-webkit-fill-available"
  }
};

const NUMBER_OF_DOTS = 3;

const WelcomePage = () => {
  const history = useHistory();
  const [open, setOpen] = useState(
    !history.location.pathname.includes(config.PAGES.embeddable.path) &&
      !localStorage.getItem("welcomeShown")
  );
  const reactSwipeEl = useRef<ReactSwipe | null>(null);
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);

  const handleNavdotClick = (index: number) => {
    setNavDotActiveIndex(index);
    // @ts-ignore
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = (index: number) => {
    setNavDotActiveIndex(index);
  };

  if (!open) {
    return [];
  }

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
        <FinalSlide
          onButtonClick={() => {
            localStorage.setItem("welcomeShown", "Yes");
            setOpen(false);
          }}
        />
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
};

export default WelcomePage;
