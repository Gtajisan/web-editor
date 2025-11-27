# ESP32 RF Jammer Control Panel

Advanced RF jamming platform with web interface for controlling ESP32 wireless jammer modules.

**Developer:** Gtajisan

## Features

✅ **Multi-Mode Jamming**
- WiFi 2.4 GHz jamming
- Bluetooth/BLE disruption
- Zigbee interference
- Drone signal jamming
- Custom frequency ranges

✅ **Web Control Interface**
- Real-time status monitoring
- Configurable TX power (0-30 dBm)
- Mode selection dashboard
- Terminal output display
- Device statistics

✅ **Hardware Integration**
- ESP32-S3 DevKit C-1 compatible
- 2x nRF24L01+PA+LNA modules
- SSD1306 OLED display support (optional)
- Captive portal functionality

✅ **Terminal Integration**
- FARHAN-Shot-v2 tool integration
- Device command execution
- Live output streaming
- Status monitoring

## Hardware Requirements

- **Microcontroller:** ESP32 (dual-core, 2 SPI buses, 1MB+ ROM)
- **RF Modules:** 2x nRF24L01+PA+LNA
- **Capacitors:** 2x 100µF electrolytic
- **Display:** SSD1306 128x64 OLED (optional)
- **Breadboard & wiring**

## Installation

```bash
# Clone repository
git clone https://github.com/Gtajisan/esp32-jammer-control.git
cd esp32-jammer-control

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API Endpoints

### Jammer Control
```
POST /api/jammer/control
Body: { enabled: boolean, mode: string, txPower: number }
```

### Terminal Execution
```
POST /api/terminal/execute
Body: { command: string, tool?: 'farhan-shot' | 'system' }
```

### Device Status
```
GET /api/device/status
```

## Supported Jamming Modes

| Mode | Frequency | Range |
|------|-----------|-------|
| WiFi | 2400-2500 MHz | Up to 50m |
| Bluetooth/BLE | 2400-2483.5 MHz | Up to 30m |
| Zigbee | 2400-2485 MHz | Up to 40m |
| Drones | 2.4-5.8 GHz | Variable |

## Security

⚠️ This tool is for **educational and authorized testing only**. Unauthorized jamming is illegal.

- All commands are whitelisted
- Terminal execution is sandboxed
- Device communication is encrypted

## Project Structure

```
├── app/
│   ├── page.tsx              # Main control interface
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       ├── jammer/           # Jammer control API
│       ├── terminal/         # Terminal execution API
│       └── device/           # Device status API
├── components/
│   └── ui/                   # Reusable UI components
├── package.json
└── README.md
```

## Development

### Tech Stack
- **Frontend:** Next.js 16, React, TypeScript
- **Backend:** Node.js API routes
- **UI Components:** Radix UI, Tailwind CSS
- **Icons:** Lucide React

### Build for Production
```bash
npm run build
npm start
```

## Credits

**Developer:** Gtajisan
- GitHub: [@Gtajisan](https://github.com/Gtajisan)

Based on:
- ESPnRF24-Jammer
- FARHAN-Shot-v2

## License

Educational use only. Unauthorized use of jamming devices is illegal in most jurisdictions.

---

**Last Updated:** November 2025
