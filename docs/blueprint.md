# **App Name**: eCharge Kiosk

## Core Features:

- AI Plate Recognition: Automatic recognition of vehicle license plates using AI-powered cameras at the kiosk entrance, enabling vehicle identification and automatic charging slot assignment with zero manual input.
- Smart Slot Management: Real-time slot allocation system that assigns available chargers dynamically based on current usage, reservation status, and AI-predicted charging completion times. Supports a queue system when all slots are full.
- Vehicle-Specific Guidance: Generative AI recommends step-by-step charging instructions tailored to each vehicle's model, including charger type (AC/DC), port location, and operational instructions, displayed clearly and read aloud.
- Simplified UI: Touchscreen-first interface with full-screen display, large touch-friendly buttons, and a linear navigation flow. Designed to reduce cognitive load and eliminate multi-step menus.
- Automatic Payment: Processes payment automatically upon charging completion. Provides receipt via SMS or scannable QR code and displays real-time billing info (kWh used, duration, total cost).
- Local Business Display: Shows a curated list of nearby partner businesses (cafes, restaurants, shops) during charging wait time to encourage user engagement and local commerce.
- Wait Time Display: Queue and progress visualization that estimates remaining charging time for each occupied slot and displays real-time wait times for incoming vehicles. Includes alerts for “almost done” vehicles.

## Style Guidelines:

- Deep teal `#008080` — Represents eco-friendliness, trust, and technology.
- Very light gray-green `#F0F8F0` — Calming visual atmosphere that improves accessibility for all age groups.
- Muted olive green `#808000` — Highlights action elements like buttons and slot status while reinforcing an ecological theme.
- `PT Sans` (sans-serif) — Used for both body and heading text for its clean, modern, and highly legible appearance.
- Full-screen kiosk display with strict section-based UI panels. Each screen focuses on one clear action (e.g., confirm vehicle, begin charging, pay). No scrolls or pop-ups to avoid confusion.
- All interactive elements are large (minimum 48px), clearly separated, and color-coded by function. Icons paired with labels improve clarity for older users.
- Minimal, intuitive icons for navigation, charging state (⚡), payment (💳), vehicle entry (🚗), and receipt (🧾), sourced from Google Material or Lucide icons.
- Subtle progress animations (e.g., circular loader during charging), button press feedback, and screen fade transitions used to reassure user interaction without distraction.