# 3_2_boolean_calculator

## Responsibilities
Create a boolean calculator that takes a boolean expression (as a string) 
and evaluates it to compute the correct output boolean result

### Example

####  True Results

- Single
    - `"TRUE"`

- NOT operation
    - `"NOT FALSE"`

- OR operation
    - `"TRUE OR FALSE"`
    - `"TRUE OR TRUE"`

- AND operation
    - `"TRUE AND TRUE"`

- Combination
    - `"TRUE OR TRUE OR TRUE AND FALSE"`
    - `"TRUE OR FALSE AND NOT FALSE"`

- Parentheses
    - `"(TRUE OR FALSE) OR FALSE"`
    - `"(TRUE OR TRUE OR TRUE) AND (TRUE)"`

---

### False Results

- Single
    - `"FALSE"`

- NOT operation
    - `"NOT TRUE"`

- OR operation
    - `"FALSE OR FALSE"`

- AND operation
    - `"TRUE AND FALSE"`
    - `"FALSE AND FALSE"`

- Combination
    - `"FALSE AND NOT TRUE"`
    - `"FALSE OR FALSE AND TRUE"`

- Parentheses
    - `"(TRUE OR TRUE OR TRUE) AND FALSE"`
    - `"NOT (TRUE AND TRUE)"`
