# Authentication Security Notes

This document records authentication-related security decisions for the Kerno MVP and future improvements to consider before any official production deployment.

## Current MVP decision

For the current MVP, the minimum password length is set to 8 characters.

This is an intentional MVP decision, not a final production security standard.

The current goal of the MVP authentication scope is to implement a first working authentication flow with:

* user registration
* user login
* password hashing before storage
* safe user responses
* JWT-based authentication response
* basic validation
* basic authentication error handling

The MVP does not aim to implement a complete production-grade authentication policy yet.

## OWASP reference

The authentication flow should eventually be reviewed against OWASP authentication recommendations.

OWASP highlights that password strength should not rely only on complexity rules such as requiring uppercase letters, numbers, or special characters.

Important OWASP-related points to consider later:

* enforce a minimum password length
* allow long passwords and passphrases
* avoid silently truncating passwords
* avoid unnecessary password composition rules
* block common or previously breached passwords
* consider a password strength meter
* add protections against automated attacks
* consider multi-factor authentication for stronger account protection

OWASP also indicates that password expectations should be stronger when multi-factor authentication is not enabled.

## Current safeguards

The current MVP authentication implementation includes:

* passwords are hashed before being stored
* raw passwords are never stored
* password hashes are never returned in API responses
* login errors use a generic message for invalid credentials
* accepted roles are limited to `SUPPLIER` and `STORE`
* a JWT token is returned after successful registration or login

## Future security hardening

Before a V2, beta launch, or official production deployment, the authentication system should be reviewed and strengthened.

Recommended improvements:

* increase the minimum password length to 12 or 15 characters
* add checks against weak or compromised passwords
* add login rate limiting
* add temporary throttling after repeated failed login attempts
* consider account lockout rules for suspicious activity
* improve JWT expiration strategy
* consider refresh tokens if the product needs long sessions
* consider secure HTTP-only cookies instead of storing tokens client-side
* add email verification if needed
* add password reset flow
* add re-authentication for sensitive actions
* add authentication logs and monitoring
* consider multi-factor authentication for sensitive accounts or future admin accounts

## Multi-factor authentication note

MFA is not included in the current MVP.

It should be reconsidered before a real production launch, especially if the product later includes:

* admin accounts
* supplier financial data
* sensitive store information
* paid subscriptions
* account settings with business impact
* access to invoices, payments, or commercial documents

## Out of scope for the current MVP

The following features are intentionally left for later iterations:

* OAuth
* password reset
* email verification
* refresh token rotation
* multi-factor authentication
* advanced role-based access control
* login rate limiting
* account lockout
* breached-password checks
* full production security policy

## Decision summary

The current 8-character minimum password rule is acceptable for the MVP learning and validation phase.

It must be revisited before any serious public deployment.
