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
- "25:00 - 12:23"
- "12:23 - 25:00"
- "12:23 - 12:23"
- "12:61 - 13:00"
- "25:61 - 13:00"
- "12-00"