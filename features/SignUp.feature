Feature: User sign up
  Every user of the system should be able to sign up in order to
  then be able to authenticate and use the features

  Scenario: User sign up
    When I sign up
    And I enter my credentials
    Then I am authenticated