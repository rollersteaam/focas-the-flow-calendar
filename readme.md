# Focas - Flow-optimised Calendar Auto Scheduler

## How to Dev
Focas is a browser extension targeting Firefox and Chrome. This guide https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension has been followed for the most part to ensure both browsers can be hit. You could add support for other browsers in a pull request if you wanted :)

As a result of trying to do a cross-platform browser extension, for development, we use Firefox. For more info as to why (the TL;DR is because of polyfilling between Chrome and Firefox) read the guide linked above.

1. Start the Vue project builder: `cd source/app; npm run build`. You need to re-run this every time you make a change. `npm run watch` does not work, probably due to a race condition between watchers. If you want hot-reloading, consider using `npm run serve` instead and then using `npm run build` when you want to preview the app in its actual extension form.
2. In another terminal, `npm run watch`. This needs to be at the root directory. This will cause the extension to fully build and be ready for testing/distribution.
3. Go to `about:debugging` in Firefox and click `This Firefox`. Click `Add Temporary Addon` and point to the `manifest.json` file inside `distribution`. This will install the addon.
4. At this point, everything is setup and you can start deving. However, having to re-import the addon into your browser after every change is annoying, so it's recommended to install web-ext. Open another terminal and run `npm install --global web-ext` to install it, then run `web-ext run`. This should automatically re-install the extension when it changes.

## Spec

### Plan Day Prompt
If the day hasn't been confirmed and the user is using the browser, trigger a fullscreen popup that prompts the user to start planning the day, skip for 10 minutes or ignore for the whole day.

### Day Planner
1. Planning the day requires automatic events to populate the day a.k.a. a regular routine. The routine is expected to diverge, but to know of regular events or planned events is the first step. This is the first page of the app, the user can make adjustments to their regular routine.
2. The user is prompted to add any todos to their day.
3. The app then makes automatic adjustments to the events it can to optimise for the most amount of deep work time, which is essentially just a defragmentation process, with breaks added in between, aiming for around 3 hour work chunks. User can make manual adjustments after this.
4. User confirms and they go on with their day.

### Event Notifications
When a calendar event triggers, FOCAS shows a full screen notification showing the event. The user can confirm "I'm doing the event", or, they can say "my day has got off track". If the day has got off track, the Day Planner runs again.
