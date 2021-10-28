import Button from "@material-ui/core/Button";
import { DesktopPhotoFallback } from "../../../components/common/DesktopPhotoFallback";
import AddPhotoDialog from "../../photo/components/AddPhotoDialog/AddPhotoDialog";
import React, { ChangeEvent, createRef, useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../../standard.module.scss";
import {
  Mission,
  ConfigurableMissionData,
  coverPhotoIsMetaData,
  isSameDay,
  getDaysBetweenTimes
} from "../../../types/Missions";
import {
  CordovaCameraImage,
  ImageMetadata,
  isCordovaCameraImage
} from "../../../types/Photo";
import { useGPSLocation } from "../../../providers/LocationProvider";
import loadPhoto from "../../photo/pages/CategorisePhotoPage/utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import thumbnailBackup from "../../../assets/images/mission-thumbnail-backup.png";
import { Capacitor } from "@capacitor/core";

const MISSION_NAME_LIMIT = 100;
const MISSION_DESCRIPTION_LIMIT = 200;
const MISSION_PIECE_TARGET_LIMIT = 10000000;

const useStyles = makeStyles((theme) => ({
  form: {
    height: "100%",
    display: "flex",
    flexFlow: "column"
  },

  inputLengthTracker: {
    width: "100%",
    textAlign: "right",
    color: styles.darkGrey
  },

  name: {
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    marginBottom: "5px",
    background: styles.lightGrey,
    fontSize: 16,
    boxSizing: "border-box",
    width: "100%",
    textOverflow: "ellipsis",
    "&:focus": {
      outline: "none"
    }
  },

  description: {
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    marginTop: "5px",
    background: styles.lightGrey,
    fontSize: 15,
    boxSizing: "border-box",
    width: "100%",
    textOverflow: "ellipsis",
    fontFamily: theme.typography.fontFamily,
    "& input": {
      font: "inherit"
    },
    "&:focus": {
      outline: "none"
    }
  },

  pieceTargetWrapper: {
    padding: `${theme.spacing(0.5)}px 0px`
  },

  pieceTarget: {
    border: "none",
    borderRadius: "5px",
    padding: `${theme.spacing(0.5)}px 0px`,
    background: styles.lightGrey,
    fontSize: 16,
    boxSizing: "border-box",
    width: "100%",
    textOverflow: "ellipsis",
    "&:focus": {
      outline: "none"
    }
  },

  coverPhotoWrapper: {
    width: "100%",
    textAlign: "center",
    padding: `${theme.spacing(0.5)}px 0px`
  },

  coverPhotoPreview: {
    maxWidth: "100%",
    maxHeight: "180px"
  },

  addPhotoButton: {
    margin: `${theme.spacing(0.5)}px 0px`,
    color: `white`,
    backgroundColor: theme.palette.primary.main
  },

  date: {
    padding: `${theme.spacing(0.5)}px 0px`
  },

  fieldLabel: {
    color: styles.darkGrey,
    fontSize: 14
  },

  dateSummary: {
    color: theme.palette.primary.main,
    padding: `${theme.spacing(0.5)}px 0px`,
    fontSize: 14
  },

  inputWarning: {
    color: "#f00",
    margin: "5px 0"
  },

  dateInput: {
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    background: styles.lightGrey,
    fontSize: 16,
    boxSizing: "border-box",
    textOverflow: "ellipsis",
    "&:focus": {
      outline: "none"
    }
  },

  privateToggleWrapper: {
    padding: `${theme.spacing(1)}px 0px`
  },

  privateToggleInfo: {
    color: `${theme.palette.primary.main}`,
    textDecoration: `underline`
  }
}));

function validateStringInput(
  input: string,
  lengthLimit: number,
  setter: (newValue: string) => void
) {
  if (input.length > lengthLimit) {
    return;
  }

  setter(input);
}

function validateNumberInput(
  input: string,
  limit: number,
  setter: (newValue: number) => void
) {
  if (parseInt(input) > limit) {
    return;
  }

  setter(parseInt(input));
}

type Props = {
  initialData?: Mission;
  refreshCounter: number;
  onMissionDataUpdated: (mission: ConfigurableMissionData) => void;
};

export default function MissionForm({
  initialData,
  refreshCounter,
  onMissionDataUpdated
}: Props) {
  const classes = useStyles();
  const gpsLocation = useGPSLocation();
  const { t } = useTranslation();

  // Magic for handling photo uploads.
  const desktopPhotoRef = createRef<HTMLInputElement>();
  const handlePhotoSelect = (
    image: File | CordovaCameraImage,
    fromCamera: boolean
  ) => {
    const fileState = isCordovaCameraImage(image)
      ? {
          fileOrFileName: Capacitor.convertFileSrc(image.filename),
          cordovaMetadata: JSON.parse(image.json_metadata),
          fromCamera: fromCamera
        }
      : { fileOrFileName: image, fromCamera: fromCamera };
    loadPhoto({
      ...fileState,
      fromCamera,
      gpsLocation,
      callback: setCoverPhoto
    });

    if (Capacitor.platform !== "web") {
      setOpenPhotoDialog(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetPieces, setTargetPieces] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPrivateMissionInfo, setShowPrivateMissionInfo] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [coverPhoto, setCoverPhoto] = useState<
    ImageMetadata | string | undefined
  >();
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);

  // If we're editing an existing mission, the parent component passes an initialMission
  // prop. We should allow users to discard changes, easy way to do this is have this form
  // component reset itself to this initial data just by us pushing a state change.
  useEffect(() => {
    if (initialData !== undefined) {
      let initialStartDate = new Date();
      initialStartDate.setTime(initialData.startTime);
      let initialEndDate = new Date();
      initialEndDate.setTime(initialData.endTime);

      setName(initialData.name);
      setDescription(initialData.description);
      setTargetPieces(initialData.targetPieces);
      setIsPrivate(initialData.isPrivate);
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setCoverPhoto(initialData.coverPhotoUrl || thumbnailBackup);
    }
  }, [initialData, refreshCounter]);

  // Keep parent updated on whether the current data in form makes up a valid mission.
  useEffect(() => {
    onMissionDataUpdated({
      name,
      description,
      targetPieces,
      coverPhoto,
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
      isPrivate
    });
  }, [
    name,
    description,
    targetPieces,
    coverPhoto,
    startDate,
    endDate,
    isPrivate,
    onMissionDataUpdated
  ]);

  const updateStartDate = (e: ChangeEvent<HTMLInputElement>) => {
    let date = new Date(e.currentTarget.value);
    // Arbitrary start at 2am, I think daylight savings means setting
    // this to midnight messes things ups.
    date.setHours(2, 0, 0);
    setStartDate(date);
  };

  const updateEndDate = (e: ChangeEvent<HTMLInputElement>) => {
    let date = new Date(e.currentTarget.value);
    // Set mission to end at the end of the last day.
    date.setHours(23, 59, 59);
    setEndDate(date);
  };

  const missionDurationDays = getDaysBetweenTimes(
    startDate.getTime(),
    endDate.getTime()
  );

  const isEditingExistingMission = initialData !== undefined;

  return (
    <div>
      <input
        placeholder={t("missions_name_placeholder")}
        className={classes.name}
        value={name}
        onChange={(e) =>
          validateStringInput(e.target.value, MISSION_NAME_LIMIT, setName)
        }
      />
      <div className={classes.inputLengthTracker}>
        {name.length}/{MISSION_NAME_LIMIT}
      </div>
      <textarea
        placeholder={t("missions_description_placeholder")}
        className={classes.description}
        value={description}
        rows={3}
        onChange={(e) =>
          validateStringInput(
            e.target.value,
            MISSION_DESCRIPTION_LIMIT,
            setDescription
          )
        }
      />
      <div className={classes.inputLengthTracker}>
        {description.length}/{MISSION_DESCRIPTION_LIMIT}
      </div>

      <div className={classes.pieceTargetWrapper}>
        <div className={classes.fieldLabel}>{t("missions_target_pieces")}</div>
        <input
          className={classes.pieceTarget}
          type="number"
          value={targetPieces.toString()}
          onChange={(e) =>
            validateNumberInput(
              e.target.value,
              MISSION_PIECE_TARGET_LIMIT,
              setTargetPieces
            )
          }
        />
      </div>

      {coverPhoto && (
        <div className={classes.coverPhotoWrapper}>
          <img
            src={
              coverPhoto &&
              (coverPhotoIsMetaData(coverPhoto)
                ? coverPhoto.imgSrc
                : coverPhoto)
            }
            className={classes.coverPhotoPreview}
            alt={""}
          />
        </div>
      )}

      <Button
        className={classes.addPhotoButton}
        // @ts-ignore
        onClick={() =>
          !!window.cordova
            ? setOpenPhotoDialog(true)
            : desktopPhotoRef.current && desktopPhotoRef.current.click()
        }
        color="default"
        variant="contained"
      >
        {coverPhoto !== undefined ? t("missions_change_cover_photo") : t("missions_add_cover_photo")}
      </Button>
      <DesktopPhotoFallback
        ref={desktopPhotoRef}
        handlePhotoSelect={handlePhotoSelect}
      />
      {openPhotoDialog && (
        <AddPhotoDialog
          onClose={() => setOpenPhotoDialog(false)}
          handlePhotoSelect={handlePhotoSelect}
        />
      )}

      <div className={classes.date}>
        <div className={classes.fieldLabel}>{t("missions_start_date")}</div>
        <input
          className={classes.dateInput}
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={updateStartDate}
        />
      </div>

      <div className={classes.date}>
        <div className={classes.fieldLabel}>{t("missions_end_date")}</div>
        <input
          className={classes.dateInput}
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={updateEndDate}
        />
      </div>

      {!isSameDay(startDate, today) && endDate < startDate && (
        <div className={classes.inputWarning}>
          {t("missions_end_date_warning")}
        </div>
      )}

      {missionDurationDays > 0 && (
        <div className={classes.dateSummary}>
          <Trans
            i18nKey="missions_duration_day"
            count={missionDurationDays}
          >
            Mission will run for {{ count: missionDurationDays }} day
          </Trans>
        </div>
      )}

      {!isEditingExistingMission && (
        <div className={classes.privateToggleWrapper}>
          <input
            type="radio"
            checked={isPrivate}
            value={"Private mission"}
            onChange={() => {}}
            onClick={() => setIsPrivate(!isPrivate)}
          />
          {t("missions_private_radio_label")}{" "}
          <span
            className={classes.privateToggleInfo}
            onClick={() => setShowPrivateMissionInfo(true)}
          >
            {t("missions_private_link")}
          </span>
        </div>
      )}

      <Dialog open={showPrivateMissionInfo}>
        <DialogContent className={"dialogs__contentProgress"}>
          <DialogContentText id="loading-dialog-text">
            {t("missions_private_description")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowPrivateMissionInfo(false)}
            color="primary"
          >
            {t("ok_button_text")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
