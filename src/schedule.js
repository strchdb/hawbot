const ICAL = require("ical.js");
const axios = require("axios");

const icsUrl =
  "https://userdoc.informatik.haw-hamburg.de/lib/exe/fetch.php?media=stundenplan:bwi3-adp-02.ics";

axios
  .get(icsUrl)
  .then((response) => {
    const jcalData = ICAL.parse(response.data);
    const vevents = jcalData[2];

    const scheduleArray = [];

    for (let i = 1; i < vevents.length; i++) {
      const vevent = vevents[i];
      const rrule = vevent[1].find((prop) => prop[0] === "rrule");
      const summary = vevent[1].find((prop) => prop[0] === "summary")[3];
      const start = vevent[1].find((prop) => prop[0] === "dtstart")[3];
      const end = vevent[1].find((prop) => prop[0] === "dtend")[3];

      if (rrule) {
        const ruleSet = ICAL.Recur.fromData(rrule[3]);
        const iterator = new ICAL.RecurIterator(
          ruleSet,
          ICAL.Time.fromJSDate(new Date(start))
        );

        while (iterator.hasNext()) {
          iterator.next();
          const occurrenceData = {
            summary,
            start: start.toString(),
            end: end.toString(),
          };
          scheduleArray.push(occurrenceData);
        }
      } else {
        const eventData = {
          summary,
          start,
          end,
        };
        scheduleArray.push(eventData);
      }
    }

    console.log(scheduleArray);
  })
  .catch((error) => {
    console.error("Error fetching or parsing .ics file:", error);
  });
