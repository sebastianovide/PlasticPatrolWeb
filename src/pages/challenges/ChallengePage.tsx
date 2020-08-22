import React from "react";
import {makeStyles, useTheme} from "@material-ui/core/styles";

import PageWrapper from "components/PageWrapper";
import Challenge from "../../types/Challenges";
import 'react-circular-progressbar/dist/styles.css';
import {useHistory, useParams} from "react-router-dom";

import Button from "@material-ui/core/Button";
import {UserPieceRankTable} from "../../components/Leaderboard";
import {Line} from 'rc-progress';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexFlow: "column",
    },

    pictureWrapper: {
        flex: "0 0 auto",
        height: "200px",
        overflow: "hidden",
        textAlign: "center"
    },

    picture: {
        objectFit: "cover",
        width: "100%",
    },

    detailWrapper: {
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
    },

    description: {
        flex: "1 1 auto",
        padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
        fontSize: 13,
    },

    progressWrapper: {
        padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    },

    progressText: {
        color: "black",
        fontSize: 13,
        fontWeight: "bold",
    },

    joinButtonWrapper: {
        width: "100%",
        textAlign: "center",
        paddingBottom: `${theme.spacing(1)}px`,
    },

    joinButton: {},

    tableWrapper: {
        flex: "1 1 auto",
    }
}));

type Props = {
    user: { id?: string };
    challenges: Challenge[];
};

export default function ChallengePage({user, challenges}: Props) {
    const classes = useStyles();
    const themes = useTheme();

    const history = useHistory();
    const handleBack = () => history.goBack();

    const {challengeId} = useParams();
    const challenge = challenges.find(ch => ch.id.toString() === challengeId);
    if (challenge === undefined) {
        return <div>Could not find challenge</div>
    }

    const challengeProgress = (challenge.currentPieces / challenge.targetPieces) * 100

    return (
        <PageWrapper label={challenge.name}
                     navigationHandler={{handleBack}}
                     className={classes.wrapper}>
            <div className={classes.pictureWrapper}>
                <img src={challenge.picture} className={classes.picture}/>
            </div>
            <div className={classes.detailWrapper}>
                <div className={classes.description}>{challenge.description}</div>
                <div className={classes.progressWrapper}>
                    <div className={classes.progressText}>
                        {challenge.currentPieces}/{challenge.targetPieces} pieces of litter collected so far!
                    </div>
                    <Line percent={challengeProgress}
                          strokeWidth={2}
                          trailWidth={2}
                          strokeColor={themes.palette.secondary.main}/>
                </div>
                {user && user.id && (
                    <div className={classes.joinButtonWrapper}>
                        <div className={classes.joinButton}>
                            <Button onClick={() => {
                            }}
                                    color="primary"
                                    variant="contained">
                                Join Challenge
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div className={classes.tableWrapper}>
                <UserPieceRankTable usersLeaderboard={challenge.users}
                                    user={user}/>
            </div>
        </PageWrapper>
    );
}
