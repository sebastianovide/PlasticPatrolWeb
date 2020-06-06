import React from "react";

import LocationOn from "@material-ui/icons/LocationOn";
import CameraAlt from "@material-ui/icons/CameraAlt";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";

import exampleImage from "assets/images/example.jpeg";

export type TutorialStep = {
  img?: string;
  text: string;
  title?: string;
  Icon?: React.FC<{ className: string }>;
  Button?: React.FC<{ className?: string }>;
};

export const tutorialSteps: Array<TutorialStep> = [
  {
    Icon: ({ className }) => <CameraAlt className={className} />,
    title: "Photograph litter you find",
    img: exampleImage,
    text:
      "Get outside, find a piece of litter and take a photo by clicking on the camera icon. If there are multiple pieces of litter in the photo please make sure each item is clear like in the example image below."
  },
  {
    Icon: ({ className }) => <CloudUpload className={className} />,
    title: "Add data about the pieces of litter in your photo",
    text:
      "Add the photo to the app and record details including the brand name and type of litter. Your location will be automatically registered through geotagging. When you’re sure you’ve logged all the items in your photo, submit your photo for approval."
  },
  {
    Icon: ({ className }) => <LocationOn className={className} />,
    title: "View your images on the interactive map and inspire others",
    text:
      "Your photos and data will be approved by our team and will appear in our global litter map within 48 hours. Discard of the litter you’ve collected properly and invite others to join the app so you join forces (or compete!) with litter picking."
  },
  {
    text:
      "By litter picking and logging your findings you are helping build the largest and most powerful dataset on litter. We analyse everything you collect to drive impactful and evidence-based changes by government and brands to protect the environment.",
    Button: () => <Button className="FinalSlide__button">Get started</Button>
  }
];
