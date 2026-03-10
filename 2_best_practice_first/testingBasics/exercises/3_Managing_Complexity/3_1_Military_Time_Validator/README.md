## Responsibilities

Write a function (or a stateless class) capable of validating whether a string time range is a valid military time range or not.

- Make sure there's a time range, not a single time.
- Make sure the time range is in 24-hour format.
- Make sure the time range is in the correct order.
- Make sure the time range is in the correct format.

### Examples

- Here are some string examples.

Valid:
- "01:12 - 14:32"
- "22:00 - 23:12"

Invalid:
- Time range is not in 24-hour format.
- "25:00 - 12:23"
- "12:23 - 25:00"
- "12:61 - 13:00"
- "25:61 - 13:00"

- Missing time range.
- "12:23 - 12:23"
- "12-00"

- Time range is not in the correct order.
- "12:23 - 11:23"
- "22:00 - 01:12"

- Time range is not in the correct format.
- "12:23"
- "12:23:00"
- "11:35:00 - 12:30"
- "18:23:00 - 20:30:00"