Feature: Get user by email

  Scenario: Obtain user by email
    Given That I an existing user
    When I try to look for the email of the user
    Then I get a succesful response with the details of the user

  Scenario: Invalid or missing fields
    When I try to look for the user but I forget to add the email
    Then I get a validation error

  Scenario: User does not exist on database
    Given that I have an email of an unregistered user
    When I try to look for a user that doesnt exist
    Then the system warns me that the user does not exist