import React, {useMemo, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router";

import PageWrapper from "components/PageWrapper";
import Challenge from "../../types/Challenges";

import 'react-circular-progressbar/dist/styles.css';

import styles from "standard.scss";
import Search from "@material-ui/icons/Search";
import ChallengeTab from "./ChallengeTab";
import {linkToCreateChallenge} from "../../routes/challenges/links";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexFlow: "column",
        padding: "5%",
    },

    searchWrapper: {
        flex: "0 0 auto",
        background: styles.lightGrey,
        width: "94%",
        margin: "0 3% 30px 3%",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
        boxSizing: "border-box",
        color: styles.darkgray,
        fontSize: 20,
    },

    searchInput: {
        border: "none",
        background: styles.lightGrey,
        fontSize: 16,
        marginLeft: theme.spacing(1),
        boxSizing: "border-box",
        width: "100%",
        textOverflow: "ellipsis",
        "&:focus": {
            outline: "none"
        },
    },

    challengeList: {
        flex: "0 0 auto",
    },
}));

type Props = {
    challenges: Challenge[];
    handleClose: () => void;
};

function getFilteredChallenges(searchPrefix: string, challenges: Challenge[]): Challenge[] {
    if (searchPrefix === "") {
        return challenges;
    }

    return challenges.filter(challenge => challenge.name.includes(searchPrefix));
}

export default function ChallengesHome({handleClose, challenges}: Props) {
    const history = useHistory();
    const classes = useStyles();
    const [searchPrefix, setSearchPrefix] = useState("")
    const filteredChallengeList = useMemo(() => getFilteredChallenges(searchPrefix, challenges), [searchPrefix, challenges]);
    return (
        <PageWrapper label={"Challenges"}
                     navigationHandler={{handleClose}}
                     className={classes.wrapper}
                     addAction={() => history.push(linkToCreateChallenge())}>
            <div className={classes.searchWrapper}>
                <Search style={{color: styles.darkgrey}}/>
                <input
                    placeholder={"Search"}
                    className={classes.searchInput}
                    value={searchPrefix}
                    onChange={(e) => setSearchPrefix(e.target.value)}
                />
            </div>
            <div className={classes.challengeList}>
                {(filteredChallengeList.map(challenge => <ChallengeTab challenge={challenge}/>))}
            </div>
        </PageWrapper>
    );
}
