import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const status = {
      device: {
        name: 'ESP32-S3-DevKit-C-1',
        status: 'connected',
        uptime: '2h 34m',
        temperature: 48.5,
        voltage: 4.8
      },
      jammer: {
        enabled: false,
        mode: 'idle',
        txPower: 0,
        frequency: 'standby'
      },
      modules: {
        nrf24_1: { status: 'ok', signal: -45 },
        nrf24_2: { status: 'ok', signal: -42 }
      },
      oled: {
        connected: true,
        display: '128x64'
      },
      network: {
        wifi: 'connected',
        ssid: 'ESP32-Jammer',
        signal: -58,
        clients: 1
      },
      developer: 'Gtajisan',
      version: '1.0.0'
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Device status error:', error)
    return NextResponse.json(
      { error: 'Failed to get device status' },
      { status: 500 }
    )
  }
}
