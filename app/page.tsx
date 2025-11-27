'use client'

import { useState, useEffect } from 'react'
import { Zap, Radio, Wifi, Bluetooth, Radar, Activity, Cpu, Signal, AlertTriangle, Lock, Unlock } from 'lucide-react'

export default function Home() {
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState('wifi')
  const [txPower, setTxPower] = useState(3)
  const [loading, setLoading] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState<any>(null)
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['[SYSTEM] Ready...'])
  const [terminalInput, setTerminalInput] = useState('')
  const [scanProgress, setScanProgress] = useState(0)

  const modes = [
    { id: 'wifi', name: 'WiFi 2.4GHz', icon: Wifi, freq: '2400-2500 MHz', color: '#00ffff' },
    { id: 'ble', name: 'Bluetooth/BLE', icon: Bluetooth, freq: '2400-2483.5 MHz', color: '#ff00ff' },
    { id: 'zigbee', name: 'Zigbee', icon: Radio, freq: '2400-2485 MHz', color: '#00ff88' },
    { id: 'drone', name: 'Drones', icon: Radar, freq: '2.4-5.8 GHz', color: '#ffaa00' },
  ]

  useEffect(() => {
    fetchDeviceStatus()
    const interval = setInterval(fetchDeviceStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isActive) {
      const scanInterval = setInterval(() => {
        setScanProgress(prev => (prev + Math.random() * 15) % 100)
      }, 500)
      return () => clearInterval(scanInterval)
    }
  }, [isActive])

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
        addTerminalOutput(`[${new Date().toLocaleTimeString()}] ${isActive ? '⏹ JAMMER DISARMED' : '▶ JAMMER ARMED'} | Mode: ${mode.toUpperCase()} | TX: ${txPower}`)
      } else {
        addTerminalOutput(`[ERR] ${data.error}`)
      }
    } catch (err) {
      addTerminalOutput(`[ERR] Control failed`)
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
        data.output.split('\n').forEach(line => addTerminalOutput(line))
      } else {
        addTerminalOutput(`[ERR] ${data.error}`)
      }
    } catch (err) {
      addTerminalOutput(`[ERR] Execution failed`)
    }
  }

  const addTerminalOutput = (line: string) => {
    setTerminalOutput(prev => [...prev.slice(-19), line])
  }

  const txPowerLabels = ['MIN', 'LOW', 'MED', 'MAX']

  return (
    <div className="min-h-screen bg-black text-cyan-300 terminal-text grid-overlay hex-bg overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 slide-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Zap className="h-10 w-10 text-cyan-400 neon-glow" />
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30"></div>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 neon-glow">
                  RF JAMMER NEXUS
                </h1>
                <p className="text-cyan-400 text-sm opacity-75">ESP32 2.4GHz Wireless Jammer Platform v1.0</p>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-950/20 backdrop-blur slide-in" style={{animationDelay: '0.1s'}}>
            <div className="flex gap-3 items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5 neon-red" />
              <div>
                <p className="text-red-100 text-sm font-mono">
                  [ALERT] RF jamming is illegal in most jurisdictions. Educational/Research only.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* Main Control */}
            <div className="md:col-span-2 space-y-4">
              {/* Power Control */}
              <div className="border border-cyan-500/50 bg-slate-900/30 backdrop-blur p-6 hover:border-cyan-400/80 transition-all slide-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-cyan-300 text-xs opacity-75 uppercase tracking-wider">{'>'}{'>'} System Status</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className={`status-indicator ${isActive ? 'status-active' : 'status-inactive'}`}></div>
                      <p className={`text-2xl font-bold ${isActive ? 'text-green-400 neon-green' : 'text-gray-400'}`}>
                        {isActive ? '◆ ARMED' : '◆ DISARMED'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 text-xs opacity-75 uppercase tracking-wider">{'>'}{'>'} Mode</p>
                    <p className="text-lg font-bold text-purple-300 mt-2">
                      {modes.find(m => m.id === mode)?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleJammer}
                  disabled={loading}
                  className={`w-full py-3 px-4 font-bold text-sm uppercase tracking-widest transition-all border-2 ${
                    isActive
                      ? 'border-red-500 text-red-400 hover:bg-red-500/20 neon-red'
                      : 'border-green-500 text-green-400 hover:bg-green-500/20 neon-green'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? '[ PROCESSING ]' : isActive ? '[ DISARM JAMMER ]' : '[ ARM JAMMER ]'}
                </button>
              </div>

              {/* TX Power Control */}
              <div className="border border-purple-500/50 bg-slate-900/30 backdrop-blur p-6 hover:border-purple-400/80 transition-all slide-in" style={{animationDelay: '0.3s'}}>
                <p className="text-purple-300 text-xs opacity-75 uppercase tracking-wider mb-4">{'>'}{'>'} TX Power Configuration</p>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={txPower}
                    onChange={(e) => setTxPower(Number(e.target.value))}
                    disabled={isActive}
                    className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer disabled:opacity-50"
                    style={{
                      accentColor: '#00ffff',
                    }}
                  />
                  <div className="grid grid-cols-4 gap-2 text-xs text-center">
                    {[0, 1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`py-2 border ${
                          txPower === i
                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 neon-glow'
                            : 'border-slate-600 text-slate-400'
                        }`}
                      >
                        {txPowerLabels[i]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-2 space-y-4">
              {/* Device Info */}
              <div className="border border-green-500/50 bg-slate-900/30 backdrop-blur p-6 hover:border-green-400/80 transition-all slide-in" style={{animationDelay: '0.4s'}}>
                <p className="text-green-300 text-xs opacity-75 uppercase tracking-wider mb-3">{'>'}{'>'} Device Status</p>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-green-400">IP Address:</span>
                    <span className="text-green-300">{deviceStatus?.ip || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Uptime:</span>
                    <span className="text-green-300">{deviceStatus?.uptime || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">RSSI:</span>
                    <span className="text-green-300">{deviceStatus?.rssi || 'N/A'} dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Memory:</span>
                    <span className="text-green-300">{deviceStatus?.freeHeap || 'N/A'} KB</span>
                  </div>
                </div>
              </div>

              {/* Scan Progress */}
              {isActive && (
                <div className="border border-yellow-500/50 bg-slate-900/30 backdrop-blur p-6 slide-in" style={{animationDelay: '0.5s'}}>
                  <p className="text-yellow-300 text-xs opacity-75 uppercase tracking-wider mb-3">{'>'}{'>'} Scan Progress</p>
                  <div className="relative h-2 bg-slate-700 border border-yellow-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-yellow-300 text-xs mt-2">{Math.round(scanProgress)}% Complete</p>
                </div>
              )}
            </div>
          </div>

          {/* Jamming Modes Grid */}
          <div className="mb-6 slide-in" style={{animationDelay: '0.6s'}}>
            <p className="text-cyan-300 text-xs opacity-75 uppercase tracking-wider mb-3">{'>'}{'>'} Select Jamming Mode</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map((m) => {
                const Icon = m.icon
                const isSelected = mode === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    disabled={isActive}
                    className={`p-4 border-2 transition-all relative group disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20'
                        : 'border-slate-600 hover:border-cyan-400/60 hover:bg-slate-800/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-cyan-400/10 blur-md"></div>
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-bold text-center">{m.name}</span>
                      <span className="text-xs opacity-60">{m.freq}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Terminal */}
          <div className="border-2 border-cyan-500 bg-black/50 backdrop-blur slide-in" style={{animationDelay: '0.7s'}}>
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 px-6 py-3 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400 neon-glow" />
                <p className="text-cyan-300 font-bold text-sm uppercase tracking-wider">TERMINAL / COMMAND INTERFACE</p>
              </div>
              <p className="text-cyan-400 text-xs opacity-75">FARHAN-SHOT v2</p>
            </div>

            {/* Terminal Output */}
            <div className="p-6 font-mono text-sm space-y-1 h-72 overflow-y-auto bg-black/70 border-b border-cyan-500/20">
              {terminalOutput.map((line, idx) => (
                <div key={idx} className="text-cyan-400/90">
                  {line.includes('[ERR]') ? (
                    <span className="text-red-400 neon-red">{line}</span>
                  ) : line.includes('[SYSTEM]') ? (
                    <span className="text-green-400 neon-green">{line}</span>
                  ) : line.startsWith('$') ? (
                    <span className="text-purple-400">{line}</span>
                  ) : line.includes('▶') || line.includes('⏹') ? (
                    <span className="text-yellow-400 neon-red">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="p-6 bg-black/50 border-t border-cyan-500/20 flex gap-3">
              <span className="text-cyan-400">$&gt;</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-b border-cyan-500/50 focus:border-cyan-400 outline-none text-cyan-400 placeholder-slate-600 text-sm transition-all"
              />
              <button
                onClick={executeCommand}
                disabled={!terminalInput.trim()}
                className="px-4 py-1 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold uppercase transition-all"
              >
                Exec
              </button>
            </div>

            {/* Help Text */}
            <div className="p-4 bg-slate-900/30 border-t border-cyan-500/10 text-xs text-slate-400 font-mono">
              Available: scan_networks | scan_ble | get_devices | status | help
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-slate-500 text-xs space-y-1">
            <p className="font-mono">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            <p>ESP32 RF JAMMER NEXUS | Based on ESPnRF24-Jammer + FARHAN-Shot-v2</p>
            <p className="text-cyan-400">Credits: Gtajisan | chickendrop89 | GazaOS</p>
            <p className="font-mono">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
          </div>
        </div>
      </div>
    </div>
  )
}
