import { subMinutes } from "date-fns";

const timeouts = [];

async function notify(event) {
  await browser.windows.create({
    url: "/notification.html",
    focused: true,
    type: "popup",
    allowScriptsToClose: true,
    state: "fullscreen",
  });
  setTimeout(() => {
    browser.runtime.sendMessage({
      type: "notification",
      data: {
        ...event,
      },
    });
  }, 1000);
}

function loadNotifications(events) {
  console.log(events);

  for (let event of events) {
    const timeoutMs = subMinutes(
      event.start.dateTime - new Date(),
      2
    ).getTime();
    const timeout = setTimeout(() => notify(event), timeoutMs);

    timeouts.push({
      timeout,
      timeoutMs,
      event,
    });
    console.log(`Set timeout for ${event.summary}`);
  }

  localStorage.setItem("timers", JSON.stringify(timeouts));

  console.log("Notifications loaded");
}

function clearNotifications() {
  for (let timeout of timeouts) {
    clearTimeout(timeout.timeout);
  }
  timeouts.length = 0;
  localStorage.setItem("timers", JSON.stringify(timeouts));
}

browser.runtime.onMessage.addListener(function (data) {
  if (data.type === "loadNotifications") {
    console.log("Events received, loading notifications...");
    clearNotifications();
    const events = data.data;
    loadNotifications(events);
    return;
  } else if (data.type === "stopNotifications") {
    clearNotifications();
  }

  console.log("Hello from the background");
});
