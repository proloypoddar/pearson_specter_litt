# Pearson Specter Litt | Legal AI Workspace v4.0

### Developed by Polok Poddar (AI Engineer)

A production-grade legal AI workspace designed for high-stakes litigation, intelligent document analysis, and grounded legal draft generation.

This platform transforms messy, unstructured legal inputs into structured, verifiable, and citation-backed legal drafts using advanced OCR, Retrieval-Augmented Generation (RAG), and adaptive learning pipelines.

---

# 🚀 Live Demo

### [PSL.AI Live Deployment](https://pearson-specter-litt-puce.vercel.app/)

---

# ✨ Core Features

## 1. Intelligent Document Ingestion

### Advanced OCR Pipeline
- Handles:
  - Scanned PDFs
  - Low-resolution legal documents
  - Handwritten notes
  - Mixed-format evidence files

### OCR Engine
Powered by:
- `Tesseract.js`
- Automated fallback processing
- Multi-stage parsing pipeline

### LLM-Based Structuring
Uses `GPT-4o` to convert noisy OCR output into structured legal data:
- Case IDs
- Dates
- Parties
- Legal entities
- Filing references

### Handwriting & Signature Detection
Visual verification layer for:
- Handwritten annotations
- Signatures
- Marginal notes

---

# 🧠 Grounded Retrieval (RAG)

## Semantic Search Engine
Vector-based retrieval using:
- `text-embedding-3-small`

## Source-Grounded Drafting
Every generated draft includes:
- Context-aware citations
- Linked source chunks
- Verifiable evidence references

## Hallucination Reduction
Strict grounding prompts ensure generated responses remain tied only to uploaded legal materials.

---

# 🔁 Continuous Learning Loop

## Operator Feedback Adaptation
The system analyzes differences between:
- AI-generated drafts
- Human-corrected outputs

## Style Learning
Automatically learns and injects preferences such as:
- Formal legal salutations
- Preferred evidence formatting
- Draft structure conventions
- Bullet-style argument formatting

---

# 🖥️ Professional Engineering Dashboard

## Executive-Class UI
- Minimal monochrome design system
- Engineering-focused workspace aesthetics
- Premium motion interactions

## Real-Time Diagnostics
- Security protocol monitoring
- Processing logs
- OCR status tracking
- AI generation telemetry

## Intelligence Chat Interface
Conversational access to:
- Uploaded legal repositories
- Draft history
- Retrieval context
- Evidence references

---

# 🏗️ Technical Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| AI Models | GPT-4o |
| Embeddings | text-embedding-3-small |
| OCR | Tesseract.js |
| PDF Parsing | PDF-Parse |
| Database | Local JSON Vector Store |
| Animation | Framer Motion |

---

# 📂 Architecture Overview

```text
Document Upload
       ↓
OCR + Parsing Pipeline
       ↓
LLM Cleaning & Structuring
       ↓
Embedding Generation
       ↓
Vector Retrieval (RAG)
       ↓
Grounded Legal Draft Generation
       ↓
Citation Verification
       ↓
Operator Feedback Loop
