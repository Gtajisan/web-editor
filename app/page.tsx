'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap, Radio, Wifi, Bluetooth, Drone, Settings, Cpu, Signal, AlertTriangle } from 'lucide-react'

export default function Home() {
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('wifi')
  const [txPower, setTxPower] = useState(3)
  const [loading, setLoading] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState<any>(null)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [terminalInput, setTerminalInput] = useState('')

  const modes = [
    { id: 'wifi', name: 'WiFi 2.4GHz', icon: Wifi, freq: '2400-2500 MHz' },
    { id: 'ble', name: 'Bluetooth/BLE', icon: Bluetooth, freq: '2400-2483.5 MHz' },
    { id: 'zigbee', name: 'Zigbee', icon: Radio, freq: '2400-2485 MHz' },
    { id: 'drone', name: 'Drones', icon: Drone, freq: '2.4-5.8 GHz' },
  ]

  useEffect(() => {
    fetchDeviceStatus()
    const interval = setInterval(fetchDeviceStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchDeviceStatus = async () => {
    try {
      const response = await fetch('/api/device/status')
      const data = await response.json()
      setDeviceStatus(data)
    } catch (err) {
      console.error('Status fetch failed:', err)
    }
  }

  const toggleJammer = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/jammer/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: !isActive,
          mode,
          txPower
        })
      })
      const data = await response.json()
      if (data.success) {
        setIsActive(!isActive)
        addTerminalOutput(`${isActive ? '⏹' : '▶'} Jammer ${isActive ? 'stopped' : 'started'} - Mode: ${mode.toUpperCase()}, TX Power: ${txPower}`)
      } else {
        addTerminalOutput(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      addTerminalOutput(`❌ Control failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const executeCommand = async () => {
    if (!terminalInput.trim()) return
    
    addTerminalOutput(`$ ${terminalInput}`)
    setTerminalInput('')
    
    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: terminalInput })
      })
      const data = await response.json()
      if (data.output) {
        addTerminalOutput(data.output)
      } else {
        addTerminalOutput(`❌ Error: ${data.error}`)
      }
    } catch (err) {
      addTerminalOutput(`❌ Execution failed: ${err}`)
    }
  }

  const addTerminalOutput = (line: string) => {
    setTerminalOutput(prev => [...prev, line])
  }

  const txPowerLabels = ['Min (0 dBm)', 'Low (-6 dBm)', 'Med (-12 dBm)', 'Max (-18 dBm)']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">ESP32 RF Jammer Control</h1>
          </div>
          <p className="text-slate-400">Advanced 2.4GHz wireless jamming platform</p>
          <p className="text-slate-500 text-sm mt-1">By Gtajisan | Credit to chickendrop89 & GazaOS</p>
        </div>

        {/* Warning */}
        <Card className="mb-6 border-red-900/50 bg-red-950/20">
          <CardContent className="pt-6 flex gap-3 items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-100 text-sm">
                <strong>LEGAL WARNING:</strong> RF jamming is illegal in most countries. This platform is for educational and research purposes only. Unauthorized use can result in severe legal penalties.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="md:col-span-2">
            {/* Status Card */}
            <Card className="mb-6 border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">Jammer Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                      <p className={`text-lg font-bold ${isActive ? 'text-red-400' : 'text-green-400'}`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Current Mode</p>
                    <p className="text-lg font-bold text-cyan-400 mt-1">
                      {modes.find(m => m.id === mode)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">TX Power</p>
                    <p className="text-lg font-bold text-yellow-400 mt-1">{txPowerLabels[txPower]}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Device Connect</p>
                    <p className="text-lg font-bold text-purple-400 mt-1">
                      {deviceStatus?.connected ? '✓ Connected' : '✗ Offline'}
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={toggleJammer}
                  disabled={loading}
                  className={`w-full ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold`}
                >
                  {loading ? 'Processing...' : isActive ? '⏹ STOP JAMMER' : '▶ START JAMMER'}
                </Button>
              </CardContent>
            </Card>

            {/* Jamming Modes */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle>Jamming Modes</CardTitle>
                <CardDescription>Select your target frequency band</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {modes.map((m) => {
                    const Icon = m.icon
                    return (
                      <Button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        variant={mode === m.id ? 'default' : 'outline'}
                        className={`h-auto py-4 flex flex-col items-center gap-2 ${
                          mode === m.id
                            ? 'bg-cyan-600 hover:bg-cyan-700'
                            : 'border-slate-600 hover:bg-slate-700'
                        }`}
                        disabled={isActive}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs text-center">
                          <div className="font-semibold">{m.name}</div>
                          <div className="text-xs opacity-75">{m.freq}</div>
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div>
            {/* TX Power */}
            <Card className="border-slate-700 bg-slate-800/50 mb-6">
              <CardHeader>
                <CardTitle className="text-base">TX Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={txPower}
                    onChange={(e) => setTxPower(Number(e.target.value))}
                    disabled={isActive}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Level {txPower}</p>
                    <p className="text-xs text-slate-500">{txPowerLabels[txPower]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Info */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Device Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-400">Uptime</p>
                  <p className="text-slate-200 font-mono">{deviceStatus?.uptime || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400">RSSI</p>
                  <p className="text-slate-200 font-mono">{deviceStatus?.rssi || 'N/A'} dBm</p>
                </div>
                <div>
                  <p className="text-slate-400">Memory</p>
                  <p className="text-slate-200 font-mono">{deviceStatus?.freeHeap || 'N/A'} KB</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Terminal */}
        <Card className="mt-6 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              Terminal / FARHAN-Shot Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded border border-slate-700 p-4 mb-4 font-mono text-sm">
              <div className="max-h-64 overflow-y-auto space-y-1">
                {terminalOutput.length === 0 ? (
                  <p className="text-slate-500">Terminal ready...</p>
                ) : (
                  terminalOutput.map((line, idx) => (
                    <div key={idx} className="text-slate-200">
                      {line.includes('❌') ? (
                        <span className="text-red-400">{line}</span>
                      ) : line.includes('✓') || line.includes('▶') ? (
                        <span className="text-green-400">{line}</span>
                      ) : line.startsWith('$') ? (
                        <span className="text-cyan-400">{line}</span>
                      ) : (
                        line
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                placeholder="Enter command (e.g., scan_networks, get_devices)..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
              <Button
                onClick={executeCommand}
                disabled={!terminalInput.trim()}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Execute
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Run FARHAN-Shot-v2 commands for network scanning, device enumeration, and wireless analysis.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-slate-500 text-sm">
          <p>ESP32 RF Jammer Platform | Built with Next.js + ESPnRF24-Jammer + FARHAN-Shot-v2</p>
          <p className="mt-1 text-xs">All credits to Gtajisan (ffjisan804@gmail.com)</p>
        </div>
      </div>
    </div>
  )
}
