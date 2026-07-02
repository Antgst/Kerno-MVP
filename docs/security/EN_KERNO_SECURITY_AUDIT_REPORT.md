# KERNO Security Audit Report

## 1. Context

This report documents the security audit work performed on the KERNO MVP backend and supporting security tooling.

- Audited branch: `experimental-pentesting-antoine`
- Stage: local audit and validation
- Pull request status: no pull request has been created at this stage
- Merge status: no merge has been created at this stage

The objective of this audit was to improve the MVP security posture, validate critical API protections, and provide a clear technical review artifact suitable for Holberton, portfolio presentation, and engineering review.

## 2. Executive Summary

The audit did not identify any critical or high-severity issues in the local static audit results. Several medium and low findings remain, mostly linked to improvement opportunities, dependency monitoring, and MVP hardening items.

Access control and production hardening were improved and tested. Both the API security smoke test and the production hardening smoke test completed with zero failures.

The main improvements cover CORS hardening, production API documentation exposure control, JSON payload size and parsing protections, safer production error handling, and stronger request ownership enforcement.

## 3. Scope

The audit scope included:

- Backend API security behavior
- Request access control and ownership checks
- Production hardening defaults
- JSON payload handling
- Error response behavior in production
- Local static security audit output
- Security smoke test automation and cleanup behavior
- Environment documentation clarity

The audit did not include:

- External penetration testing
- Infrastructure or cloud configuration review
- Centralized logging or alerting validation
- Browser-based frontend security testing beyond documented MVP risks
- Manual review of every dependency source package

## 4. Modified and Added Files

Security audit work on the audited branch includes the following additions and changes:

- Local static audit tool added: `tools/security-audit/kerno-security-audit.cjs`
- API security smoke test added: `tools/security-audit/kerno-api-security-smoke.cjs`
- Smoke test cleanup script added: `tools/security-audit/kerno-security-smoke-cleanup.cjs`
- Production hardening smoke test added: `tools/security-audit/kerno-production-hardening-smoke.cjs`
- Backend security hardening applied in the API layer and request service layer
- `backend/.env.example` clarified

This final report was added as:

- `docs/security/EN_KERNO_SECURITY_AUDIT_REPORT.md`

## 5. Security Fixes Implemented

The following security fixes were implemented and validated:

- CORS is hardened through `CORS_ORIGIN`.
- Swagger/OpenAPI is disabled by default in production.
- Swagger/OpenAPI can be explicitly enabled with `ENABLE_API_DOCS=true`.
- `express.json` is limited to `1mb`.
- Invalid JSON payloads are handled with a controlled response: `Invalid JSON payload`.
- `500` errors are hidden from clients in production while server-side logging remains active.
- `GET /requests/:id` is reinforced with `requireRole("STORE", "SUPPLIER")`.
- Request ownership is hardened in the service layer.
- `STORE` users can only read their own sent requests.
- `SUPPLIER` users can only read requests received by their supplier profile.
- Unsupported roles are rejected with `403`.
- `backend/.env.example` has been clarified.

## 6. Security Tests Added

The branch includes local security test tooling for repeatable validation:

- Static audit tool: `tools/security-audit/kerno-security-audit.cjs`
- API security smoke test: `tools/security-audit/kerno-api-security-smoke.cjs`
- Smoke test cleanup script: `tools/security-audit/kerno-security-smoke-cleanup.cjs`
- Production hardening smoke test: `tools/security-audit/kerno-production-hardening-smoke.cjs`

The API security smoke test validates authentication, authorization, ownership, rejected payload behavior, and security-sensitive request paths.

The production hardening smoke test validates production-oriented behavior such as API documentation being hidden by default, controlled JSON parsing errors, and safer production error responses.

## 7. Validation Results

### Static Audit

- Critical: 0
- High: 0
- Medium: 23
- Low: 60

### API Security Smoke Test

- Passed: 26
- Failed: 0

### Production Hardening Smoke Test

- Passed: 5
- Failed: 0

### Smoke Data Cleanup

- Users deleted: 4
- Supplier profiles deleted: 2
- Store profiles deleted: 2
- Products deleted: 1
- Contact requests deleted: 1

### Successful Validations

- `backend npm test`: OK
- `frontend npm run lint`: OK
- `frontend npm run build`: OK
- `node --check` on security scripts: OK
- `git diff --check`: OK

## 8. OWASP Mapping

| OWASP Category | Status | Notes |
| --- | --- | --- |
| A01 Broken Access Control | Improved and tested | Request route role checks and ownership enforcement were hardened. |
| A02 Security Misconfiguration | Improved and tested | CORS, production Swagger/OpenAPI exposure, JSON limits, and production error behavior were hardened. |
| A03 Software Supply Chain Failures | To monitor | 3 moderate backend findings remain linked to Prisma dependencies. |
| A04 Cryptographic Failures | Reviewed | Secrets are environment-based, and `.env.example` was cleaned. |
| A05 Injection | Reviewed | Local seed raw SQL was accepted as a false positive. |
| A06 Insecure Design | Reviewed | No blocking issue was identified for the MVP. |
| A07 Identification and Authentication Failures | Tested | Missing and invalid tokens are rejected. |
| A08 Software and Data Integrity Failures | Improved and tested | `supplierId` payload values are ignored where appropriate, and product/supplier mismatches are rejected. |
| A09 Security Logging and Monitoring Failures | Partially improved | Server-side logging for `5xx` errors was added, but centralized monitoring is not yet implemented. |
| A10 Server-Side Request Forgery / Exceptional Conditions | Improved and tested | Invalid JSON handling was validated with a controlled response. |

## 9. Remaining MVP Risks

The following risks remain acceptable for the current MVP stage but should be addressed before production readiness:

- The authentication token is still stored on the frontend side.
- Future improvement: move authentication storage to HTTP-only, Secure, SameSite cookies.
- No rate limiting is implemented yet.
- 3 moderate backend `npm audit` findings remain and should be reviewed before final delivery or deployment.
- Monitoring and alerting are still limited.
- No external penetration test was performed.

## 10. Audit Limitations

This audit was local and codebase-focused. It improves confidence in the current MVP implementation, but it does not replace a full external security assessment.

Known limitations:

- No external penetration test was performed.
- No infrastructure, hosting, or network-layer review was included.
- No centralized monitoring, SIEM, or alerting validation was performed.
- Dependency findings were identified for monitoring, but not fully remediated during this stage.
- The frontend token storage model remains an MVP risk.

Observed warning:

- A `pg` `DeprecationWarning` appeared during API smoke testing.
- It was non-blocking.
- No security or functional test failed because of it.
- It should be monitored during future Prisma/PostgreSQL upgrades.

## 11. Conclusion

The KERNO MVP security posture has been improved on branch `experimental-pentesting-antoine`.

The most important security improvements are now covered by automated smoke tests, including access control, ownership checks, production hardening behavior, invalid JSON handling, and controlled error responses.

At this stage, no critical or high-severity issue remains in the local static audit results, and all documented validation commands completed successfully. The remaining risks are known MVP limitations and should be tracked before final delivery or deployment.
