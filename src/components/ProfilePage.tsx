// Profile page to display user details.

import React, { useCallback } from "react";

import _ from "lodash";

import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import "./ProfilePage.scss";
import PageWrapper from "./PageWrapper";
import MapLocation from "../types/MapLocation";
import Feature from "types/Feature";
import Geojson from "types/Geojson";
import User from "types/User";
import { Config } from "custom/config";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: 10,
    height: 100,
    width: 100
  },
  row: {
    display: "flex",
    width: "100%"
    // padding: `0 ${theme.spacing(2)}px`
  },
  colr: {
    flex: "50%",
    textAlign: "right"
  },
  coll: {
    flex: "50%",
    textAlign: "left"
  },
  centered: {
    textAlign: "center"
  }
}));

interface Props {
  user: User;
  label: string;
  geojson: Geojson;
  handlePhotoClick: (feature: Feature) => void;
  handleClose: () => void;
  config: Config;
}

const ProfilePage = ({
  user,
  label,
  geojson,
  handlePhotoClick,
  handleClose,
  config
}: Props) => {
  const classes = useStyles();

  const calcUrl = useCallback(
    (feature: Feature): string => {
      const mapLocation = new MapLocation(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        config.ZOOM_FLYTO
      );
      const urlFormated = mapLocation.urlFormated();
      return `${config.PAGES.displayPhoto.path}/${feature.properties.id}@${urlFormated}`;
    },
    [config]
  );

  const myPhotos =
    geojson &&
    geojson.features.filter((f) => f.properties.owner_id === user.id);
  const myLastPhotos: Feature[] = _.reverse(
    _.sortBy(myPhotos, (o) => o.properties.moderated)
  ).slice(0, 20);

  console.log(myLastPhotos);

  const numPieces = _.sumBy(myPhotos, (o) => o.properties.pieces);

  return (
    <PageWrapper label={label} navigationHandler={{ handleClose }}>
      <div className={"profile-info"}>
        <Avatar
          className={classes.avatar}
          alt="profile-image"
          src={user.photoURL}
        />
        <Typography gutterBottom variant="h5">
          {user.displayName}
        </Typography>
        <Typography component="p">{user.email}</Typography>
        <Typography>{user.location}</Typography>
        <Typography>{user.description}</Typography>

        <br />

        {myPhotos && (
          <Typography variant="body1">
            Num. of uploads <strong>{myPhotos.length}</strong>
          </Typography>
        )}
        {!isNaN(numPieces) && (
          <Typography variant="body1">
            Total Pieces <strong>{numPieces}</strong>
          </Typography>
        )}

        <br />

        {myLastPhotos.length && (
          <div>
            <Typography variant="h6" className={classes.centered}>
              Last {myLastPhotos.length} approved
            </Typography>

            {_.map(myLastPhotos, (photo) => (
              <div className={classes.centered} key={photo.properties.id}>
                <Typography variant="body1">
                  {photo.properties.pieces && (
                    <span>
                      <strong>{photo.properties.pieces}</strong> pieces{" "}
                    </span>
                  )}
                  <Link
                    to={calcUrl(photo)}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    {photo.properties.moderated.toDateString()}
                  </Link>
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
