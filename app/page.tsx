'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap, Radio, Wifi, Bluetooth, Drone, Settings } from 'lucide-react'

export default function Home() {
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('wifi')
  const [txPower, setTxPower] = useState(20)

  const modes = [
    { id: 'wifi', name: 'WiFi 2.4GHz', icon: Wifi, freq: '2400-2500 MHz' },
    { id: 'ble', name: 'Bluetooth/BLE', icon: Bluetooth, freq: '2400-2483.5 MHz' },
    { id: 'zigbee', name: 'Zigbee', icon: Radio, freq: '2400-2485 MHz' },
    { id: 'drone', name: 'Drones', icon: Drone, freq: '2.4-5.8 GHz' },
  ]

  const toggleJammer = async () => {
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
      if (data.success) setIsActive(!isActive)
    } catch (err) {
      console.error('Control failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8 text-cyan-500" />
            <h1 className="text-4xl font-bold text-white">ESP32 RF Jammer Control</h1>
          </div>
          <p className="text-slate-400">Advanced RF jamming platform by Gtajisan</p>
        </div>

        {/* Status Card */}
        <Card className="mb-8 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400">Jammer Status</p>
                <p className={`text-2xl font-bold ${isActive ? 'text-red-500' : 'text-green-500'}`}>
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </p>
              </div>
              <Button
                size="lg"
                onClick={toggleJammer}
                className={isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isActive ? 'Stop Jammer' : 'Start Jammer'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Control Tabs */}
        <Tabs defaultValue="modes" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
            <TabsTrigger value="modes">Jamming Modes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
          </TabsList>

          {/* Modes Tab */}
          <TabsContent value="modes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modes.map(m => (
                <Card
                  key={m.id}
                  className={`cursor-pointer transition-all border-2 ${
                    mode === m.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-cyan-500/50'
                  }`}
                  onClick={() => setMode(m.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <m.icon className="h-5 w-5 text-cyan-500" />
                      <CardTitle className="text-lg">{m.name}</CardTitle>
                    </div>
                    <CardDescription>{m.freq}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!isActive}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      {mode === m.id ? 'Selected' : 'Select'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle>Transmitter Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-slate-300 block mb-3">TX Power: {txPower} dBm</label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={txPower}
                    onChange={(e) => setTxPower(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-slate-500 text-sm mt-2">Range: 0-30 dBm</p>
                </div>

                <div>
                  <label className="text-slate-300 block mb-3">Selected Mode</label>
                  <div className="bg-slate-900 p-3 rounded border border-slate-700">
                    <p className="text-cyan-400">{mode.toUpperCase()}</p>
                  </div>
                </div>

                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Apply Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terminal Tab */}
          <TabsContent value="terminal">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle>Terminal & Device Output</CardTitle>
                <CardDescription>FARHAN-Shot-v2 & Device Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded border border-slate-700 p-4 font-mono text-sm h-64 overflow-y-auto">
                  <TerminalOutput />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TerminalOutput() {
  const [output, setOutput] = useState<string[]>(['$ Initializing device...'])

  return (
    <div className="space-y-1">
      {output.map((line, i) => (
        <div key={i} className="text-green-500">
          {line}
        </div>
      ))}
    </div>
  )
}
