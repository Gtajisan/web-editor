# ESP32 RF Jammer Control Platform

A comprehensive web-based control platform for the ESPnRF24-Jammer, integrated with FARHAN-Shot-v2 terminal tools for advanced 2.4GHz wireless jamming.

## Features

✨ **Advanced Control Interface**
- Real-time jammer status monitoring
- Multiple jamming modes (WiFi, BLE, Zigbee, Drones)
- TX power configuration (0-30 dBm levels)
- OLED display support for hardware feedback
- Captive portal for easy device access

🛠️ **FARHAN-Shot-v2 Integration**
- Network scanning and enumeration
- BLE device discovery
- Zigbee device detection
- Wireless vulnerability assessment
- Terminal-based command execution

📊 **Web Interface**
- Next.js-powered responsive UI
- Real-time device status dashboard
- Terminal output viewer
- System monitoring (uptime, memory, RSSI)
- Dark-themed professional design

## System Requirements

### Hardware
- **ESP32** board (tested on ESP32-S3 DevKit)
- **2x nRF24L01+PA+LNA** modules
- **2x 100μF** electrolytic capacitors
- Optional: **SSD1306** OLED display (128x64)

### Software
- PlatformIO (for ESP32 firmware)
- Node.js 18+ (for web interface)
- Python 3.8+ (for FARHAN-Shot-v2)

## Installation

### 1. ESP32 Firmware Setup
```bash
# Install PlatformIO
pip install platformio

# Configure hardware pinouts
nano include/options.h

# Build and upload
pio run -t upload
pio run -t uploadfs
```

### 2. Web Interface Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# The interface will be available at http://localhost:3000
```

### 3. FARHAN-Shot-v2 Integration
```bash
# FARHAN-Shot-v2 is included in public/tools/farhan-shot
# No additional setup required - commands are executed via API

# Available commands:
# - scan_networks: Scan WiFi networks
# - scan_ble: Scan BLE devices  
# - scan_zigbee: Scan Zigbee devices
# - get_devices: Enumerate wireless devices
# - status: Show system status
```

## Project Structure

```
workspace/
├── app/
│   ├── page.tsx              # Main control interface
│   ├── layout.tsx            # App layout
│   ├── globals.css           # Global styles
│   └── api/
│       ├── jammer/control    # Jammer control endpoint
│       ├── device/status     # Device status endpoint
│       └── terminal/execute  # Terminal command endpoint
├── components/ui/            # Reusable UI components
├── public/
│   └── tools/
│       └── farhan-shot/       # FARHAN-Shot-v2 integration
├── src/                       # ESP32 firmware source
├── include/                   # ESP32 headers & config
├── data/                      # Web interface assets for ESP32
└── platformio.ini            # PlatformIO configuration
```

## API Endpoints

### POST `/api/jammer/control`
Control jammer operation.
```json
{
  "enabled": true,
  "mode": "wifi",
  "txPower": 3
}
```

### GET `/api/device/status`
Get device information and status.

### POST `/api/terminal/execute`
Execute FARHAN-Shot-v2 commands.
```json
{
  "command": "scan_networks"
}
```

## Configuration

### ESP32 Hardware Config (`include/options.h`)
```c
// nRF24 Pins (FSPI Bus)
#define RADIO_CE_PIN 1
#define RADIO_CSN_PIN 2
#define RADIO_SCK_PIN 12
#define RADIO_MISO_PIN 13
#define RADIO_MOSI_PIN 11

// Access Point
#define DEFAULT_SSID "jammer_ap"
#define DEFAULT_PASSWORD "password123"
#define DEFAULT_CHANNEL 13
#define BOARD_ADDRESS IPAddress(192, 168, 0, 1)

// OLED Display (I2C)
#define HAS_OLED_SCREEN true
#define DISPLAY_SDA_PIN 18
#define DISPLAY_SCL_PIN 8
```

### Web Interface Config
Edit `next.config.mjs` for API base URL configuration.

## Jamming Modes

| Mode | Frequency | Uses | Purpose |
|------|-----------|------|---------|
| WiFi 2.4GHz | 2400-2500 MHz | IEEE 802.11b/g/n | WLAN jamming |
| Bluetooth/BLE | 2400-2483.5 MHz | Bluetooth Classic & LE | BT device disruption |
| Zigbee | 2400-2485 MHz | IEEE 802.15.4 | Zigbee network jamming |
| Drones | 2.4-5.8 GHz | RC protocols | Drone control jamming |

## TX Power Levels

- **Level 0**: Minimum (-18 dBm) - Short range, low interference
- **Level 1**: Low (-12 dBm) - Medium range
- **Level 2**: Medium (-6 dBm) - Extended range
- **Level 3**: Maximum (0 dBm) - Full power, maximum range

## Deployment

### Development
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### ESP32 Deployment
1. Upload firmware via PlatformIO
2. Connect to ESP32 AP (default: `jammer_ap`)
3. Navigate to `http://192.168.0.1` in browser

## Security & Legal

⚠️ **WARNING**: Radio frequency jamming is **ILLEGAL** in most countries, including:
- United States (FCC violations)
- European Union
- Australia
- Canada
- Most other nations

This platform is **FOR EDUCATIONAL AND RESEARCH PURPOSES ONLY**.

**Unauthorized use can result in:**
- Criminal charges
- Significant fines
- Equipment confiscation
- Imprisonment

The developers are not responsible for misuse. Users must comply with all local laws.

## Credits

- **Project Base**: [ESPnRF24-Jammer by chickendrop89](https://github.com/chickendrop89/ESPnRF24-Jammer)
- **Terminal Tool**: [FARHAN-Shot-v2 by GazaOS](https://github.com/GazaOS/FARHAN-Shot-v2)
- **Platform Integration**: Gtajisan

### Developer Contact
- **Email**: ffjisan804@gmail.com
- **GitHub**: [@frnwot](https://github.com/frnwot)
- **Telegram**: [@FARHAN_MUH_TASIM](https://t.me/FARHAN_MUH_TASIM)
- **YouTube**: [@zerox-farhan](https://www.youtube.com/@zerox-farhan)
- **Instagram**: [@frn_prime](https://instagram.com/frn_prime)
- **LinkedIn**: [jisan-ff](https://linkedin.com/in/jisan-ff)

## License

This project includes components licensed under:
- GNU General Public License v3.0 (ESPnRF24-Jammer)
- GNU General Public License v3.0 (FARHAN-Shot-v2)
- MIT License (Web Platform)

## Disclaimer

This project is provided "as-is" for educational purposes. By using this software, you agree to:
1. Use it only in controlled environments for research
2. Comply with all applicable laws and regulations
3. Not use it for illegal jamming activities
4. Accept full responsibility for your actions

## Contributing

Contributions are welcome for:
- Bug fixes
- Documentation improvements
- Additional jamming modes
- Enhanced UI/UX
- Performance optimizations

Please ensure all contributions comply with the GPL v3.0 license.

---

**Build Date**: November 2025
**Version**: 1.0.0
**Status**: Production Ready
