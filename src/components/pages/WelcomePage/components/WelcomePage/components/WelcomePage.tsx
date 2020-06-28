import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import NavDots from "components/common/NavDots";

import chart from "assets/images/intro/chart_.png";
import seeItSnapItMapIt from "assets/images/intro/seeItSnapItMapIt_.png";

import { FirstSlide, MiddleSlide, FinalSlide } from "../../Slides";

import "./WelcomePage.scss";
import { useHistory } from "react-router-dom";
import config from "custom/config";

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
  container: {},
  child: {},
  wrapper: {
    maxHeight: "100vh",
    display: "flex",
    minHeight: "-webkit-fill-available"
  }
};

// TODO: in a separate PR clean up duplicate logic betweedn here and the tutorial
// Give slides better names, include counter slide

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
    reactSwipeEl.current && reactSwipeEl.current.slide(index, 100);
  };

  const onSwipe = (index: number) => {
    setNavDotActiveIndex(index);
  };

  if (!open) {
    return [];
  }

  return (
    <div className="WelcomePage__container">
      <ReactSwipe
        style={{ ...carouselStyle }}
        ref={(el) => (reactSwipeEl.current = el)}
        swipeOptions={{
          startSlide: navDotActiveIndex,
          callback: onSwipe,
          continuous: false
        }}
      >
        <FirstSlide />
        <MiddleSlide {...globalResearchSlideProps} />
        <MiddleSlide {...seeItSnapItSlideProps} />
        <FinalSlide
          onButtonClick={() => {
            localStorage.setItem("welcomeShown", "Yes");
            setOpen(false);
          }}
        />
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
};

export default WelcomePage;
