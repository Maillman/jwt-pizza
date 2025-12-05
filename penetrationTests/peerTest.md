# Penetration Test Report

## Both Peer Names
Melvin Whitaker - http://pizza.melvinwhitaker.com/

Kobey Workman - https://pizza.jwtpizza329.click/

## Self Attack
Kobey's Self Attack

| Item           | Result                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Date           | Dec 3, 2025                                                                                             |
| Target         | pizza.jwtpizza329.click                                                                                 |
| Classification | Identification and Authentication Failures                                                              |
| Severity       | 3 (Medium)                                                                                              |
| Description    | Successful login using empty string as password                                                         |
| Corrections    | Update jwt pizza service to send 404 response when password is empty                                    |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 3, 2025                                                                                             |
| Target         | pizza.jwtpizza329.click                                                                                 |
| Classification | Security Misconfiguration                                                                               |
| Severity       | 2 (High)                                                                                                |
| Description    | Able to login using test diner, franchisee, admin credentials                                           |
| Corrections    | Update passwords for each of these users                                                                |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 3, 2025                                                                                             |
| Target         | pizza.jwtpizza329.click                                                                                 |
| Classification | Cryptographic Failures                                                                                  |
| Severity       | 1 (Critical)                                                                                            |
| Description    | Able to change pizza price to anything in transit                                                       |
| Corrections    | Added price validation to ensure purchased pizza price matches menu item                                |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 4, 2025                                                                                             |
| Target         | pizza.jwtpizza329.click                                                                                 |
| Classification | Identification and Authentication Failures                                                              |
| Severity       | 2 (High)                                                                                                |
| Description    | Able to delete any or all franchises as any user                                                        |
| Corrections    | Added check for admin privileges before allowing a franchise to be deleted                              |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 4, 2025                                                                                             |
| Target         | pizza.jwtpizza329.click                                                                                 |
| Classification | Identification and Authentication Failures                                                              |
| Severity       | 4 (Low)                                                                                                 |
| Description    | Able to view the menu even as an unauthenticated user                                                   |
| Corrections    | Added authentication step to ensure get menu endpoint is only able to be accessed by authenticated user |

Melvin's Self Attack


| Item           | Result                                                                   |
| -------------- | ------------------------------------------------------------------------ |
| Date           | Dec 3, 2025                                                              |
| Target         | pizza.melvinwhitaker.com                                                 |
| Classification | Identification and Authentication Failures                               |
| Severity       | 2 (High)                                                                 |
| Description    | Multiple registrations of the same email/password combination            |
| Corrections    | Check if duplicate user already exists                                   |
|                |                                                                          |
| Item           | Result                                                                   |
| Date           | Dec 3, 2025                                                              |
| Target         | pizza.melvinwhitaker.com                                                 |
| Classification | Security Misconfiguration                                                |
| Severity       | 2 (High)                                                                 |
| Description    | Able to login using test diner, franchisee, admin credentials            |
| Corrections    | Update passwords for each of these users                                 |
|                |                                                                          |
| Item           | Result                                                                   |
| Date           | Dec 3, 2025                                                              |
| Target         | pizza.melvinwhitaker.com                                                 |
| Classification | Identification and Authentication Failures                               |
| Severity       | 3 (Medium)                                                               |
| Description    | Successful login using empty string as password                          |
| Corrections    | Update jwt pizza service to send 404 response when password is empty     |
|                |                                                                          |
| Item           | Result                                                                   |
| Date           | Dec 3, 2025                                                              |
| Target         | pizza.melvinwhitaker.com                                                 |
| Classification | Cryptographic Failures                                                   |
| Severity       | 1 (Critical)                                                             |
| Description    | Able to change pizza price to anything in transit                        |
| Corrections    | Added price validation to ensure purchased pizza price matches menu item |
|                |                                                                          |
| Item           | Result                                                                   |
| Date           | Dec 3, 2025                                                              |
| Target         | pizza.melvinwhitaker.com                                                 |
| Classification | Identification and Authentication Failures                               |
| Severity       | 3 (Medium)                                                               |
| Description    | Able to view all users without admin privileges                          |
| Corrections    | Check privileges before hitting the get users endpoint                   |
|                |                                                                          |
| Item           | Result                                                                   |
| Date           | Dec 3, 2025                                                              |
| Target         | pizza.melvinwhitaker.com                                                 |
| Classification | Injection                                                                |
| Severity       | N/A                                                                      |
| Description    | SQL injection to drop database via the username in registration          |
| Corrections    | N/A                                                                      |
## Peer Attack
Attacking Melvin's Website

| Item           | Result                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Date           | Dec 4, 2025                                                                                             |
| Target         | [pizza.melvinwhitaker.com](http://pizza.melvinwhitaker.com)                                             |
| Classification | Security Misconfiguration                                                                               |
| Severity       | 3 (Medium)                                                                                              |
| Description    | Unsuccessful login using default diner, admin credentials                                               |
| Corrections    | No Correction                                                                                           |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 4, 2025                                                                                             |
| Target         | [pizza.melvinwhitaker.com](http://pizza.melvinwhitaker.com)                                             |
| Classification | Security Misconfiguration                                                                               |
| Severity       | N/A                                                                                                     |
| Description    | Password required on login endpoint                                                                     |
| Corrections    | No Correction                                                                                           |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 4, 2025                                                                                             |
| Target         | [pizza.melvinwhitaker.com](http://pizza.melvinwhitaker.com)                                             |
| Classification | Cryptographic Failures                                                                                  |
| Severity       | N/A                                                                                                     |
| Description    | Unable to change pizza price to anything in transit, stack shows on response                            |
| Corrections    | Remove Showing Stack on Reponse                                                                         |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 4, 2025                                                                                             |
| Target         | [pizza.melvinwhitaker.com](http://pizza.melvinwhitaker.com)                                             |
| Classification | Identification and Authentication Failures                                                              |
| Severity       | 2 (High)                                                                                                |
| Description    | Able to delete any or all franchises as any user                                                        |
| Corrections    | Added check for admin privileges before allowing a franchise to be deleted                              |
|                |                                                                                                         |
| Item           | Result                                                                                                  |
| Date           | Dec 4, 2025                                                                                             |
| Target         | [pizza.melvinwhitaker.com](http://pizza.melvinwhitaker.com)                                             |
| Classification | Identification and Authentication Failures                                                              |
| Severity       | 4 (Low)                                                                                                 |
| Description    | Able to view the menu even as an unauthenticated user                                                   |
| Corrections    | Added authentication step to ensure get menu endpoint is only able to be accessed by authenticated user |

Attacking Kobey's Website

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | Dec 4, 2025                                                     |
| Target         | pizza.jwtpizza329.click                                         |
| Classification | Identification and Authentication Failures                      |
| Severity       | 2 (High)                                                        |
| Description    | Multiple registrations of the same email/password combination   |
| Corrections    | Check if duplicate user already exists                          |
|                |                                                                 |
| Item           | Result                                                          |
| Date           | Dec 4, 2025                                                     |
| Target         | pizza.jwtpizza329.click                                         |
| Classification | Security Misconfiguration                                       |
| Severity       | N/A                                                             |
| Description    | Logging in with known email and password                        |
| Corrections    | N/A                                                             |
|                |                                                                 |
| Item           | Result                                                          |
| Date           | Dec 4, 2025                                                     |
| Target         | pizza.jwtpizza329.click                                         |
| Classification | Identification and Authentication Failures                      |
| Severity       | N/A                                                             |
| Description    | Logging in with empty string                                    |
| Corrections    | N/A                                                             |
|                |                                                                 |
| Item           | Result                                                          |
| Date           | Dec 4, 2025                                                     |
| Target         | pizza.jwtpizza329.click                                         |
| Classification | Cryptographic Failures                                          |
| Severity       | N/A                                                             |
| Description    | Changing the price of a pizza in transit                        |
| Corrections    | N/A                                                             |
|                |                                                                 |
| Item           | Result                                                          |
| Date           | Dec 4, 2025                                                     |
| Target         | pizza.jwtpizza329.click                                         |
| Classification | Identification and Authentication Failures                      |
| Severity       | 3 (Medium)                                                      |
| Description    | Able to view all users without admin privileges                 |
| Corrections    | Check privileges before hitting the get users endpoint          |
|                |                                                                 |
| Item           | Result                                                          |
| Date           | Dec 4, 2025                                                     |
| Target         | pizza.jwtpizza329.click                                         |
| Classification | Injection                                                       |
| Severity       | N/A                                                             |
| Description    | SQL injection to drop database via the username in registration |
| Corrections    | N/A                                                             |

## Combined Summary of Learnings

We both were able to perform and prevent penetrations on our individual websites. This allowed us to gain insights into where each of our sites were vulnerable to future attacks.

For Kobey, his website was able to resist certain login and authentication attacks, but failed to prevent duplicate registration attempts. From this he learned to better validate both login and registration. Kobey also learned from some attacks that were unsuccessful, such as an attempted SQL injection. Although the attack did not alter anything in the database, Kobey learned to be more cautious about sanitizing and vetting input field responses.

For Melvin, his website was also able to resist many authentication attacks, but did not prevent users of any role from deleting franchises. From this he learned that it is useful to ensure each endpoint is only allowed to be hit by those with the privileges necessary. Melvin also discovered that his site was not preventing an unauthenticated user from viewing the pizza menu. Although this is not a large concern, it provided an opportunity to review which endpoints can be accessed by users and even people who don't have authentication.

Overall, both Kobey and Melvin discovered the benefits of penetration testing, and hardening a website thouroughly. Covering several different attacks and methods in a comprehensive way is useful to make a website more secure and gain confidence about future performance.