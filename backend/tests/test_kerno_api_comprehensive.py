"""
Comprehensive pytest API tests for the Kerno MVP backend.

These tests target the running Express API from Python. They are closer to
end-to-end/API tests than pure unit tests because the Kerno backend is written
in JavaScript/Express and uses PostgreSQL through Prisma.

Default base URL: http://localhost:5001
Override with: KERNO_API_BASE_URL=http://localhost:5001 pytest ...
"""

from __future__ import annotations

import os
import time
import unicodedata
import uuid
from typing import Any

import pytest
import requests


BASE_URL = os.getenv("KERNO_API_BASE_URL", "http://localhost:5001").rstrip("/")
TIMEOUT = float(os.getenv("KERNO_API_TIMEOUT", "6"))
RUN_ID = f"pytest-{int(time.time())}-{uuid.uuid4().hex[:8]}"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def url(path: str) -> str:
    if not path.startswith("/"):
        path = f"/{path}"
    return f"{BASE_URL}{path}"


def api_request(
    method: str,
    path: str,
    *,
    token: str | None = None,
    json: dict[str, Any] | list[Any] | None = None,
    raw_data: str | bytes | None = None,
    headers: dict[str, str] | None = None,
) -> requests.Response:
    request_headers = headers.copy() if headers else {}
    if token is not None:
        request_headers["Authorization"] = f"Bearer {token}"

    if raw_data is not None:
        return requests.request(
            method,
            url(path),
            data=raw_data,
            headers=request_headers,
            timeout=TIMEOUT,
        )

    return requests.request(
        method,
        url(path),
        json=json,
        headers=request_headers,
        timeout=TIMEOUT,
    )


def payload(response: requests.Response) -> dict[str, Any]:
    try:
        body = response.json()
    except ValueError as exc:
        pytest.fail(
            f"Response is not valid JSON. Status={response.status_code}, body={response.text[:500]!r}"
        )
        raise exc

    assert isinstance(body, dict), f"Expected JSON object, got: {type(body)}"
    return body


def assert_success(response: requests.Response, expected_status: int) -> dict[str, Any]:
    assert response.status_code == expected_status, response.text
    body = payload(response)
    assert body.get("success") is True, body
    return body


def assert_error(
    response: requests.Response,
    expected_status: int | tuple[int, ...],
    expected_message_part: str | None = None,
) -> dict[str, Any]:
    if isinstance(expected_status, int):
        expected_status = (expected_status,)
    assert response.status_code in expected_status, response.text
    body = payload(response)
    assert body.get("success") is False, body
    assert isinstance(body.get("message"), str), body
    if expected_message_part:
        assert expected_message_part.lower() in body["message"].lower(), body
    return body


def unique_email(label: str) -> str:
    return f"{label}.{RUN_ID}@example.test".lower()


def alphabetical_key(value: str) -> str:
    return "".join(
        char
        for char in unicodedata.normalize("NFKD", value.casefold())
        if not unicodedata.combining(char)
    )


def register_user(role: str, label: str, password: str = "Password123!") -> dict[str, Any]:
    response = api_request(
        "POST",
        "/api/auth/register",
        json={
            "email": unique_email(label),
            "password": password,
            "role": role,
            "firstName": label.capitalize(),
            "lastName": "Tester",
        },
    )
    body = assert_success(response, 201)
    assert "token" in body
    assert "user" in body
    assert body["user"]["email"] == unique_email(label)
    assert body["user"]["role"] == role.upper()
    assert "password" not in body["user"]
    assert "passwordHash" not in body["user"]
    return body


def login_user(label: str, password: str = "Password123!") -> dict[str, Any]:
    response = api_request(
        "POST",
        "/api/auth/login",
        json={"email": unique_email(label), "password": password},
    )
    return assert_success(response, 200)


# ---------------------------------------------------------------------------
# Session data setup
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def seeded() -> dict[str, Any]:
    """Create a complete reusable Supplier -> Product -> Store -> Request flow."""
    data: dict[str, Any] = {}

    supplier_auth = register_user("SUPPLIER", "main_supplier")
    store_auth = register_user("STORE", "main_store")
    other_supplier_auth = register_user("SUPPLIER", "other_supplier")
    other_store_auth = register_user("STORE", "other_store")
    no_profile_supplier_auth = register_user("SUPPLIER", "supplier_without_profile")
    no_profile_store_auth = register_user("STORE", "store_without_profile")

    data["supplier_token"] = supplier_auth["token"]
    data["store_token"] = store_auth["token"]
    data["other_supplier_token"] = other_supplier_auth["token"]
    data["other_store_token"] = other_store_auth["token"]
    data["no_profile_supplier_token"] = no_profile_supplier_auth["token"]
    data["no_profile_store_token"] = no_profile_store_auth["token"]

    supplier_profile = assert_success(
        api_request(
            "POST",
            "/api/suppliers/profile",
            token=data["supplier_token"],
            json={
                "companyName": f"Kerno Supplier {RUN_ID}",
                "description": "Local food supplier for automated tests",
                "location": "Rennes",
                "businessType": "Food supplier",
                "contactEmail": unique_email("supplier_contact"),
                "phone": "+33123456789",
                "website": "https://supplier.example.test",
            },
        ),
        201,
    )["supplier"]
    data["supplier"] = supplier_profile

    other_supplier_profile = assert_success(
        api_request(
            "POST",
            "/api/suppliers/profile",
            token=data["other_supplier_token"],
            json={"companyName": f"Other Supplier {RUN_ID}"},
        ),
        201,
    )["supplier"]
    data["other_supplier"] = other_supplier_profile

    store_profile = assert_success(
        api_request(
            "POST",
            "/api/stores/profile",
            token=data["store_token"],
            json={
                "storeName": f"Kerno Store {RUN_ID}",
                "brandName": "Kerno Test Store",
                "location": "Nantes",
                "storeType": "Grocery",
                "sourcingNeeds": "Fresh products",
                "contactEmail": unique_email("store_contact"),
                "phone": "+33987654321",
            },
        ),
        201,
    )["store"]
    data["store"] = store_profile

    other_store_profile = assert_success(
        api_request(
            "POST",
            "/api/stores/profile",
            token=data["other_store_token"],
            json={"storeName": f"Other Store {RUN_ID}"},
        ),
        201,
    )["store"]
    data["other_store"] = other_store_profile

    category = assert_success(
        api_request(
            "POST",
            "/api/categories",
            token=data["supplier_token"],
            json={
                "name": f"Category {RUN_ID}",
                "description": "Automated test category",
            },
        ),
        201,
    )["category"]
    data["category"] = category

    product = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=data["supplier_token"],
            json={
                "categoryId": category["id"],
                "name": f"Test Product {RUN_ID}",
                "description": "Automated test product",
                "priceCents": 1000,
                "priceUnit": "UNIT",
                "minimumOrderQuantity": 5,
                "minimumOrderUnit": "COLIS",
                "origin": "France",
                "imageUrl": "https://example.test/product.png",
            },
        ),
        201,
    )["product"]
    data["product"] = product

    request = assert_success(
        api_request(
            "POST",
            "/api/requests",
            token=data["store_token"],
            json={
                "supplierId": supplier_profile["id"],
                "productId": product["id"],
                "subject": f"Quote request {RUN_ID}",
                "message": "Can you send me your B2B pricing?",
                "requestedQuantity": "20 units",
            },
        ),
        201,
    )["request"]
    data["request"] = request

    return data


@pytest.fixture(scope="session", autouse=True)
def backend_must_be_running() -> None:
    try:
        response = api_request("GET", "/api/health")
    except requests.RequestException as exc:
        pytest.fail(
            f"Kerno API is not reachable at {BASE_URL}. Start the backend first. Error: {exc}"
        )
    assert response.status_code == 200, response.text


# ---------------------------------------------------------------------------
# Health, documentation endpoints, and generic errors
# ---------------------------------------------------------------------------


def test_health_endpoint_returns_success() -> None:
    body = assert_success(api_request("GET", "/api/health"), 200)
    assert body["message"] == "KERNO API is running"


def test_openapi_json_endpoint_returns_an_openapi_document() -> None:
    response = api_request("GET", "/api/openapi.json")
    assert response.status_code == 200
    body = payload(response)
    assert body.get("openapi") == "3.0.0"
    assert body.get("info", {}).get("title") == "Kerno API"


def test_swagger_docs_endpoint_is_available() -> None:
    response = api_request("GET", "/api/docs")
    assert response.status_code in (200, 301, 302)


def test_unknown_route_returns_404_json() -> None:
    assert_error(api_request("GET", f"/api/unknown-route-{RUN_ID}"), 404, "Route not found")


def test_method_not_allowed_or_not_found_returns_error_json() -> None:
    # Express has no PUT /api/health route, so the global notFound middleware should answer.
    assert_error(api_request("PUT", "/api/health", json={}), 404)


# ---------------------------------------------------------------------------
# Auth - success cases
# ---------------------------------------------------------------------------


def test_register_supplier_success() -> None:
    body = register_user("SUPPLIER", "register_supplier_success")
    assert body["user"]["role"] == "SUPPLIER"
    assert isinstance(body["token"], str)
    assert len(body["token"].split(".")) == 3


def test_register_store_success() -> None:
    body = register_user("STORE", "register_store_success")
    assert body["user"]["role"] == "STORE"


def test_register_normalizes_email_and_role() -> None:
    email = f"  MixedCase.{RUN_ID}@Example.TEST  "
    response = api_request(
        "POST",
        "/api/auth/register",
        json={
            "email": email,
            "password": "Password123!",
            "role": " supplier ",
            "firstName": " Trim ",
            "lastName": " User ",
        },
    )
    body = assert_success(response, 201)
    assert body["user"]["email"] == email.strip().lower()
    assert body["user"]["role"] == "SUPPLIER"
    assert body["user"]["firstName"] == "Trim"
    assert body["user"]["lastName"] == "User"


def test_login_success_after_register() -> None:
    register_user("STORE", "login_success")
    body = login_user("login_success")
    assert body["user"]["email"] == unique_email("login_success")
    assert isinstance(body["token"], str)


def test_login_accepts_email_with_uppercase_and_spaces() -> None:
    register_user("SUPPLIER", "login_normalized")
    response = api_request(
        "POST",
        "/api/auth/login",
        json={
            "email": f"  {unique_email('login_normalized').upper()}  ",
            "password": "Password123!",
        },
    )
    body = assert_success(response, 200)
    assert body["user"]["email"] == unique_email("login_normalized")


# ---------------------------------------------------------------------------
# Auth - validation and edge cases
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "field,payload,expected_message",
    [
        ("email", {"password": "Password123!", "role": "SUPPLIER"}, "Email is required"),
        ("password", {"email": "missing-password@example.test", "role": "SUPPLIER"}, "Password is required"),
        ("role", {"email": "missing-role@example.test", "password": "Password123!"}, "Role is required"),
        ("blank_email", {"email": "   ", "password": "Password123!", "role": "SUPPLIER"}, "Email is required"),
        ("blank_role", {"email": "blank-role@example.test", "password": "Password123!", "role": "   "}, "Role is required"),
    ],
)
def test_register_missing_or_blank_required_fields(field: str, payload: dict[str, Any], expected_message: str) -> None:
    # Make emails unique when the payload contains a non-empty hardcoded address.
    if payload.get("email") and str(payload["email"]).strip():
        payload = {**payload, "email": f"{field}.{RUN_ID}@example.test"}
    assert_error(api_request("POST", "/api/auth/register", json=payload), 400, expected_message)


@pytest.mark.parametrize("password", ["", " ", "short", "1234567"])
def test_register_rejects_empty_or_short_password(password: str) -> None:
    response = api_request(
        "POST",
        "/api/auth/register",
        json={
            "email": f"short-password-{uuid.uuid4().hex[:8]}@example.test",
            "password": password,
            "role": "STORE",
        },
    )
    assert_error(response, 400)


@pytest.mark.parametrize("role", ["ADMIN", "CUSTOMER", "", "supplier-store", 123, None])
def test_register_rejects_invalid_roles(role: Any) -> None:
    response = api_request(
        "POST",
        "/api/auth/register",
        json={
            "email": f"invalid-role-{uuid.uuid4().hex[:8]}@example.test",
            "password": "Password123!",
            "role": role,
        },
    )
    assert_error(response, 400)


def test_register_duplicate_email_returns_409() -> None:
    label = "duplicate_email"
    register_user("STORE", label)
    response = api_request(
        "POST",
        "/api/auth/register",
        json={"email": unique_email(label), "password": "Password123!", "role": "STORE"},
    )
    assert_error(response, 409, "already registered")


def test_register_duplicate_email_is_case_insensitive() -> None:
    label = "duplicate_case_insensitive"
    register_user("SUPPLIER", label)
    response = api_request(
        "POST",
        "/api/auth/register",
        json={"email": unique_email(label).upper(), "password": "Password123!", "role": "SUPPLIER"},
    )
    assert_error(response, 409, "already registered")


@pytest.mark.parametrize(
    "payload",
    [
        {"email": "unknown@example.test", "password": "Password123!"},
        {"email": "", "password": "Password123!"},
        {"email": "unknown@example.test", "password": ""},
        {"email": "unknown@example.test"},
        {"password": "Password123!"},
    ],
)
def test_login_rejects_invalid_or_missing_credentials(payload: dict[str, Any]) -> None:
    if payload.get("email") == "unknown@example.test":
        payload = {**payload, "email": f"unknown-{uuid.uuid4().hex[:8]}@example.test"}
    response = api_request("POST", "/api/auth/login", json=payload)
    assert_error(response, (400, 401))


def test_login_rejects_wrong_password() -> None:
    register_user("STORE", "wrong_password")
    response = api_request(
        "POST",
        "/api/auth/login",
        json={"email": unique_email("wrong_password"), "password": "WrongPassword123!"},
    )
    assert_error(response, 401, "Invalid email or password")


def test_register_with_non_json_body_returns_error() -> None:
    response = api_request(
        "POST",
        "/api/auth/register",
        raw_data="this is not json",
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code in (400, 500)
    body = payload(response)
    assert body.get("success") is False


# ---------------------------------------------------------------------------
# Authentication middleware and /users
# ---------------------------------------------------------------------------


def test_auth_module_status() -> None:
    body = assert_success(api_request("GET", "/api/auth"), 200)
    assert body["module"] == "auth"


def test_users_module_status() -> None:
    body = assert_success(api_request("GET", "/api/users"), 200)
    assert body["module"] == "users"


def test_users_me_requires_authentication() -> None:
    assert_error(api_request("GET", "/api/users/me"), 401, "Authentication required")


def test_users_me_rejects_invalid_bearer_token() -> None:
    assert_error(api_request("GET", "/api/users/me", token="not-a-valid-jwt"), 401)


def test_users_me_rejects_malformed_authorization_header() -> None:
    response = api_request("GET", "/api/users/me", headers={"Authorization": "Token abc"})
    assert_error(response, 401)


def test_users_me_accepts_supplier_token(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/users/me", token=seeded["supplier_token"]), 200)
    assert body["user"]["role"] == "SUPPLIER"
    assert "passwordHash" not in body["user"]


def test_users_me_accepts_store_token(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/users/me", token=seeded["store_token"]), 200)
    assert body["user"]["role"] == "STORE"


# ---------------------------------------------------------------------------
# Supplier profile routes
# ---------------------------------------------------------------------------


def test_get_all_suppliers_is_public(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/suppliers"), 200)
    assert isinstance(body["suppliers"], list)
    assert any(item["id"] == seeded["supplier"]["id"] for item in body["suppliers"])


def test_get_supplier_by_id_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", f"/api/suppliers/{seeded['supplier']['id']}"), 200)
    assert body["supplier"]["companyName"] == seeded["supplier"]["companyName"]


def test_get_supplier_by_unknown_uuid_returns_404() -> None:
    assert_error(api_request("GET", f"/api/suppliers/{uuid.uuid4()}"), 404, "not found")


def test_supplier_profile_me_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", "/api/suppliers/profile/me", token=seeded["store_token"]), 403)


def test_supplier_profile_me_requires_authentication() -> None:
    assert_error(api_request("GET", "/api/suppliers/profile/me"), 401)


def test_create_supplier_profile_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/suppliers/profile",
            token=seeded["store_token"],
            json={"companyName": "Forbidden supplier"},
        ),
        403,
    )


def test_create_supplier_profile_requires_company_name(seeded: dict[str, Any]) -> None:
    temp = register_user("SUPPLIER", "supplier_missing_company")
    assert_error(
        api_request("POST", "/api/suppliers/profile", token=temp["token"], json={}),
        400,
        "Company name is required",
    )


def test_create_supplier_profile_rejects_duplicate_profile(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/suppliers/profile",
            token=seeded["supplier_token"],
            json={"companyName": "Duplicate profile"},
        ),
        409,
        "already exists",
    )


def test_update_supplier_profile_success_and_trims_values(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "PUT",
            "/api/suppliers/profile/me",
            token=seeded["supplier_token"],
            json={"companyName": "  Updated Supplier Name  ", "description": "   "},
        ),
        200,
    )
    assert body["supplier"]["companyName"] == "Updated Supplier Name"
    assert body["supplier"]["description"] is None


def test_update_supplier_profile_rejects_blank_company_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PUT",
            "/api/suppliers/profile/me",
            token=seeded["supplier_token"],
            json={"companyName": "   "},
        ),
        400,
        "Company name is required",
    )


def test_get_supplier_profile_me_without_existing_profile_returns_404(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("GET", "/api/suppliers/profile/me", token=seeded["no_profile_supplier_token"]),
        404,
        "not found",
    )


# ---------------------------------------------------------------------------
# Store profile routes
# ---------------------------------------------------------------------------


def test_stores_module_status_is_public() -> None:
    body = assert_success(api_request("GET", "/api/stores"), 200)
    assert body["module"] == "stores"


def test_store_profile_me_requires_store_role(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", "/api/stores/profile/me", token=seeded["supplier_token"]), 403)


def test_store_profile_me_requires_authentication() -> None:
    assert_error(api_request("GET", "/api/stores/profile/me"), 401)


def test_create_store_profile_requires_store_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/stores/profile",
            token=seeded["supplier_token"],
            json={"storeName": "Forbidden store"},
        ),
        403,
    )


def test_create_store_profile_requires_store_name() -> None:
    temp = register_user("STORE", "store_missing_name")
    assert_error(
        api_request("POST", "/api/stores/profile", token=temp["token"], json={}),
        400,
        "Store name is required",
    )


def test_create_store_profile_rejects_duplicate_profile(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/stores/profile",
            token=seeded["store_token"],
            json={"storeName": "Duplicate store"},
        ),
        409,
        "already exists",
    )


def test_get_store_profile_me_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/stores/profile/me", token=seeded["store_token"]), 200)
    assert body["store"]["id"] == seeded["store"]["id"]


def test_update_store_profile_success_and_nulls_empty_optional_fields(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "PUT",
            "/api/stores/profile/me",
            token=seeded["store_token"],
            json={"storeName": "  Updated Store Name  ", "brandName": "   "},
        ),
        200,
    )
    assert body["store"]["storeName"] == "Updated Store Name"
    assert body["store"]["brandName"] is None


def test_update_store_profile_rejects_blank_store_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PUT",
            "/api/stores/profile/me",
            token=seeded["store_token"],
            json={"storeName": "   "},
        ),
        400,
        "Store name is required",
    )


def test_get_store_profile_me_without_existing_profile_returns_404(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("GET", "/api/stores/profile/me", token=seeded["no_profile_store_token"]),
        404,
        "not found",
    )


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------


def test_get_categories_is_public(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/categories"), 200)
    assert isinstance(body["categories"], list)
    assert any(item["id"] == seeded["category"]["id"] for item in body["categories"])


def test_create_category_requires_authentication() -> None:
    assert_error(api_request("POST", "/api/categories", json={"name": "No auth"}), 401)


def test_create_category_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("POST", "/api/categories", token=seeded["store_token"], json={"name": "Forbidden"}),
        403,
    )


def test_create_category_requires_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("POST", "/api/categories", token=seeded["supplier_token"], json={}),
        400,
        "Category name is required",
    )


def test_create_category_rejects_blank_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("POST", "/api/categories", token=seeded["supplier_token"], json={"name": "   "}),
        400,
        "Category name is required",
    )


def test_create_category_rejects_duplicate_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/categories",
            token=seeded["supplier_token"],
            json={"name": seeded["category"]["name"]},
        ),
        409,
        "already exists",
    )


def test_categories_are_returned_sorted_by_name(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/categories"), 200)
    names = [item["name"] for item in body["categories"]]
    assert names == sorted(names, key=alphabetical_key)


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------


def test_get_products_is_public_and_returns_only_active_products(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/products"), 200)
    assert isinstance(body["products"], list)
    assert all(product["isActive"] is True for product in body["products"])
    assert any(product["id"] == seeded["product"]["id"] for product in body["products"])


def test_get_product_by_id_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", f"/api/products/{seeded['product']['id']}"), 200)
    product = body["product"]
    assert product["id"] == seeded["product"]["id"]
    assert product["supplier"]["id"] == seeded["supplier"]["id"]
    assert product["category"]["id"] == seeded["category"]["id"]


def test_get_unknown_product_returns_404() -> None:
    assert_error(api_request("GET", f"/api/products/{uuid.uuid4()}"), 404, "not found")


def test_create_product_requires_authentication() -> None:
    assert_error(api_request("POST", "/api/products", json={"name": "No auth"}), 401)


def test_create_product_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("POST", "/api/products", token=seeded["store_token"], json={"name": "Forbidden"}),
        403,
    )


def test_create_product_requires_supplier_profile(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/products",
            token=seeded["no_profile_supplier_token"],
            json={"name": "No profile product"},
        ),
        404,
        "Supplier profile is required",
    )


def test_create_product_requires_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("POST", "/api/products", token=seeded["supplier_token"], json={}),
        400,
        "Product name is required",
    )


def test_create_product_rejects_blank_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("POST", "/api/products", token=seeded["supplier_token"], json={"name": "   "}),
        400,
        "Product name is required",
    )


def test_create_product_rejects_unknown_category(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={"name": "Unknown category product", "categoryId": str(uuid.uuid4())},
        ),
        404,
        "Category not found",
    )


def test_create_product_accepts_optional_fields_as_empty_strings(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={
                "name": f"Optional Empty Fields {RUN_ID}",
                "description": "   ",
                "priceCents": "",
                "priceUnit": "",
                "minimumOrderQuantity": "",
                "minimumOrderUnit": "",
                "origin": "   ",
                "imageUrl": "   ",
            },
        ),
        201,
    )
    product = body["product"]
    assert product["description"] is None
    assert product["priceCents"] is None
    assert product["priceUnit"] is None
    assert product["minimumOrderQuantity"] is None
    assert product["minimumOrderUnit"] is None
    assert product["origin"] is None
    assert product["imageUrl"] is None


def test_update_product_success(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "PUT",
            f"/api/products/{seeded['product']['id']}",
            token=seeded["supplier_token"],
            json={"name": "  Updated Product Name  ", "categoryId": ""},
        ),
        200,
    )
    assert body["product"]["name"] == "Updated Product Name"
    assert body["product"]["categoryId"] is None
    assert body["product"]["category"] is None


def test_update_product_rejects_blank_name(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PUT",
            f"/api/products/{seeded['product']['id']}",
            token=seeded["supplier_token"],
            json={"name": "   "},
        ),
        400,
        "Product name is required",
    )


def test_update_product_rejects_unknown_category(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PUT",
            f"/api/products/{seeded['product']['id']}",
            token=seeded["supplier_token"],
            json={"categoryId": str(uuid.uuid4())},
        ),
        404,
        "Category not found",
    )


def test_update_product_rejects_not_owner_supplier(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PUT",
            f"/api/products/{seeded['product']['id']}",
            token=seeded["other_supplier_token"],
            json={"name": "Hijack attempt"},
        ),
        404,
    )


def test_delete_product_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request("DELETE", f"/api/products/{seeded['product']['id']}", token=seeded["store_token"]),
        403,
    )


def test_deactivate_product_hides_it_from_public_list(seeded: dict[str, Any]) -> None:
    created = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={"name": f"Temporary Product To Delete {RUN_ID}"},
        ),
        201,
    )["product"]

    body = assert_success(
        api_request("DELETE", f"/api/products/{created['id']}", token=seeded["supplier_token"]),
        200,
    )
    assert body["product"]["isActive"] is False

    assert_error(api_request("GET", f"/api/products/{created['id']}"), 404)

    products = assert_success(api_request("GET", "/api/products"), 200)["products"]
    assert all(product["id"] != created["id"] for product in products)


def test_deactivate_product_twice_returns_404(seeded: dict[str, Any]) -> None:
    created = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={"name": f"Temporary Double Delete {RUN_ID}"},
        ),
        201,
    )["product"]

    assert_success(api_request("DELETE", f"/api/products/{created['id']}", token=seeded["supplier_token"]), 200)
    assert_error(api_request("DELETE", f"/api/products/{created['id']}", token=seeded["supplier_token"]), 404)


# ---------------------------------------------------------------------------
# Contact requests
# ---------------------------------------------------------------------------


def test_create_contact_request_requires_store_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/requests",
            token=seeded["supplier_token"],
            json={"supplierId": seeded["supplier"]["id"], "subject": "x", "message": "y"},
        ),
        403,
    )


def test_create_contact_request_requires_store_profile(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/requests",
            token=seeded["no_profile_store_token"],
            json={"supplierId": seeded["supplier"]["id"], "subject": "x", "message": "y"},
        ),
        404,
        "Store profile is required",
    )


@pytest.mark.parametrize(
    "body,expected_message",
    [
        ({"subject": "x", "message": "y"}, "Supplier id is required"),
        ({"supplierId": "x", "message": "y"}, "Subject is required"),
        ({"supplierId": "x", "subject": "x"}, "Message is required"),
        ({"supplierId": "   ", "subject": "x", "message": "y"}, "Supplier id is required"),
        ({"supplierId": "x", "subject": "   ", "message": "y"}, "Subject is required"),
        ({"supplierId": "x", "subject": "x", "message": "   "}, "Message is required"),
    ],
)
def test_create_contact_request_validates_required_fields(
    seeded: dict[str, Any], body: dict[str, Any], expected_message: str
) -> None:
    if body.get("supplierId") == "x":
        body = {**body, "supplierId": seeded["supplier"]["id"]}
    assert_error(
        api_request("POST", "/api/requests", token=seeded["store_token"], json=body),
        400,
        expected_message,
    )


def test_create_contact_request_rejects_unknown_supplier(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "POST",
            "/api/requests",
            token=seeded["store_token"],
            json={"supplierId": str(uuid.uuid4()), "subject": "x", "message": "y"},
        ),
        404,
        "Supplier profile not found",
    )


def test_create_contact_request_rejects_product_from_another_supplier(seeded: dict[str, Any]) -> None:
    other_product = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["other_supplier_token"],
            json={"name": f"Other Supplier Product {RUN_ID}"},
        ),
        201,
    )["product"]

    assert_error(
        api_request(
            "POST",
            "/api/requests",
            token=seeded["store_token"],
            json={
                "supplierId": seeded["supplier"]["id"],
                "productId": other_product["id"],
                "subject": "Wrong product",
                "message": "This product is from another supplier",
            },
        ),
        404,
        "Product not found for this supplier",
    )


def test_create_contact_request_without_product_success(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "POST",
            "/api/requests",
            token=seeded["store_token"],
            json={
                "supplierId": seeded["supplier"]["id"],
                "subject": " General question ",
                "message": " Hello supplier ",
                "requestedQuantity": "   ",
            },
        ),
        201,
    )
    request = body["request"]
    assert request["subject"] == "General question"
    assert request["message"] == "Hello supplier"
    assert request["productId"] is None
    assert request["requestedQuantity"] is None
    assert request["status"] == "PENDING"


def test_get_sent_requests_requires_store_role(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", "/api/requests/sent", token=seeded["supplier_token"]), 403)


def test_get_sent_requests_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/requests/sent", token=seeded["store_token"]), 200)
    assert isinstance(body["requests"], list)
    assert any(request["id"] == seeded["request"]["id"] for request in body["requests"])


def test_get_received_requests_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", "/api/requests/received", token=seeded["store_token"]), 403)


def test_get_received_requests_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", "/api/requests/received", token=seeded["supplier_token"]), 200)
    assert isinstance(body["requests"], list)
    assert any(request["id"] == seeded["request"]["id"] for request in body["requests"])


def test_get_request_by_id_as_store_owner_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", f"/api/requests/{seeded['request']['id']}", token=seeded["store_token"]), 200)
    assert body["request"]["id"] == seeded["request"]["id"]


def test_get_request_by_id_as_supplier_recipient_success(seeded: dict[str, Any]) -> None:
    body = assert_success(api_request("GET", f"/api/requests/{seeded['request']['id']}", token=seeded["supplier_token"]), 200)
    assert body["request"]["id"] == seeded["request"]["id"]


def test_get_request_by_id_rejects_other_store(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", f"/api/requests/{seeded['request']['id']}", token=seeded["other_store_token"]), 403)


def test_get_request_by_id_rejects_other_supplier(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", f"/api/requests/{seeded['request']['id']}", token=seeded["other_supplier_token"]), 403)


def test_get_unknown_request_returns_404(seeded: dict[str, Any]) -> None:
    assert_error(api_request("GET", f"/api/requests/{uuid.uuid4()}", token=seeded["store_token"]), 404)


@pytest.mark.parametrize("status", ["PENDING", "READ", "ANSWERED", "CLOSED", " read ", "answered"])
def test_update_request_status_accepts_valid_statuses(seeded: dict[str, Any], status: str) -> None:
    body = assert_success(
        api_request(
            "PATCH",
            f"/api/requests/{seeded['request']['id']}/status",
            token=seeded["supplier_token"],
            json={"status": status},
        ),
        200,
    )
    assert body["request"]["status"] == status.strip().upper()


@pytest.mark.parametrize("status", ["", " ", "NEW", "INVALID", "DONE", 123, None])
def test_update_request_status_rejects_invalid_statuses(seeded: dict[str, Any], status: Any) -> None:
    response = api_request(
        "PATCH",
        f"/api/requests/{seeded['request']['id']}/status",
        token=seeded["supplier_token"],
        json={"status": status},
    )
    assert_error(response, 400)


def test_update_request_status_requires_supplier_role(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PATCH",
            f"/api/requests/{seeded['request']['id']}/status",
            token=seeded["store_token"],
            json={"status": "READ"},
        ),
        403,
    )


def test_update_request_status_rejects_other_supplier(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PATCH",
            f"/api/requests/{seeded['request']['id']}/status",
            token=seeded["other_supplier_token"],
            json={"status": "READ"},
        ),
        404,
    )


def test_update_unknown_request_status_returns_404(seeded: dict[str, Any]) -> None:
    assert_error(
        api_request(
            "PATCH",
            f"/api/requests/{uuid.uuid4()}/status",
            token=seeded["supplier_token"],
            json={"status": "READ"},
        ),
        404,
    )


# ---------------------------------------------------------------------------
# Generic robustness / unlikely input cases
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "method,path",
    [
        ("GET", "/api/products/not-a-uuid"),
        ("GET", "/api/suppliers/not-a-uuid"),
    ],
)
def test_invalid_uuid_path_parameters_return_json_error(method: str, path: str) -> None:
    response = api_request(method, path)
    # Current Prisma validation errors may surface as 500 until explicit UUID validation is added.
    assert response.status_code in (400, 404, 500)
    body = payload(response)
    assert body.get("success") is False
    assert isinstance(body.get("message"), str)


def test_request_body_can_contain_extra_fields_without_leaking_them(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={
                "name": f"Extra Fields Product {RUN_ID}",
                "admin": True,
                "role": "ADMIN",
                "isActive": False,
                "supplierId": str(uuid.uuid4()),
            },
        ),
        201,
    )
    product = body["product"]
    assert product["isActive"] is True
    assert product["supplierId"] == seeded["supplier"]["id"]
    assert "admin" not in product
    assert "role" not in product


def test_large_but_valid_text_fields_are_accepted(seeded: dict[str, Any]) -> None:
    large_description = "A" * 2000
    body = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={"name": f"Large Text Product {RUN_ID}", "description": large_description},
        ),
        201,
    )
    assert body["product"]["description"] == large_description


def test_unicode_text_fields_are_accepted(seeded: dict[str, Any]) -> None:
    body = assert_success(
        api_request(
            "POST",
            "/api/products",
            token=seeded["supplier_token"],
            json={
                "name": f"Produit spécial éèçà 🧪 {RUN_ID}",
                "description": "测试 العربية emoji ✅",
            },
        ),
        201,
    )
    assert "é" in body["product"]["name"]
    assert "✅" in body["product"]["description"]
