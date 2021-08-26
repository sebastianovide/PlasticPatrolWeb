import { uniqueId } from "lodash";

import { Mission } from "../../types/Missions";
import { sortMissions } from "../missions";

const now = new Date();

describe("sortMissions", () => {
  it("puts active missions before upcoming or finished ones", () => {
    const activeMission = mission();
    const upcomingMission = mission({
      timeSinceStart: -1,
      timeLeft: 5
    });
    const finishedMission = mission({
      timeSinceStart: 2,
      timeLeft: -1
    });

    expect(
      sortMissions([finishedMission, upcomingMission, activeMission])
    ).toEqual([activeMission, upcomingMission, finishedMission]);
  });

  it("sorts active missions by precedence, putting missions with greater precedence first", () => {
    const highest = mission({ precedence: 2, timeLeft: 2 });
    const middle = mission({ precedence: 1, timeLeft: 4 });
    const lowest = mission({ precedence: 0, timeLeft: 3 });

    expect(sortMissions([middle, lowest, highest])).toEqual([
      highest,
      middle,
      lowest
    ]);
  });

  it("sorts finished missions by order of closest end date, ignoring precedence", () => {
    const yesterday = mission({ timeLeft: -1 });
    const lastMonth = mission({ timeLeft: -30, precedence: 3 });
    const lastYear = mission({ timeLeft: -365 });

    expect(sortMissions([lastMonth, lastYear, yesterday])).toEqual([
      yesterday,
      lastMonth,
      lastYear
    ]);
  });

  it("sorts active missions with the same precedence by closest end date first", () => {
    const tomorrow = mission({ timeLeft: 1, id: "tomorrow" });
    const nextWeek = mission({ timeLeft: 7, id: "next-week" });
    const nextWeekHighPrecedence = mission({ timeLeft: 7, precedence: 1 });
    const nextMonth = mission({ timeLeft: 30, id: "next-month" });

    expect(
      sortMissions([nextWeekHighPrecedence, nextMonth, tomorrow, nextWeek])
    ).toEqual([nextWeekHighPrecedence, tomorrow, nextWeek, nextMonth]);
  });
});

function mission({
  id = uniqueId(),
  precedence = 0,
  timeLeft = 1,
  timeSinceStart = 1
}: {
  id?: string;
  timeLeft?: number;
  precedence?: number;
  timeSinceStart?: number;
} = {}) {
  const start = new Date(now);
  start.setDate(now.getDate() - timeSinceStart);

  const end = new Date(now);
  end.setDate(now.getDate() + timeLeft);

  return {
    id,
    startTime: start.getTime(),
    endTime: end.getTime(),
    precedence
  } as Mission;
}
