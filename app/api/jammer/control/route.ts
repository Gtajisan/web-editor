import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { enabled, mode, txPower } = await request.json()

    console.log(`[Jammer Control] Received: enabled=${enabled}, mode=${mode}, txPower=${txPower}`)

    // Validate inputs
    if (typeof enabled !== 'boolean' || !mode || typeof txPower !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    // Map modes to ESP32 commands
    const modeMap: Record<string, number> = {
      'wifi': 0,
      'ble': 1,
      'zigbee': 2,
      'drone': 3,
    }

    const modeCode = modeMap[mode] ?? 0

    // Validate TX power (0-3)
    const validTxPower = Math.max(0, Math.min(3, txPower))

    console.log(`[Jammer Control] Mode: ${mode} (${modeCode}), TX Power: ${validTxPower}`)

    // In production, this would send HTTP commands to the ESP32 device
    // Example: POST to http://192.168.0.1/api/jam with payload
    // For now, we'll simulate the control
    
    const response = {
      success: true,
      status: enabled ? 'started' : 'stopped',
      mode,
      txPower: validTxPower,
      timestamp: new Date().toISOString(),
    }

    console.log(`[Jammer Control] Response:`, response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Jammer Control] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
