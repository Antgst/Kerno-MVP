# User Role Enum Alignment Note

This document records a Stage 4 implementation clarification related to the user role field defined during Stage 3.

## Context

In the Stage 3 database design, the user role field was documented as a simple conceptual field.

During the Stage 4 implementation, this field was strengthened in the Prisma schema by using a strict `UserRole` enum instead of a generic string value.

## Implementation decision

The Prisma schema now defines the following role enum:

```prisma
enum UserRole {
  SUPPLIER
  STORE
}
