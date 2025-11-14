# CTF-platform

A modern, open-source Capture The Flag (CTF) platform built for CyberVanguard - Cyber Club @AAU.

## Features

- 🎯 Modern landing page with event information
- ⏱️ Real-time countdown timer
- 📋 Comprehensive rules section
- 🎨 Beautiful, responsive UI with Tailwind CSS
- ⚡ Built with Next.js 14 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CTF-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
CTF-platform/
├── app/
│   ├── page.tsx          # Landing page
│   ├── login/
│   │   └── page.tsx      # Login/Register page (placeholder)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── CountdownTimer.tsx # Countdown timer component
└── ...
```

## Customization

### Event Date

The event date is currently set as a placeholder. To set a specific date:

1. Open `app/page.tsx`
2. Update the `eventDate` variable:
```typescript
const eventDate = '2025-11-22T00:00:00' // Your event date in ISO format
```

### Event Name

Update the event name in `app/page.tsx` and `app/layout.tsx` to match your event.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 18** - UI library

## Contributing

This is an open-source project. Contributions are welcome!

## License

[Add your license here]

---

Built with ❤️ by CyberVanguard - Cyber Club @AAU
