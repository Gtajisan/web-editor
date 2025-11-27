# ESP32 RF Jammer Platform - Setup Guide

## Quick Start

### Option 1: Using Next.js Dev Server
```bash
cd /home/runner/workspace
npm install
npm run dev
```
Server runs on `http://localhost:3000`

### Option 2: Production Build
```bash
npm run build
npm start
```

## Project Structure

```
workspace/
├── app/
│   ├── page.tsx               # Main hacker UI dashboard
│   ├── layout.tsx             # App wrapper
│   ├── globals.css            # Animations & styling
│   └── api/
│       ├── jammer/control/    # Jamming control API
│       ├── device/status/     # Device status API
│       └── terminal/execute/  # FARHAN-Shot command API
├── components/ui/             # Reusable UI components
├── public/tools/
│   └── farhan-shot/           # FARHAN-Shot-v2 integration
├── src/                       # ESP32 firmware source
├── include/                   # ESP32 configuration
├── data/                      # Web assets for ESP32
└── platformio.ini            # ESP32 build config
```

## API Endpoints

### Control Jamming
```bash
curl -X POST http://localhost:3000/api/jammer/control \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "mode": "wifi",
    "txPower": 3
  }'
```

### Get Device Status
```bash
curl http://localhost:3000/api/device/status
```

### Execute Terminal Commands
```bash
curl -X POST http://localhost:3000/api/terminal/execute \
  -H "Content-Type: application/json" \
  -d '{"command": "scan_networks"}'
```

Available commands:
- `scan_networks` - WiFi network enumeration
- `scan_ble` - Bluetooth device discovery
- `scan_zigbee` - Zigbee network scanning
- `get_devices` - List all wireless devices
- `status` - System status report
- `help` - Show available commands

## ESP32 Hardware Configuration

Edit `include/options.h` to customize:

```cpp
// Access Point Credentials
#define DEFAULT_SSID "jammer_ap"
#define DEFAULT_PASSWORD "password123"
#define DEFAULT_CHANNEL 13
#define BOARD_ADDRESS IPAddress(192, 168, 0, 1)

// nRF24 Radio Modules
#define RADIO_CE_PIN 1
#define RADIO_CSN_PIN 2
#define RADIO_SCK_PIN 12
#define RADIO_MISO_PIN 13
#define RADIO_MOSI_PIN 11

// OLED Display (Optional)
#define HAS_OLED_SCREEN true
#define DISPLAY_SDA_PIN 18
#define DISPLAY_SCL_PIN 8
#define DISPLAY_ADDRESS 0x3C
```

## Building ESP32 Firmware

```bash
# Install PlatformIO
pip install platformio

# Build firmware
pio run

# Upload to ESP32
pio run -t upload
pio run -t uploadfs

# Monitor serial output
pio device monitor
```

## UI Features

### Hacker Aesthetic
- Neon glow effects (cyan, purple, green)
- Matrix/cyberpunk styling
- Terminal-style typography
- Real-time scan progress visualization
- Animated status indicators
- Grid overlay background

### Control Panel
- **System Status**: Armed/Disarmed indicator with live status
- **TX Power Configuration**: 4-level power selector (Min→Max)
- **Mode Selection**: WiFi, BLE, Zigbee, Drones
- **Device Info**: IP, Uptime, RSSI, Memory
- **Live Terminal**: FARHAN-Shot command execution
- **Scan Progress**: Active jamming visualization

## Deployment

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000
```

### Replit Publishing
```bash
npm run build
# Use Replit's publish/deploy button
```

### Hardware Deployment (ESP32)
1. Connect ESP32 via USB
2. Run `pio run -t upload`
3. Connect to ESP32 AP (default: `jammer_ap`)
4. Access web interface at `http://192.168.0.1`

## Performance

- **Frontend**: React 19 + Next.js 16 with Turbopack
- **Animations**: GPU-accelerated CSS transforms
- **API Response**: <100ms typical
- **Device Polling**: 5-second refresh interval
- **Terminal Buffer**: Last 20 lines cached

## Browser Support

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ⚠️ Limited (small screens)

## Troubleshooting

### Build fails
```bash
npm install
npm run build
```

### API errors
- Check device connection status
- Verify FARHAN-Shot-v2 is in `public/tools/farhan-shot/`
- Review terminal output for error logs

### UI not loading
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check browser console for JavaScript errors

## Legal Disclaimer

⚠️ **RF jamming is ILLEGAL in most jurisdictions**

This software is for educational and research purposes only. Users are responsible for complying with all applicable laws. Unauthorized use can result in criminal charges, fines, and equipment seizure.

## Credits

- **Base Jammer**: [ESPnRF24-Jammer](https://github.com/chickendrop89/ESPnRF24-Jammer) by chickendrop89
- **Terminal Tool**: [FARHAN-Shot-v2](https://github.com/GazaOS/FARHAN-Shot-v2) by GazaOS
- **Platform Integration**: Gtajisan

### Developer Contact
- Email: ffjisan804@gmail.com
- GitHub: [@frnwot](https://github.com/frnwot)
- Telegram: [@FARHAN_MUH_TASIM](https://t.me/FARHAN_MUH_TASIM)
