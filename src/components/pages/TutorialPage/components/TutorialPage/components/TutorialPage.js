import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import PageWrapper from "components/PageWrapper";
import NavDots from "components/common/NavDots";
import TutorialItem from "../../TutorialItem";
import { tutorialSteps } from "../static";
import { makeStyles } from "@material-ui/core";

const swipeConfig = {
  continuous: false,
  widthOfSiblingSlidePreview: 15
};

const useStyles = makeStyles(() => ({
  wrapper: {
    justifyContent: "space-around"
  },
  carousel: {
    minHeight: "80vh",
    overflow: "visible"
  },
  carouselItem: {
    height: "78vh"
  }
}));

export default function TutorialPage({ handleClose, label }) {
  const reactSwipeEl = useRef();
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);
  const styles = useStyles();

  const handleNavdotClick = (index) => {
    setNavDotActiveIndex(index);
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = (index) => {
    setNavDotActiveIndex(index);
  };

  return (
    <PageWrapper
      label={label}
      navigationHandler={{ handleClose }}
      className={styles.wrapper}
    >
      <ReactSwipe
        swipeOptions={{
          ...swipeConfig,
          callback: onSwipe,
          startSlide: navDotActiveIndex
        }}
        ref={(el) => (reactSwipeEl.current = el)}
        className={styles.carousel}
        style={{
          wrapper: {
            overflow: "visible",
            position: "relative"
          },
          container: {
            overflow: "hidden visible",
            visibility: "hidden",
            position: "relative"
          },
          child: {
            float: "left",
            width: "100%",
            position: "relative",
            transitionProperty: "transform"
          }
        }}
      >
        {tutorialSteps.map((value, index) => (
          <div key={index} className={styles.carouselItem}>
            <TutorialItem stepNumber={index + 1} {...value} />
          </div>
        ))}
      </ReactSwipe>
      <NavDots
        numberOfDots={tutorialSteps.length}
        onClick={handleNavdotClick}
        activeIndex={navDotActiveIndex}
      />
    </PageWrapper>
  );
}
