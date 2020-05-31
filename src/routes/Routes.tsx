import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import config from "custom/config";

import User from "types/User";

import Groups from "components/Groups/GroupMain";
import GroupList from "components/Groups/GroupList";
import GroupAdd from "components/Groups/GroupAdd";
import TutorialPage from "components/pages/TutorialPage";
import ProfilePage from "components/ProfilePage";
import ModeratorPage from "components/ModeratorPage";
import AboutPage from "components/AboutPage";
import LeaderboardPage from "components/Leaderboard";
import WriteFeedbackPage from "components/WriteFeedbackPage";

import FeedbackReportsSubrouter from "components/FeedbackReports/FeedbackReportsSubrouter";

import DisplayPhoto from "components/MapPage/DisplayPhoto";
import Photo from "types/Photo";

import ModeratorRoute from "./components/ModeratorRoute";
import SignedInRoute from "./components/SignedInRoute";

import PhotoRoute from "./photo/Route";
import { linkToPhotoPage } from "./photo/links";

import UploadPhotoRoute from "./upload-success/Route";
import { linkToUploadSuccess } from "./upload-success/links";

type Props = {
  user: User;
  usersLeaderboard: any;
  reloadPhotos: () => void;
  photosToModerate: Photo[];
  handleApproveClick: () => void;
  handleRejectClick: () => void;
  gpsLocation: any;
  online: boolean;
  geojson: any;
  handlePhotoClick: () => void;
  selectedFeature: any;
  handlePhotoPageClose: () => void;
  totalNumberOfPieces: number;
  sponsorImage?: string;
};

export function Routes({
  user,
  usersLeaderboard,
  reloadPhotos,
  photosToModerate,
  handleApproveClick,
  handleRejectClick,
  gpsLocation,
  online,
  geojson,
  handlePhotoClick,
  selectedFeature,
  handlePhotoPageClose,
  totalNumberOfPieces,
  sponsorImage
}: Props) {
  const history = useHistory();
  return (
    <Switch>
      <Route path={linkToUploadSuccess()}>
        <UploadPhotoRoute
          totalNumberOfPieces={totalNumberOfPieces}
          sponsorImage={sponsorImage}
        />
      </Route>
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
        render={(props) => (
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
        render={(props) => (
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
        render={(props) => (
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
          label={config.PAGES.moderator.label}
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

      <Route path={linkToPhotoPage()}>
        <PhotoRoute />
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
        render={({ location }) => (
          <DisplayPhoto
            user={user}
            config={config}
            handleRejectClick={handleRejectClick}
            handleApproveClick={handleApproveClick}
            handleClose={handlePhotoPageClose}
            feature={selectedFeature}
            location={location}
          />
        )}
      />
    </Switch>
  );
}
