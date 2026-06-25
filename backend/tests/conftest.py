"""
Pytest hooks for writing Kerno API test results to a separate JSON file.

Place this file as: backend/tests/conftest.py
The result file is written by default to:
backend/tests/results/kerno_api_test_results.json

Override with:
KERNO_PYTEST_RESULTS_FILE=/custom/path/results.json pytest ...
"""

from __future__ import annotations

import json
import os
import platform
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


_RESULTS: dict[str, Any] = {
    "startedAt": datetime.now(timezone.utc).isoformat(),
    "finishedAt": None,
    "durationSeconds": None,
    "environment": {
        "python": platform.python_version(),
        "platform": platform.platform(),
        "baseUrl": os.getenv("KERNO_API_BASE_URL", "http://localhost:5001"),
    },
    "summary": {
        "passed": 0,
        "failed": 0,
        "skipped": 0,
        "xfailed": 0,
        "xpassed": 0,
        "errors": 0,
        "total": 0,
    },
    "tests": [],
}
_START_TIME = time.time()


def pytest_runtest_logreport(report: Any) -> None:
    if report.when != "call":
        if report.when in ("setup", "teardown") and report.failed:
            _RESULTS["summary"]["errors"] += 1
            _RESULTS["summary"]["total"] += 1
            _RESULTS["tests"].append(
                {
                    "nodeid": report.nodeid,
                    "phase": report.when,
                    "outcome": "error",
                    "durationSeconds": round(report.duration, 4),
                    "message": str(report.longrepr),
                }
            )
        return

    outcome = report.outcome
    if hasattr(report, "wasxfail"):
        outcome = "xpassed" if report.passed else "xfailed"

    if outcome not in _RESULTS["summary"]:
        outcome = "errors"

    _RESULTS["summary"][outcome] += 1
    _RESULTS["summary"]["total"] += 1

    test_result: dict[str, Any] = {
        "nodeid": report.nodeid,
        "outcome": outcome,
        "durationSeconds": round(report.duration, 4),
    }

    if report.failed:
        test_result["message"] = str(report.longrepr)

    _RESULTS["tests"].append(test_result)


def pytest_sessionfinish(session: Any, exitstatus: int) -> None:
    _RESULTS["finishedAt"] = datetime.now(timezone.utc).isoformat()
    _RESULTS["durationSeconds"] = round(time.time() - _START_TIME, 4)
    _RESULTS["exitStatus"] = exitstatus

    result_path = Path(
        os.getenv(
            "KERNO_PYTEST_RESULTS_FILE",
            Path.cwd() / "tests" / "results" / "kerno_api_test_results.json",
        )
    )
    result_path.parent.mkdir(parents=True, exist_ok=True)
    result_path.write_text(json.dumps(_RESULTS, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nKerno API test results written to: {result_path}")
