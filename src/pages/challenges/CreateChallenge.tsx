import React, {createRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import PageWrapper from "components/PageWrapper";
import 'react-circular-progressbar/dist/styles.css';
import {useHistory} from "react-router";
import styles from "../../standard.scss";
import Button from "@material-ui/core/Button";
import {Route} from "react-router-dom";
import {linkToAddChallengeCoverPhotoDialog} from "../../routes/challenges/links";
import AddPhotoDialog from "../photo/components/AddPhotoDialog/AddPhotoDialog";
import {CordovaCameraImage, ImageMetadata, isCordovaCameraImage} from "../../types/Photo";
import {DesktopPhotoFallback} from "../../components/common/DesktopPhotoFallback";
import loadPhoto from "../photo/pages/CategorisePhotoPage/utils";
import {useGPSLocation} from "../../providers/LocationProvider";

const CHALLENGE_NAME_LIMIT = 100;
const CHALLENGE_DESCRIPTION_LIMIT = 300;
const CHALLENGE_PIECE_TARGET_LIMIT_LENGTH = 6;

const useStyles = makeStyles((theme) => ({
    wrapper: {
        padding: "5%",
    },

    form: {
        height: "100%",
        display: "flex",
        flexFlow: "column",
    },

    inputLengthTracker: {
        width: "100%",
        textAlign: "right",
        marginTop: "5px",
        marginBottom: "5px",
        color: styles.mediumGrey,
    },

    name: {
        border: "none",
        borderRadius: "5px",
        padding: "5px",
        background: styles.lightGrey,
        fontSize: 16,
        boxSizing: "border-box",
        width: "100%",
        textOverflow: "ellipsis",
        "&:focus": {
            outline: "none"
        },
    },

    description: {
        border: "none",
        borderRadius: "5px",
        padding: "5px",
        background: styles.lightGrey,
        fontSize: 16,
        boxSizing: "border-box",
        width: "100%",
        textOverflow: "ellipsis",
        fontFamily: theme.typography.fontFamily,
        '& input': {
            font: 'inherit',
        },
        "&:focus": {
            outline: "none"
        },
    },

    pieceTarget: {
        border: "none",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "10px",
        background: styles.lightGrey,
        fontSize: 16,
        boxSizing: "border-box",
        width: "100%",
        textOverflow: "ellipsis",
        "&:focus": {
            outline: "none"
        },
    },

    coverPhotoWrapper: {
        width: "100%",
    },

    coverPhotoPreview: {},

    addPhotoButton: {
        marginBottom: "10px",
    },

    dateWrapper: {},

    dateLabel: {
        color: styles.mediumGrey,
        fontSize: 14,
    },

    dateSummary: {
        color: theme.palette.primary.main,
        fontSize: 14,
        marginBottom: "10px",
    },

    inputWarning: {
        color: "#f00",
        marginBottom: "10px",
    },

    dateInput: {
        border: "none",
        borderRadius: "5px",
        padding: "5px",
        marginBottom: "10px",
        background: styles.lightGrey,
        fontSize: 16,
        boxSizing: "border-box",
        textOverflow: "ellipsis",
        "&:focus": {
            outline: "none"
        },
    },

    privateToggleWrapper: {
        marginBottom: "10px",
    },

    submitButton: {
        width: "100%",
    }
}));

type Props = {};

function validateInput(input: string, lengthLimit: number, setter: (newValue: string) => void,
                       numberOnly: boolean = false) {
    if (input.length > lengthLimit) {
        return;
    }

    if (numberOnly && !/^[1-9]\d*$/.test(input)) {
        return;
    }

    setter(input);
}

function isChallengeReady(name: string, description: string, targetPieces: string,
                          coverPhoto: ImageMetadata | undefined, startDate: Date | null,
                          endDate: Date | null) {
    // Check challenge has a name and description
    return name !== "" && description !== ""
        // Has a valid number of pieces to collect
        && parseInt(targetPieces) != 0
        // Has selected a cover photo
        && coverPhoto !== undefined
        // Has a start date set from today onwards
        && startDate !== null && startDate > new Date()
        // Has an end date set after the start date
        && endDate !== null && endDate > startDate;
}

export default function CreateChallenge({}: Props) {
    const classes = useStyles();

    const today = new Date();

    const history = useHistory();
    const handleBack = {handleBack: () => history.goBack(), confirm: true};


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [targetPieces, setTargetPieces] = useState("0");
    const [isPrivate, setIsPrivate] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [coverPhoto, setCoverPhoto] = useState<ImageMetadata | undefined>();
    const desktopPhotoRef = createRef<HTMLInputElement>();
    const gpsLocation = useGPSLocation();
    const handlePhotoSelect = (image: File | CordovaCameraImage, fromCamera: boolean) => {
        const fileState = isCordovaCameraImage(image) ?
            {
                filePath: (image as CordovaCameraImage).filename,
                cordovaMetadata: JSON.parse((image as CordovaCameraImage).json_metadata as string),
                fromCamera: fromCamera
            } :
            {file: image, fromCamera: fromCamera};

        loadPhoto({fileState, fromCamera, gpsLocation, callback: setCoverPhoto});
    };

    const challengeReady = isChallengeReady(name, description, targetPieces, coverPhoto, startDate, endDate);

    return (
        <PageWrapper label={"Create a challenge"}
                     navigationHandler={handleBack}
                     className={classes.wrapper}>
            <div>
                <input
                    placeholder={"Enter a challenge name"}
                    className={classes.name}
                    value={name}
                    onChange={(e) => validateInput(e.target.value, CHALLENGE_NAME_LIMIT, setName)}
                />
                <div className={classes.inputLengthTracker}>{name.length}/{CHALLENGE_NAME_LIMIT}</div>
                <textarea
                    placeholder={"Enter a short description"}
                    className={classes.description}
                    value={description}
                    rows={3}
                    onChange={(e) => validateInput(e.target.value, CHALLENGE_DESCRIPTION_LIMIT, setDescription)}
                />
                <div className={classes.inputLengthTracker}>{description.length}/{CHALLENGE_DESCRIPTION_LIMIT}</div>

                <div className={classes.dateLabel}>Target pieces to collect</div>
                <input
                    className={classes.pieceTarget}
                    type="number"
                    value={targetPieces.toString()}
                    onChange={(e) => validateInput(e.target.value, CHALLENGE_PIECE_TARGET_LIMIT_LENGTH, setTargetPieces, true)}
                />
                <div className={classes.coverPhotoWrapper}>
                    <img src={coverPhoto && coverPhoto.imgSrc}
                         className={classes.coverPhotoPreview}/>
                </div>

                <Button className={classes.addPhotoButton}
                    // @ts-ignore
                    onClick={() => !!window.cordova
                        ? history.push(linkToAddChallengeCoverPhotoDialog())
                        : desktopPhotoRef.current && desktopPhotoRef.current.click()}
                    color="default"
                    variant="contained">
                    {(coverPhoto && coverPhoto.imgSrc) ? "Change cover photo" : "Add cover photo"}
                </Button>
                <DesktopPhotoFallback ref={desktopPhotoRef}
                                      handlePhotoSelect={handlePhotoSelect}/>
                <Route path={linkToAddChallengeCoverPhotoDialog()}>
                    <AddPhotoDialog onClose={() => history.goBack()}
                                    handlePhotoSelect={handlePhotoSelect}/>
                </Route>

                <div className={classes.dateWrapper}>
                    <div className={classes.dateLabel}>Start date</div>
                    <input className={classes.dateInput}
                           type="date"
                           onChange={(e) => setStartDate(new Date(e.currentTarget.value))}/>
                    {(startDate !== null && startDate < today) &&
                    <div className={classes.inputWarning}>
                        Start date cannot be in the past
                    </div>
                    }
                </div>

                <div className={classes.dateWrapper}>
                    <div className={classes.dateLabel}>End date</div>
                    <input className={classes.dateInput}
                           type="date"
                           onChange={(e) => setEndDate(new Date(e.currentTarget.value))}/>
                    {(startDate !== null && endDate !== null && endDate < startDate) &&
                    <div className={classes.inputWarning}>
                        Start date cannot be in the past
                    </div>
                    }
                </div>

                {(startDate !== null && endDate !== null && today <= startDate && startDate < endDate) &&
                <div className={classes.dateSummary}>
                    Challenge will run for {(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)} days
                </div>
                }

                <div className={classes.privateToggleWrapper}>
                    <input type="radio"
                           value={"Private challenge"}
                           checked={isPrivate}
                           onClick={() => setIsPrivate(!isPrivate)}/>
                    Private challenge
                </div>

                <Button className={classes.submitButton}
                        onClick={() => history.push(linkToAddChallengeCoverPhotoDialog())}
                        color="primary"
                        variant="contained"
                        disabled={!challengeReady}>
                    Create challenge
                </Button>
            </div>
        </PageWrapper>
    );
}
