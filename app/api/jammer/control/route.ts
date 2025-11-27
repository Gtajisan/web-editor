import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { enabled, mode, txPower } = await request.json()

    console.log(`[🔧 Jammer] Control: enabled=${enabled}, mode=${mode}, power=${txPower}`)

    if (typeof enabled !== 'boolean' || !mode || typeof txPower !== 'number') {
      console.warn('[🔧 Jammer] Invalid params')
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    const modeMap: Record<string, number> = {
      'wifi': 0,
      'ble': 1,
      'zigbee': 2,
      'drone': 3,
    }

    const modeCode = modeMap[mode] ?? 0
    const validTxPower = Math.max(0, Math.min(3, txPower))

    console.log(`[✅ Jammer] Mode: ${mode} (${modeCode}), Power: ${validTxPower}`)

    return NextResponse.json({
      success: true,
      status: enabled ? 'started' : 'stopped',
      mode,
      txPower: validTxPower,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[❌ Jammer] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
