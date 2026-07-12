# Repository Cleanup Audit

- **Project:** KERNO
- **Branch:** `clean-repo`
- **Date:** 2026-07-12
**Scope:** repository quality, readability, documentation consistency, generated files, unused assets, and final Stage 5 portfolio cleanliness.

---

## 1. Objective

This audit prepares the KERNO repository for its final Stage 5 portfolio submission.

The review focused on:

- tracked generated files and binary outputs;
- unused or ambiguously named assets;
- local files that must remain ignored;
- README accuracy and Stage 5 positioning;
- documentation consistency;
- broken relative links;
- security documentation references;
- final repository readability.

No application behavior, API route, database schema, or business logic was intentionally changed.

---

## 2. Generated Demo Video

### File

`scripts/demoday-video/output/kerno-demoday-demo.webm`

### Finding

- Size: approximately 8.8 MB.
- The file was a generated video output.
- No source-code or documentation reference to the file was found.
- The containing directory only held this generated binary.
- Binary video files cannot be meaningfully reviewed in a pull request.
- The file does not participate in the execution of KERNO.

### Decision

**Removed from Git and retained as a local backup outside the repository.**

The following ignore rule was added:

```gitignore
scripts/demoday-video/output/
```

### Historical note

Removing the file from the current tree does not remove it from previous Git commits.

Repository history was not rewritten because the collaboration risk and complexity would be disproportionate for one historical binary.

---

## 3. Unused Documentation Logo

### File

`docs/assets/kerno-logo2.png`

### Finding

- Size: 1,021,485 bytes, approximately 1 MB.
- No reference to the file was found in the application or documentation.
- The name `kerno-logo2.png` did not clearly describe its role.
- The active application logo is `frontend/src/assets/brand/kerno-logo.webp`.
- The root README uses `docs/assets/kerno-logo.png`.

### Decision

**Removed from Git and retained as a local backup outside the repository.**

The active WebP application logo and the README logo were preserved.

---

## 4. Unused Dashboard Background Asset

### File

`frontend/src/assets/store-dashboard-bg.png`

### Finding

- Size: 864,567 bytes, approximately 848 KB.
- No frontend import or CSS reference was found.
- The file was only listed in the frontend structure documentation.
- Its file signature identified it as an AVIF container despite its `.png` extension.
- It was not included in the generated Vite build.

### Decision

**Removed from Git and retained as a local backup outside the repository.**

Its obsolete entry was also removed from:

`docs/architecture/FRONTEND_STRUCTURE.md`

---

## 5. Generated and Local Files

The following local elements were verified as ignored and untracked:

```text
backend/.env
frontend/.env
backend/src/generated/prisma/
backend/tests/__pycache__/
frontend/dist/
.pytest_cache/
node_modules/
security-audit-reports/
.agents/
.codex/
```

### Decision

These files remain available locally where useful, but are not committed.

The root `.gitignore` was strengthened with:

```gitignore
__pycache__/
*.py[cod]
.pytest_cache/
```

This prevents Python-generated caches from being introduced outside the backend test directory already covered by a local ignore rule.

---

## 6. Stage 5 Documentation

### Added file

`docs/reports/KERNO_STAGE5_REPORT_FR.pdf`

### Validation

- Size: approximately 1.5 MB.
- Valid PDF document, version 1.4.
- Permissions normalized to `644`.
- Stable and descriptive repository filename.

### Decision

**Kept in the repository as the French Stage 5 closure report.**

The report was linked from:

- the root README documentation map;
- the root README project links section.

The same stable path can later be reused by the Demo Day landing page.

---

## 7. Root README Updates

The root README was updated to reflect the final portfolio state.

### Changes

- Replaced the Stage 4-only repository description with a Stage 5 closure description.
- Updated the portfolio stage to `Holberton Stage 5 project closure and final MVP`.
- Preserved Stage 4 sprint and delivery documents as historical records.
- Added the deployed application link.
- Added the Demo Day landing page link.
- Added the Stage 5 closure report link.
- Updated the project-origin section to distinguish the Stage 4 MVP implementation from Stage 5 closure work.

Historical Stage 4 references were retained where they describe actual Stage 4 work.

---

## 8. Security Documentation Links

### Finding

The root README and two technical documents referenced the missing path:

`docs/security/AUTH_SECURITY_NOTES.md`

The repository now uses language-specific files:

```text
docs/security/EN_AUTH_SECURITY_NOTES.md
docs/security/FR_AUTH_SECURITY_NOTES.md
```

A bilingual security documentation index also exists:

`docs/security/README.md`

### Decision

- The root README now links to the bilingual security index.
- English technical documents now link directly to `EN_AUTH_SECURITY_NOTES.md`.
- French and English security documents remain accessible from the index.

Updated files:

```text
README.md
docs/api/API_SUMMARY.md
docs/database/USER_ROLE_ENUM_ALIGNMENT.md
```

The bilingual security index was reviewed and retained without a committed content change.

---

## 9. Documentation Link Validation

A repository-wide relative-link validation was executed against:

- `README.md`;
- all Markdown files under `docs/`.

### Initial result

One broken local link was detected:

`./docs/security/AUTH_SECURITY_NOTES.md`

### Final result

`OK - Aucun lien local cassé détecté.`

---

## 10. File-Size Review

After removing the generated video and unused assets, no remaining tracked file was considered abnormally large for its purpose.

Reviewed and retained examples include:

- optimized product and interface images;
- Postman test evidence screenshots;
- the French cities dataset;
- the active KERNO logo;
- the Stage 5 PDF report.

---

## 11. Documentation and Deployment Alignment

The final documentation review identified and corrected several remaining
inconsistencies:

- `CONTRIBUTING.md` no longer presents the repository as being in the active
  Stage 4 stabilization phase;
- the root README repository tree now reflects the current root folders and
  deployment files;
- README environment variables now match the three `.env.example` files;
- the frontend environment variable is documented as optional;
- the deployment architecture now reflects the single application image that
  contains the compiled frontend and Express API;
- the historical Stage 4 deliverable document now keeps its original context
  while linking to the current public environments;
- Postman/Newman credentials now match the current demo seed;
- CI/CD documentation now matches the image name, runner type and deployment
  path used by the active workflow;
- a final public-wording pass normalized KERNO brand casing and corrected
  remaining spacing defects in contributor and README text;
- `.gitattributes` now classifies PDF deliverables as binary so Git diff
  validation does not parse internal PDF cross-reference data as text.

---

## 12. Backend Regressions Corrected During Final Audit

- Prevented client-controlled `isActive` on product creation; new products rely
  on the server and Prisma default.
- Replaced physical product deletion with soft deletion (`isActive: false`) and
  preserved a `404` response on repeated deactivation.
- Kept `updateProduct` support for `isActive` intentionally.
- No Prisma migration was required.
- Ran API regression with a stable Node process because nodemon watches the
  generated JSON test report and restarts on each rewrite.

---

## 13. Final Validation Status

Completed:

- [x] Generated demo video removed from Git.
- [x] Generated demo video output directory ignored.
- [x] Unused documentation logo removed.
- [x] Unused and incorrectly named dashboard asset removed.
- [x] Python cache ignore rules strengthened.
- [x] Stage 5 report added and linked.
- [x] README Stage 5 positioning updated.
- [x] Repository tree and environment documentation aligned.
- [x] Deployment and CI/CD documentation aligned.
- [x] Historical Stage 4 deployment wording contextualized.
- [x] Newman demo credentials aligned with the current seed.
- [x] Broken security documentation references corrected.
- [x] Relative documentation links validated.
- [x] Frontend lint passed.
- [x] Frontend production build passed with Vite 8.1.0 and 255 modules.
- [x] Backend syntax test passed.
- [x] API regression passed: 127 collected, 127 passed.
- [x] Playwright MVP regression passed: 6 of 6 tests.
- [x] Knip completed with no remaining issue.
- [x] `git diff --check` passed.

Pending before merge:

- [x] Review the complete final branch diff.
- [ ] Confirm the final Git status after commit.
- [ ] Complete the full-team review.
- [ ] Commit and push the `clean-repo` branch.
- [ ] Open the pull request and validate CI.
- [ ] Update the GitHub issue checklist.

---

## 14. Remaining Non-Blocking Limitations

- The Python API regression suite does not currently have a committed
  `requirements.txt`, `pyproject.toml` or `Pipfile`.
- PostgreSQL emitted a deprecation warning about calling `client.query()` while
  a query is already executing. This is non-blocking but should be reviewed
  before upgrading to `pg@9`.
- Historical Stage 4 files remain intentionally preserved when they document
  real project decisions or delivery evidence.

---

## 15. Conclusion

The audit reduces repository noise, removes unused tracked binaries, improves
documentation navigation and aligns the repository with the final Stage 5 state.

The changes remain controlled:

- no destructive Git history rewrite;
- no Prisma schema change;
- no unnecessary migration;
- only confirmed unused files were removed;
- backend behavior changes are limited to product activation safety and
  soft deletion;
- generated and historical files are retained only when their review value is
  documented.

The repository is technically validated. The remaining steps are the final diff
review, team confirmation, commit, push, pull request and CI validation.
