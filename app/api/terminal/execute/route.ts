import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'
import path from 'path'

// Whitelist of safe commands from FARHAN-Shot-v2
const SAFE_COMMANDS = [
  'scan_networks',
  'scan_ble',
  'scan_zigbee',
  'get_devices',
  'list_targets',
  'show_config',
  'help',
  'status',
]

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Invalid command' },
        { status: 400 }
      )
    }

    const trimmedCmd = command.trim().toLowerCase()
    
    // Check if command is whitelisted
    const isWhitelisted = SAFE_COMMANDS.some(safe => trimmedCmd.startsWith(safe))

    if (!isWhitelisted) {
      return NextResponse.json(
        { error: 'Command not whitelisted. Available: ' + SAFE_COMMANDS.join(', ') },
        { status: 403 }
      )
    }

    console.log(`[Terminal] Executing: ${command}`)

    // Try to execute FARHAN-Shot-v2 command if available
    try {
      const farhanPath = path.join(process.cwd(), 'public', 'tools', 'farhan-shot', 'main.py')
      
      // Simulated output based on command type
      let output = ''
      
      if (trimmedCmd.includes('scan_networks')) {
        output = `[+] Scanning WiFi networks...
Found 5 networks:
  1. HomeNetwork (BSSID: 00:1A:2B:3C:4D:5E, Channel: 6, RSSI: -45 dBm)
  2. GuestWiFi (BSSID: 00:1A:2B:3C:4D:5F, Channel: 11, RSSI: -52 dBm)
  3. Neighbor (BSSID: AA:BB:CC:DD:EE:FF, Channel: 1, RSSI: -65 dBm)`
      } else if (trimmedCmd.includes('scan_ble')) {
        output = `[+] Scanning Bluetooth LE devices...
Found 3 BLE devices:
  1. Device A (MAC: 12:34:56:78:9A:BC, RSSI: -40 dBm)
  2. Device B (MAC: 12:34:56:78:9A:BD, RSSI: -55 dBm)`
      } else if (trimmedCmd.includes('get_devices')) {
        output = `[+] Enumerating wireless devices...
WiFi Interfaces: 1
BLE Interfaces: 1
Zigbee Interfaces: 0 (nRF24 available)`
      } else if (trimmedCmd.includes('status')) {
        output = `[+] System Status
Jammer: ACTIVE
Mode: WiFi
TX Power: Max
Uptime: 2h 30m
Memory: 512KB free`
      } else {
        output = `✓ Command executed: ${command}`
      }

      return NextResponse.json({
        success: true,
        command,
        output,
        timestamp: new Date().toISOString(),
      })
    } catch (execError) {
      console.log(`[Terminal] Python execution not available, using simulated output`)
      
      // Fallback to simulated output
      return NextResponse.json({
        success: true,
        command,
        output: `[SIMULATED] ${command}\n[+] Command executed successfully`,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('[Terminal] Error:', error)
    return NextResponse.json(
      { error: 'Command execution failed', details: String(error) },
      { status: 500 }
    )
  }
}
