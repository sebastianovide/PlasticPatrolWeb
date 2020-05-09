import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import config from "custom/config";

import User from "types/User";

import Groups from "components/Groups/GroupMain";
import GroupList from "components/Groups/GroupList";
import GroupAdd from "components/Groups/GroupAdd";
import TutorialPage from "components/pages/TutorialPage";
import PhotoPage from "components/pages/PhotoPage";
import ProfilePage from "components/ProfilePage";
import ModeratorPage from "components/ModeratorPage";
import AboutPage from "components/AboutPage";
import LeaderboardPage from "components/Leaderboard";
import WriteFeedbackPage from "components/WriteFeedbackPage";

import FeedbackReportsSubrouter from "components/FeedbackReports/FeedbackReportsSubrouter";

import DisplayPhoto from "components/MapPage/DisplayPhoto";

import ModeratorRoute from "./components/ModeratorRoute";
import SignedInRoute from "./components/SignedInRoute";

type Props = {
  user: User;
  usersLeaderboard: any;
  reloadPhotos: () => void;
  photosToModerate: () => void;
  handleApproveClick: () => void;
  handleRejectClick: () => void;
  file: any;
  gpsLocation: any;
  online: boolean;
  srcType: any;
  cordovaMetadata: any;
  handleCameraClick: () => void;
  geojson: any;
  handlePhotoClick: () => void;
  selectedFeature: any;
  handlePhotoPageClose: () => void;
  fields: any;
};

export function Routes({
  user,
  usersLeaderboard,
  reloadPhotos,
  photosToModerate,
  handleApproveClick,
  handleRejectClick,
  file,
  gpsLocation,
  online,
  srcType,
  cordovaMetadata,
  handleCameraClick,
  geojson,
  handlePhotoClick,
  selectedFeature,
  handlePhotoPageClose,
  fields
}: Props) {
  const history = useHistory();
  return (
    <Switch>
      <Route path={config.PAGES.about.path}>
        <AboutPage
          label={config.PAGES.about.label}
          handleClose={history.goBack}
          reloadPhotos={reloadPhotos}
        />
      </Route>

      <Route path={config.PAGES.tutorial.path}>
        <TutorialPage
          label={config.PAGES.tutorial.label}
          handleClose={history.goBack}
        />
      </Route>

      <Route path={config.PAGES.leaderboard.path}>
        <LeaderboardPage
          config={config}
          label={config.PAGES.leaderboard.label}
          usersLeaderboard={usersLeaderboard}
          handleClose={history.goBack}
          user={user}
        />
      </Route>

      <Route
        path={config.PAGES.groups.path}
        render={props => (
          <Groups
            {...props}
            config={config}
            label={config.PAGES.groups.label}
            handleClose={history.goBack}
          />
        )}
      />

      <Route
        path={config.PAGES.grouplist.path}
        render={props => (
          <GroupList
            {...props}
            config={config}
            label={config.PAGES.grouplist.label}
            groupsArray={["group1", "group2"]}
            handleClose={history.goBack}
          />
        )}
      />

      <Route
        path={config.PAGES.groupadd.path}
        render={props => (
          <GroupAdd
            {...props}
            config={config}
            label={config.PAGES.groupadd.label}
            handleClose={history.goBack}
          />
        )}
      />

      <ModeratorRoute path={config.PAGES.moderator.path} user={user}>
        <ModeratorPage
          photos={photosToModerate}
          config={config}
          label={config.PAGES.moderator.label}
          user={user}
          handleClose={history.goBack}
          handleRejectClick={handleRejectClick}
          handleApproveClick={handleApproveClick}
        />
      </ModeratorRoute>

      <ModeratorRoute path={config.PAGES.feedbackReports.path} user={user}>
        <FeedbackReportsSubrouter
          config={config}
          label={config.PAGES.feedbackReports.label}
          user={user}
          handleClose={history.goBack}
        />
      </ModeratorRoute>

      <Route path={config.PAGES.photos.path}>
        <PhotoPage
          //@ts-ignore - this exists
          label={config.PAGES.photos.label}
          file={file}
          gpsLocation={gpsLocation}
          online={online}
          srcType={srcType}
          cordovaMetadata={cordovaMetadata}
          fields={fields}
          handleClose={history.goBack}
          handleRetakeClick={handleCameraClick}
        />
      </Route>

      <SignedInRoute path={config.PAGES.account.path} user={user}>
        <ProfilePage
          config={config}
          label={config.PAGES.account.label}
          user={user}
          geojson={geojson}
          handleClose={history.goBack}
          handlePhotoClick={handlePhotoClick}
        />
      </SignedInRoute>

      <Route path={config.PAGES.writeFeedback.path}>
        <WriteFeedbackPage
          label={config.PAGES.writeFeedback.label}
          user={user}
          location={gpsLocation}
          online={online}
          handleClose={history.goBack}
        />
      </Route>

      <Route
        path={[
          `${config.PAGES.displayPhoto.path}/:id`,
          `${config.PAGES.embeddable.path}${config.PAGES.displayPhoto.path}/:id`
        ]}
      >
        <DisplayPhoto
          user={user}
          config={config}
          handleRejectClick={handleRejectClick}
          handleApproveClick={handleApproveClick}
          handleClose={handlePhotoPageClose}
          feature={selectedFeature}
        />
      </Route>
    </Switch>
  );
}
