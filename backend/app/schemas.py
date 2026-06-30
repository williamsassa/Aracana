"""Pydantic models for the ARACANA AI API."""

from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


# ──────────────── Content models ────────────────
class Capability(BaseModel):
    title: str
    desc: str


class Spec(BaseModel):
    label: str
    value: str


class RewardComponent(BaseModel):
    signal: str
    weight: str
    desc: str


class ProductSummary(BaseModel):
    slug: str
    name: str
    full_name: str
    modality: str
    status: Literal["soon", "development"]
    background: bool
    tagline: str
    summary: str


class Product(ProductSummary):
    overview: List[str]
    capabilities: List[Capability]
    specs: List[Spec]
    reward_intro: str
    reward_components: List[RewardComponent]
    reward_example: str


class ResearchAxis(BaseModel):
    id: str
    index: str
    title: str
    abstract: str
    points: List[str]


class Solution(BaseModel):
    id: str
    title: str
    summary: str
    capabilities: List[str]
    status: Literal["available", "soon", "research"]


class OpenRole(BaseModel):
    title: str
    team: str
    location: str
    type: str


# ──────────────── Methodology models ────────────────
class MethodPillar(BaseModel):
    tag: str
    title: str
    body: str
    points: List[str]


class MethodLoopStep(BaseModel):
    n: str
    title: str
    body: str


class MethodologyContent(BaseModel):
    title: str
    subtitle: str
    lede: str
    pillars: List[MethodPillar]
    loop: List[MethodLoopStep]


# ──────────────── Inbound (POST) models ────────────────
class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    organization: Optional[str] = Field(default=None, max_length=160)
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=4000)


class JobApplication(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    role: str = Field(min_length=1, max_length=200)
    links: Optional[str] = Field(default=None, max_length=500)
    note: Optional[str] = Field(default=None, max_length=2000)


class EarlyAccessRequest(BaseModel):
    email: EmailStr
    product_slug: str
    organization: Optional[str] = Field(default=None, max_length=160)
    use_case: Optional[str] = Field(default=None, max_length=2000)


class Ack(BaseModel):
    ok: bool = True
    id: str
    received_at: datetime
    message: str
