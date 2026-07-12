"use client"

import { useMemo } from "react"

const W = 700
const H = 560
const CORE: [number, number] = [W / 2, H / 2 + 10]

type Status = "connected" | "onboarding"

// Abstract network of integrations/teams around a central hub. "connected" =
// live and syncing, "onboarding" = currently being set up.
const NODES: { name: string; status: Status }[] = [
  { name: "Team A", status: "connected" },
  { name: "Team B", status: "connected" },
  { name: "Integration A", status: "onboarding" },
  { name: "Integration B", status: "onboarding" },
  { name: "Team C", status: "connected" },
  { name: "Partner A", status: "connected" },
  { name: "Team D", status: "onboarding" },
  { name: "Integration C", status: "connected" },
  { name: "Team E", status: "onboarding" },
  { name: "Partner B", status: "onboarding" },
  { name: "Team F", status: "connected" },
  { name: "Integration D", status: "connected" },
]

const COLORS = {
  connected: "#afd369",
  onboarding: "#89b7ee",
}

function arcPath(a: [number, number], b: [number, number], bend: number) {
  const [x1, y1] = a
  const [x2, y2] = b
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy) || 1
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  // Perpendicular control point to lift the arc into a curve.
  const nx = -dy / dist
  const ny = dx / dist
  const cx = mx + nx * dist * bend
  const cy = my + ny * dist * bend
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`
}

export function NetworkMap() {
  const { nodes, arcs } = useMemo(() => {
    const radius = Math.min(W, H) / 2 - 60

    const nodes = NODES.map((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2
      const x = Math.round((CORE[0] + radius * Math.cos(angle)) * 100) / 100
      const y = Math.round((CORE[1] + radius * Math.sin(angle)) * 100) / 100
      return { ...n, x, y }
    })

    const arcs = nodes.map((n, i) => {
      const bend = (i % 2 === 0 ? 1 : -1) * (0.16 + (i % 3) * 0.05)
      return {
        d: arcPath(CORE, [n.x, n.y], bend),
        color: COLORS[n.status],
        dur: Math.round((2.6 + (i % 5) * 0.45) * 100) / 100,
        delay: Math.round((i % 8) * 0.4 * 100) / 100,
      }
    })

    return { nodes, arcs }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1a2b] shadow-2xl">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 38%, rgba(137,183,238,0.18), transparent 60%), radial-gradient(90% 70% at 50% 120%, rgba(175,211,105,0.14), transparent 55%)",
        }}
      />

      {/* Header chips */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#afd369] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#afd369]" />
          </span>
          <span className="text-sm font-medium text-white/90">Live network</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.connected }} />
            Connected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.onboarding }} />
            Onboarding
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative z-10 h-auto w-full"
        role="img"
        aria-label="Abstract network diagram with beams of light connecting teams and integrations to a shared central hub"
      >
        <defs>
          <filter id="nm-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nm-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#afd369" />
            <stop offset="100%" stopColor="#4a7a1f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection arcs */}
        <g fill="none">
          {arcs.map((a, i) => (
            <path key={`base-${i}`} d={a.d} stroke={a.color} strokeOpacity={0.18} strokeWidth={1} />
          ))}
          {arcs.map((a, i) => (
            <circle key={`spark-${i}`} r={2.6} fill={a.color} filter="url(#nm-glow)">
              <animateMotion dur={`${a.dur}s`} begin={`${a.delay}s`} repeatCount="indefinite" path={a.d} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.85;1"
                dur={`${a.dur}s`}
                begin={`${a.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n) => (
            <g key={n.name}>
              <circle cx={n.x} cy={n.y} r={5.5} fill={COLORS[n.status]} fillOpacity={0.18}>
                <animate
                  attributeName="r"
                  values="4;9;4"
                  dur="3s"
                  begin={`${Math.round((n.x % 5) * 0.3 * 100) / 100}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  values="0.28;0;0.28"
                  dur="3s"
                  begin={`${Math.round((n.x % 5) * 0.3 * 100) / 100}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={n.x} cy={n.y} r={2.6} fill={COLORS[n.status]} filter="url(#nm-glow)" />
            </g>
          ))}
        </g>

        {/* Central hub */}
        <g>
          <circle cx={CORE[0]} cy={CORE[1]} r={26} fill="url(#nm-core)" opacity={0.85} />
          <circle cx={CORE[0]} cy={CORE[1]} r={5} fill="#ffffff" filter="url(#nm-glow)" />
          <circle cx={CORE[0]} cy={CORE[1]} r={11} fill="none" stroke="#afd369" strokeWidth={1.2} strokeOpacity={0.6}>
            <animate attributeName="r" values="9;20;9" dur="3.4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="3.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* Footer caption */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-white/60">
        <span>Core Admin — one secure source of truth, every team connected</span>
        <span className="font-mono">Built to scale</span>
      </div>
    </div>
  )
}
