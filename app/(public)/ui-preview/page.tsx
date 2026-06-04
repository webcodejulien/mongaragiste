'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Variante 1 — Minimal Light
// ─────────────────────────────────────────────────────────────────────────────
function MinimalLight() {
  const sidebar: React.CSSProperties = {
    width: 110,
    minWidth: 110,
    background: '#F3F4F6',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    fontFamily: 'Inter, system-ui, sans-serif',
  }
  const navItem = (active = false): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: 12,
    color: active ? '#1D9E75' : '#6B7280',
    fontWeight: active ? 600 : 400,
    background: active ? '#ECFDF5' : 'transparent',
    borderLeft: active ? '3px solid #1D9E75' : '3px solid transparent',
    cursor: 'default',
  })
  const kpiCard = (color: string): React.CSSProperties => ({
    flex: 1,
    background: '#FFFFFF',
    border: '0.5px solid #E5E7EB',
    borderRadius: 10,
    padding: '14px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  })
  const rdvRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 0',
    borderBottom: '0.5px solid #F3F4F6',
    fontSize: 12,
    color: '#374151',
  }
  return (
    <div style={{ display: 'flex', height: '100%', background: '#FAFAFA', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={sidebar}>
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, background: '#1D9E75', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>MonGaragiste</span>
        </div>
        <div style={navItem(true)}>Dashboard</div>
        <div style={navItem()}>Agenda</div>
        <div style={navItem()}>Rendez-vous</div>
        <div style={navItem()}>Clients</div>
        <div style={{ height: 1, background: '#E5E7EB', margin: '10px 16px' }} />
        <div style={navItem()}>Stats</div>
        <div style={navItem()}>Rappels</div>
        <div style={navItem()}>Facturation</div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TopBar */}
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Lundi 2 juin 2025</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#1D9E75', fontWeight: 700 }}>MR</span>
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Bonjour Marc 👋</h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Voici votre journée</p>
          </div>
          {/* KPI */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            {[
              { label: 'RDV aujourd\'hui', val: '8', sub: '+2 vs hier', color: '#1D9E75' },
              { label: 'CA du mois', val: '3 280€', sub: 'Objectif 4 000€', color: '#3B82F6' },
              { label: 'Note moyenne', val: '4.9★', sub: '127 avis', color: '#F59E0B' },
              { label: 'En attente', val: '3', sub: 'Devis envoyés', color: '#8B5CF6' },
            ].map((k, i) => (
              <div key={i} style={kpiCard(k.color)}>
                <span style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{k.val}</span>
                <span style={{ fontSize: 10, color: k.color }}>{k.sub}</span>
              </div>
            ))}
          </div>
          {/* Programme */}
          <div style={{ background: '#fff', border: '0.5px solid #E5E7EB', borderRadius: 10, padding: '12px 16px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>Programme du jour</h3>
            {[
              { time: '09:00', name: 'Pierre Martin', service: 'Vidange + filtres', status: '#1D9E75' },
              { time: '10:45', name: 'Alice Bernard', service: 'Contrôle freins', status: '#F59E0B' },
              { time: '14:00', name: 'Jean Dupont', service: 'Révision complète', status: '#3B82F6' },
              { time: '16:30', name: 'Sophie Leroy', service: 'Diagnostic OBD', status: '#9CA3AF' },
            ].map((r, i) => (
              <div key={i} style={rdvRow}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', minWidth: 38 }}>{r.time}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.status, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{r.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Variante 2 — Dark Pro
// ─────────────────────────────────────────────────────────────────────────────
function DarkPro() {
  const navItem = (active = false): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: 12,
    color: active ? '#10B981' : '#94A3B8',
    fontWeight: active ? 600 : 400,
    background: active ? 'rgba(16,185,129,0.1)' : 'transparent',
    borderLeft: active ? '3px solid #10B981' : '3px solid transparent',
    cursor: 'default',
  })
  const rdvRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderBottom: '1px solid rgba(51,65,85,0.5)',
    fontSize: 12,
  }
  return (
    <div style={{ display: 'flex', height: '100%', background: '#0F172A', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 110, minWidth: 110, background: '#1E293B', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, background: '#10B981', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#F1F5F9' }}>MonGaragiste</span>
        </div>
        <div style={navItem(true)}>Dashboard</div>
        <div style={navItem()}>Agenda</div>
        <div style={navItem()}>Rendez-vous</div>
        <div style={navItem()}>Clients</div>
        <div style={{ height: 1, background: '#334155', margin: '10px 16px' }} />
        <div style={navItem()}>Stats</div>
        <div style={navItem()}>Rappels</div>
        <div style={navItem()}>Facturation</div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1E293B' }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Lundi 2 juin 2025</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: 11, color: '#10B981' }}>En ligne</span>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>MR</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Bonjour Marc 👋</h2>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>Lundi 2 juin — 4 créneaux restants</p>
          </div>
          {/* KPI */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'RDV aujourd\'hui', val: '8', trend: '↑ +2', color: '#10B981' },
              { label: 'CA du mois', val: '3 280€', trend: '↑ 82%', color: '#3B82F6' },
              { label: 'Note client', val: '4.9★', trend: '127 avis', color: '#F59E0B' },
              { label: 'En attente', val: '3', trend: 'Devis', color: '#8B5CF6' },
            ].map((k, i) => (
              <div key={i} style={{ flex: 1, background: '#1E293B', border: '1px solid #334155', borderRadius: 10, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.val}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{k.trend}</span>
              </div>
            ))}
          </div>
          {/* Programme */}
          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', margin: 0 }}>Programme du jour</h3>
              <span style={{ fontSize: 10, color: '#10B981', background: 'rgba(16,185,129,0.15)', padding: '3px 8px', borderRadius: 20 }}>8 RDV</span>
            </div>
            {[
              { time: '09:00', name: 'Pierre Martin', service: 'Vidange + filtres', dot: '#10B981' },
              { time: '10:45', name: 'Alice Bernard', service: 'Contrôle freins', dot: '#F59E0B' },
              { time: '14:00', name: 'Jean Dupont', service: 'Révision complète', dot: '#3B82F6' },
              { time: '16:30', name: 'Sophie Leroy', service: 'Diagnostic OBD', dot: '#475569' },
            ].map((r, i) => (
              <div key={i} style={rdvRow}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', minWidth: 38 }}>{r.time}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#E2E8F0' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>{r.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Variante 3 — Colorful Cards
// ─────────────────────────────────────────────────────────────────────────────
function ColorfulCards() {
  const navItem = (active = false): React.CSSProperties => ({
    padding: '9px 16px',
    fontSize: 12,
    color: active ? '#fff' : '#64748B',
    fontWeight: active ? 700 : 400,
    background: active ? '#1D9E75' : 'transparent',
    borderRadius: active ? '0 20px 20px 0' : 0,
    marginRight: active ? 10 : 0,
    cursor: 'default',
  })
  const gradients = [
    'linear-gradient(135deg, #059669, #34D399)',
    'linear-gradient(135deg, #2563EB, #60A5FA)',
    'linear-gradient(135deg, #D97706, #FBBF24)',
    'linear-gradient(135deg, #7C3AED, #A78BFA)',
  ]
  return (
    <div style={{ display: 'flex', height: '100%', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 110, minWidth: 110, background: '#fff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg, #1D9E75, #059669)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>MonGaragiste</span>
        </div>
        <div style={navItem(true)}>Dashboard</div>
        <div style={navItem()}>Agenda</div>
        <div style={navItem()}>Rendez-vous</div>
        <div style={navItem()}>Clients</div>
        <div style={{ height: 1, background: '#F1F5F9', margin: '10px 16px' }} />
        <div style={navItem()}>Stats</div>
        <div style={navItem()}>Rappels</div>
        <div style={navItem()}>Facturation</div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Bonjour Marc 👋</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Lundi 2 juin 2025</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ background: '#ECFDF5', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#1D9E75', fontWeight: 700 }}>+ Nouveau RDV</div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1D9E75, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>MR</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '18px 20px', flex: 1, overflowY: 'auto' }}>
          {/* KPI gradient cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'RDV aujourd\'hui', val: '8', sub: '+2 depuis hier', grad: gradients[0] },
              { label: 'CA du mois', val: '3 280€', sub: '82% objectif', grad: gradients[1] },
              { label: 'Note client', val: '4.9★', sub: '127 avis totaux', grad: gradients[2] },
              { label: 'Devis en attente', val: '3', sub: 'À valider', grad: gradients[3] },
            ].map((k, i) => (
              <div key={i} style={{ background: k.grad, borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{k.label}</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{k.val}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>{k.sub}</span>
              </div>
            ))}
          </div>
          {/* Programme */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>Programme du jour</h3>
            {[
              { time: '09:00', name: 'Pierre Martin', service: 'Vidange + filtres', tag: 'Confirmé', tagColor: '#ECFDF5', tagText: '#059669' },
              { time: '10:45', name: 'Alice Bernard', service: 'Contrôle freins', tag: 'En cours', tagColor: '#FEF3C7', tagText: '#D97706' },
              { time: '14:00', name: 'Jean Dupont', service: 'Révision complète', tag: 'Confirmé', tagColor: '#ECFDF5', tagText: '#059669' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div style={{ background: '#F1F5F9', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 700, color: '#475569', minWidth: 44, textAlign: 'center' }}>{r.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>{r.service}</div>
                </div>
                <div style={{ background: r.tagColor, borderRadius: 20, padding: '2px 8px', fontSize: 10, color: r.tagText, fontWeight: 600 }}>{r.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Variante 4 — Automotive Dark Green
// ─────────────────────────────────────────────────────────────────────────────
function AutomotiveDarkGreen() {
  const navItem = (active = false): React.CSSProperties => ({
    padding: '9px 16px',
    fontSize: 12,
    color: active ? '#1D9E75' : 'rgba(255,255,255,0.5)',
    fontWeight: active ? 700 : 400,
    background: active ? 'rgba(29,158,117,0.15)' : 'transparent',
    borderLeft: active ? '3px solid #1D9E75' : '3px solid transparent',
    cursor: 'default',
    letterSpacing: 0.2,
  })
  const glassCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
  }
  // Mini bar chart simulation
  const bars = [60, 85, 45, 90, 70, 55, 80]
  return (
    <div style={{ display: 'flex', height: '100%', background: '#0A1628', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 110, minWidth: 110, background: 'linear-gradient(180deg, #0D2818 0%, #0A1628 100%)', borderRight: '1px solid rgba(29,158,117,0.2)', display: 'flex', flexDirection: 'column', padding: '20px 0' }}>
        <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, background: '#1D9E75', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(29,158,117,0.5)' }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>MonGaragiste</span>
        </div>
        <div style={navItem(true)}>Dashboard</div>
        <div style={navItem()}>Agenda</div>
        <div style={navItem()}>Rendez-vous</div>
        <div style={navItem()}>Clients</div>
        <div style={{ height: 1, background: 'rgba(29,158,117,0.2)', margin: '10px 16px' }} />
        <div style={navItem()}>Stats</div>
        <div style={navItem()}>Rappels</div>
        <div style={navItem()}>Facturation</div>
        {/* Decorative dot */}
        <div style={{ marginTop: 'auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', boxShadow: '0 0 6px #1D9E75' }} />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Actif</span>
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(29,158,117,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Bonjour Marc 👋</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Lundi 2 juin 2025</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11, color: '#1D9E75', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 20, padding: '4px 12px' }}>
              ● Garage ouvert
            </div>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(29,158,117,0.2)', border: '1px solid #1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#1D9E75', fontWeight: 700 }}>MR</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
          {/* KPI cards glass */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'RDV', val: '8', sub: '+2', color: '#1D9E75' },
              { label: 'CA Mois', val: '3 280€', sub: '82%', color: '#3B82F6' },
              { label: 'Note', val: '4.9★', sub: '127 avis', color: '#F59E0B' },
              { label: 'Devis', val: '3', sub: 'En attente', color: '#8B5CF6' },
            ].map((k, i) => (
              <div key={i} style={{ ...glassCard, flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: k.color, textShadow: `0 0 12px ${k.color}60` }}>{k.val}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{k.sub}</span>
              </div>
            ))}
          </div>
          {/* Bar chart simulé */}
          <div style={{ ...glassCard, padding: '12px 16px', marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>RDV cette semaine</span>
              <span style={{ fontSize: 10, color: '#1D9E75' }}>42 cette semaine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 50 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', height: h * 0.48, background: i === 0 ? '#1D9E75' : 'rgba(29,158,117,0.35)', borderRadius: 3, boxShadow: i === 0 ? '0 0 8px rgba(29,158,117,0.6)' : 'none' }} />
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{['L','M','Me','J','V','S','D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Programme */}
          <div style={{ ...glassCard, padding: '12px 16px' }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>Programme du jour</h3>
            {[
              { time: '09:00', name: 'Pierre Martin', service: 'Vidange + filtres' },
              { time: '10:45', name: 'Alice Bernard', service: 'Contrôle freins' },
              { time: '14:00', name: 'Jean Dupont', service: 'Révision complète' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 6, padding: '3px 7px', fontSize: 10, color: '#1D9E75', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{r.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: '#fff' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{r.service}</div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', boxShadow: '0 0 6px #1D9E75' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Config des variantes
// ─────────────────────────────────────────────────────────────────────────────
const VARIANTS: { label: string; Component: () => JSX.Element }[] = [
  { label: 'Minimal Light — actuel', Component: MinimalLight },
  { label: 'Dark Pro — premium', Component: DarkPro },
  { label: 'Colorful Cards — dynamique', Component: ColorfulCards },
  { label: 'Automotive Dark — sport', Component: AutomotiveDarkGreen },
]

// ─────────────────────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────────────────────
export default function UIPreviewPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div style={{ background: '#111', minHeight: '100vh', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
        Choisissez votre interface
      </h1>
      <p style={{ color: '#888', marginBottom: 40, fontFamily: 'Inter, sans-serif', fontSize: 15 }}>
        Cliquez sur une interface pour la sélectionner
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
        {VARIANTS.map((v, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            style={{
              cursor: 'pointer',
              borderRadius: 16,
              overflow: 'hidden',
              border: selected === i ? '3px solid #1D9E75' : '3px solid transparent',
              transition: 'border-color 0.2s',
              boxShadow:
                selected === i
                  ? '0 0 0 4px rgba(29,158,117,0.3)'
                  : '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {/* Label */}
            <div
              style={{
                background: selected === i ? '#1D9E75' : '#1a1a1a',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.2s',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {v.label}
              </span>
              {selected === i && (
                <span style={{ color: '#fff', fontSize: 12 }}>✓ Sélectionné</span>
              )}
            </div>
            {/* Mockup avec scale */}
            <div style={{ height: 420, overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  transform: 'scale(0.75)',
                  transformOrigin: 'top left',
                  width: '133.33%',
                  height: '133.33%',
                  pointerEvents: 'none',
                }}
              >
                <v.Component />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p
            style={{
              color: '#1D9E75',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              marginBottom: 16,
            }}
          >
            ✓ Interface &ldquo;{VARIANTS[selected].label}&rdquo; sélectionnée
          </p>
          <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>
            Dites à Claude quelle interface vous voulez et il l&apos;intégrera dans l&apos;application.
          </p>
        </div>
      )}
    </div>
  )
}
