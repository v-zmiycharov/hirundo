Feature: User sign out
  Every user of the system should be able to sign out
  of the system.

  Scenario: User sign out
    Given I have signed up
    When I enter my credentials
    And I sign out
    Then I should not be authenticated