import React, { useRef, useState } from "react";
import ReactSwipe from "react-swipe";

import { makeStyles } from "@material-ui/core";

import PageWrapper from "components/PageWrapper";
import NavDots from "components/common/NavDots";
import Logo from "components/common/Logo";

import TutorialItem from "../TutorialItem";
import { tutorialSteps } from "../static";

const swipeConfig = {
  continuous: false,
  widthOfSiblingSlidePreview: 15
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    justifyContent: "space-around"
  },
  carousel: {
    height: "max-content",
    overflow: "visible"
  },
  carouselItem: {
    height: "78vh",
    maxHeight: 425,
    margin: `${theme.spacing(0.5)}px 0 ${theme.spacing(1)}px`
  }
}));

const SHOW_LOGO = window.innerHeight > 600;

type Props = { handleClose: () => void };
export default function TutorialPage({ handleClose }: Props) {
  const reactSwipeEl = useRef();
  const [navDotActiveIndex, setNavDotActiveIndex] = useState(0);
  const styles = useStyles();

  const handleNavdotClick = (index: number) => {
    setNavDotActiveIndex(index);
    // @ts-ignore
    reactSwipeEl.current && reactSwipeEl.current.slide(index);
  };

  const onSwipe = (index: number) => {
    setNavDotActiveIndex(index);
  };

  return (
    <PageWrapper
      label={"Tutorial"}
      navigationHandler={{ handleClose }}
      className={styles.wrapper}
    >
      {SHOW_LOGO && <Logo />}
      <ReactSwipe
        swipeOptions={{
          ...swipeConfig,
          callback: onSwipe,
          startSlide: navDotActiveIndex
        }}
        // @ts-ignore
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
