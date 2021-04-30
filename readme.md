# FOCAS - Flow-optimised Calendar Auto Scheduler

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
