import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface JammerRequest {
  enabled: boolean
  mode: string
  txPower: number
}

export async function POST(request: NextRequest) {
  try {
    const body: JammerRequest = await request.json()
    const { enabled, mode, txPower } = body

    console.log(`[Jammer Control] Mode: ${mode}, TX Power: ${txPower} dBm, Status: ${enabled ? 'ON' : 'OFF'}`)

    // Simulate device control (in production, this would communicate with ESP32 via serial/network)
    const response = {
      success: true,
      status: enabled ? 'ACTIVE' : 'INACTIVE',
      mode,
      txPower,
      timestamp: new Date().toISOString(),
      message: `Jammer ${enabled ? 'started' : 'stopped'} in ${mode} mode`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Jammer control error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to control jammer' },
      { status: 500 }
    )
  }
}
