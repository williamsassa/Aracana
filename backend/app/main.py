"""ARACANA AI — public API.

Serves the marketing/site content (research, solutions, products,
methodology, careers) and accepts inbound submissions (contact, applications,
early access). Single source of truth lives in app/data.py for V1.
"""

from __future__ import annotations

import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import __version__, data, store
from .schemas import (
    Ack,
    ContactMessage,
    EarlyAccessRequest,
    JobApplication,
    MethodologyContent,
    OpenRole,
    Product,
    ProductSummary,
    ResearchAxis,
    Solution,
)

app = FastAPI(
    title="ARACANA AI API",
    version=__version__,
    description="Sovereign frontier AI — public content & intake API.",
    contact={"name": "ARACANA AI", "email": "contact@aracana.ai"},
)

# CORS: allow the Next.js frontend (web/desktop/mobile shells) to call us.
# `next dev` actually serves on :3030 (see frontend/package.json), so that
# port must be allowed alongside :3000 for local development to work.
DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3030",
    "http://127.0.0.1:3030",
    "tauri://localhost",
    "capacitor://localhost",
    "https://aracana.ai",
]
EXTRA_ORIGINS = [
    o.strip() for o in os.getenv("CORS_EXTRA_ORIGINS", "").split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_ORIGINS + EXTRA_ORIGINS,
    allow_origin_regex=r"https://.*\.aracana\.ai",
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────── Meta ────────────────
@app.get("/", tags=["meta"])
def root():
    return {
        "name": "ARACANA AI API",
        "version": __version__,
        "tagline": "Building Sovereign Frontier AI in Europe",
        "docs": "/docs",
    }


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


# ──────────────── Research ────────────────
@app.get("/api/research", response_model=list[ResearchAxis], tags=["content"])
def list_research():
    return data.RESEARCH


# ──────────────── Solutions ────────────────
@app.get("/api/solutions", response_model=list[Solution], tags=["content"])
def list_solutions():
    return data.SOLUTIONS


# ──────────────── Products ────────────────
@app.get("/api/products", response_model=list[ProductSummary], tags=["content"])
def list_products(background: bool | None = None):
    items = data.PRODUCTS
    if background is not None:
        items = [p for p in items if p["background"] is background]
    return items


@app.get("/api/products/{slug}", response_model=Product, tags=["content"])
def get_product(slug: str):
    product = data.get_product(slug)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ──────────────── Methodology ────────────────
@app.get("/api/methodology", response_model=MethodologyContent, tags=["content"])
def get_methodology():
    return data.METHODOLOGY


# ──────────────── Careers ────────────────
@app.get("/api/careers/roles", response_model=list[OpenRole], tags=["careers"])
def list_roles():
    return data.ROLES


# ──────────────── Intake (POST) ────────────────
@app.post("/api/contact", response_model=Ack, tags=["intake"])
def submit_contact(msg: ContactMessage):
    rec = store.save("contact", msg.model_dump())
    return Ack(
        id=rec["id"],
        received_at=rec["received_at"],
        message="Thanks — we'll get back to you shortly.",
    )


@app.post("/api/careers/apply", response_model=Ack, tags=["careers"])
def submit_application(application: JobApplication):
    rec = store.save("application", application.model_dump())
    return Ack(
        id=rec["id"],
        received_at=rec["received_at"],
        message="Application received. Our team will be in touch.",
    )


@app.post("/api/early-access", response_model=Ack, tags=["intake"])
def request_early_access(req: EarlyAccessRequest):
    if data.get_product(req.product_slug) is None:
        raise HTTPException(status_code=404, detail="Unknown product")
    rec = store.save("early_access", req.model_dump())
    return Ack(
        id=rec["id"],
        received_at=rec["received_at"],
        message="Early-access request received for "
        f"{req.product_slug}. We'll reach out.",
    )
