# User Role Enum Alignment Note

This document records a Stage 4 implementation clarification related to the user role field defined during Stage 3.

---

## Context

In the Stage 3 database design, the user role field was documented as a simple conceptual field.

During the Stage 4 implementation, this field was strengthened in the Prisma schema by using a strict `UserRole` enum instead of a generic string value.

This clarification helps explain the difference between the Stage 3 design document and the Stage 4 technical implementation.

---

## Implementation Decision

The Prisma schema now defines the following role enum:

```prisma
enum UserRole {
  SUPPLIER
  STORE
}
```

The `User.role` field uses this enum in the implemented database schema.

This means that only valid MVP user roles can be stored in the database.

---

## Reasoning

This decision improves the Stage 4 implementation without changing the MVP scope.

It helps to:

* prevent invalid role values in the database;
* keep supplier and store roles explicit;
* make authentication and role protection safer to implement;
* keep the backend aligned with the MVP user model defined in Stage 3;
* make the code easier to explain during the technical manual review.

---

## Scope Impact

This is not a product scope change.

The MVP still supports the same two main user roles:

* supplier;
* store.

The change only makes the technical implementation more robust.

No additional user role, feature, permission system, or advanced access control has been added through this decision.

---

## Stage 3 / Stage 4 Alignment

The Stage 3 documentation defines the expected user roles at a conceptual level.

The Stage 4 implementation keeps the same functional logic but makes the database model stricter by using an enum.

This means the implementation remains aligned with the Stage 3 MVP design while improving data consistency.

---

## Manual Review Explanation

During Stage 4 implementation, the user role field was strengthened from a generic conceptual field into a Prisma `UserRole` enum with `SUPPLIER` and `STORE`.

This improves data consistency and prevents invalid role values while keeping the implementation aligned with the Stage 3 MVP design.

The decision is technical, limited in scope, and does not modify the functional perimeter of the MVP.

---

## Related Files

Relevant implementation files:

```text
backend/prisma/schema.prisma
backend/src/modules/auth/auth.service.js
docs/security/EN_AUTH_SECURITY_NOTES.md
```

---

## Decision Summary

Using a Prisma enum for user roles is a small but important implementation improvement.

It keeps the MVP simple while making the database and authentication flow safer, clearer, and easier to maintain.
