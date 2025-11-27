import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface TerminalRequest {
  command: string
  tool?: 'farhan-shot' | 'system'
}

// Whitelist of allowed commands for security
const ALLOWED_COMMANDS = [
  'farhan-shot',
  'device-status',
  'esp32-info',
  'network-scan',
  'logs'
]

export async function POST(request: NextRequest) {
  try {
    const body: TerminalRequest = await request.json()
    const { command, tool } = body

    // Security: Only allow whitelisted commands
    if (!ALLOWED_COMMANDS.some(cmd => command.includes(cmd))) {
      return NextResponse.json(
        { success: false, error: 'Command not allowed' },
        { status: 403 }
      )
    }

    let output = ''

    try {
      const { stdout } = await execAsync(command, { timeout: 5000 })
      output = stdout
    } catch (execError: any) {
      output = execError.stderr || execError.message || 'Command failed'
    }

    return NextResponse.json({
      success: true,
      output,
      command,
      tool: tool || 'system',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Terminal execution error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to execute command' },
      { status: 500 }
    )
  }
}
