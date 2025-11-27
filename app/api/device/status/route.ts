import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate device status
    // In production, this would fetch from the ESP32 device
    const uptime = Math.floor(Date.now() / 1000)
    
    const status = {
      connected: true,
      device: 'ESP32-S3 DevKit',
      ip: '192.168.0.1',
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      rssi: -45,
      freeHeap: 512,
      version: '1.0.0',
      features: ['WiFi', 'BLE', 'Zigbee', 'Drones', 'OLED Display'],
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('[Device Status] Error:', error)
    return NextResponse.json(
      { connected: false, error: 'Unable to fetch device status' },
      { status: 500 }
    )
  }
}
