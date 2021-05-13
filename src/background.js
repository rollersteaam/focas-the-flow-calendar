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
    const timeout = setTimeout(
      () => notify(event),
      event.start.dateTime - new Date()
    );

    timeouts.push(timeout);
    console.log(`Set timeout for ${event.summary}`);
  }

  console.log("Notifications loaded");
}

function clearNotifications() {
  for (let timeout of timeouts) {
    clearTimeout(timeout);
  }
  timeouts.length = 0;
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
