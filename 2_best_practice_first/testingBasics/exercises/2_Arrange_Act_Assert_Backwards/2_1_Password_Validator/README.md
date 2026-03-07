# 2_1_password_validator

## Responsibilities:

Write a function (or a stateless class) for validating passwords. Passwords must meet the following criteria:

* Between 5 and 15 characters long
* Contains at least one digit
* Contains at least one upper case letter
* Return an object containing a boolean result and an errors key that — when provided with an invalid password —
  contains an error message or type for all errors in occurrence. There can be multiple errors at a single time.

### Examples

* Valid passwords:
    * "Passw0rd"
    * "123Password"

* Invalid passwords:
    * Is not between 5 and 15 characters long
        * "P4ss"
        * "This1sAVeryLongPassword"
    * Does not contain numbers
      * "Password"
    * Does not contain uppercase letters
        * "password123"
    * Can handle multiple errors at a single time
        * "paas" // 3 errors
        * "password123" // 2 errors
        * "PASSWORD" // 2 errors 


## Get started
To install dependencies:

```bash
bun install
```

To test:

```bash
bun test:dev
```