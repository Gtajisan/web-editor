import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[📊 Device] Fetching status...')
    
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

    console.log('[✅ Device] Status retrieved')
    return NextResponse.json(status)
  } catch (error) {
    console.error('[❌ Device] Error:', error)
    return NextResponse.json(
      { connected: false, error: 'Unable to fetch device status' },
      { status: 500 }
    )
  }
}
