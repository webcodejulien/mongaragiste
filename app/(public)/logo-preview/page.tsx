'use client'

import { useState } from 'react'

// ─── Option 1 — Clé à molette ────────────────────────────────────────────────
function WrenchIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="10" fill="#1D9E75" />
      {/* Corps principal de la clé, orienté à 45° */}
      <path
        d="M30 7 C33 7 37 11 37 15 C37 17.5 35.8 19.8 33.5 21 L22 32.5 C21 33.5 19.5 33.5 18.5 32.5 L15.5 29.5 C14.5 28.5 14.5 27 15.5 26 L27 14.5 C28.2 12.2 30 7 30 7Z"
        fill="white"
      />
      {/* Tête ronde de la clé */}
      <circle cx="30.5" cy="13.5" r="4.5" fill="#1D9E75" />
      {/* Extrémité manche */}
      <path
        d="M17 30 L12 35 C11 36 11 37.5 12 38.5 C13 39.5 14.5 39.5 15.5 38.5 L20.5 33.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ─── Option 2 — Hexagone boulon ──────────────────────────────────────────────
function HexBoltIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="10" fill="#1D9E75" />
      {/* Hexagone fond */}
      <polygon
        points="22,5 35.5,12.5 35.5,27.5 22,35 8.5,27.5 8.5,12.5"
        fill="white"
        opacity="0.15"
      />
      {/* Hexagone contour */}
      <polygon
        points="22,7 33.5,13.5 33.5,26.5 22,33 10.5,26.5 10.5,13.5"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      {/* Centre — tête de boulon : cercle central + 6 points */}
      <circle cx="22" cy="20" r="4" fill="white" />
      <circle cx="22" cy="11.5" r="2" fill="white" />
      <circle cx="22" cy="28.5" r="2" fill="white" />
      <circle cx="29.5" cy="15.5" r="2" fill="white" />
      <circle cx="29.5" cy="24.5" r="2" fill="white" />
      <circle cx="14.5" cy="15.5" r="2" fill="white" />
      <circle cx="14.5" cy="24.5" r="2" fill="white" />
    </svg>
  )
}

// ─── Option 3 — Bouclier + M pistons ─────────────────────────────────────────
function ShieldIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="10" fill="#1D9E75" />
      {/* Bouclier fond semi-transparent */}
      <path
        d="M22 6 L35 11.5 L35 24 C35 30.5 29 37 22 39 C15 37 9 30.5 9 24 L9 11.5 Z"
        fill="white"
        opacity="0.2"
      />
      {/* Bouclier contour */}
      <path
        d="M22 8 L33 13 L33 24 C33 29.5 27.5 35 22 37 C16.5 35 11 29.5 11 24 L11 13 Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      {/* M avec jambages pointus vers le bas (pistons) */}
      <path
        d="M14 29 L14 18 L22 26 L30 18 L30 29"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

// ─── Option 4 — Route + épingle ──────────────────────────────────────────────
function MapPinIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="10" fill="#1D9E75" />
      {/* Épingle de localisation */}
      <path
        d="M22 7 C16.5 7 12 11.5 12 17 C12 24.5 22 36 22 36 C22 36 32 24.5 32 17 C32 11.5 27.5 7 22 7Z"
        fill="white"
      />
      {/* Trou central de l'épingle */}
      <circle cx="22" cy="17" r="4.5" fill="#1D9E75" />
      {/* Route stylisée en bas */}
      <rect x="11" y="38" width="22" height="2.5" rx="1.25" fill="white" opacity="0.4" />
      {/* Tiret central de la route */}
      <rect x="20.5" y="38" width="3" height="2.5" rx="1.25" fill="#1D9E75" />
    </svg>
  )
}

// ─── Option 5 — Engrenage partiel (fond sombre) ───────────────────────────────
function GearIcon({ size, dark }: { size: number; dark?: boolean }) {
  const bg = dark ? '#1D9E75' : '#111827'
  const gear = dark ? 'white' : '#1D9E75'
  const centerFill = dark ? '#1D9E75' : '#111827'
  const innerGear = dark ? 'white' : '#1D9E75'

  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect width="44" height="44" rx="10" fill={bg} />
      {/* Demi-engrenage visible (sortant du cadre à droite) */}
      <path
        d="M44 14 L40 14 L40 10 L36 8 L36 4 L32 4 L30 0 L26 0 L24 4 L20 4 L18 8 L14 10 L14 14 L10 14 L10 18 L6 20 L10 22 L10 26 L14 26 L16 30 L20 30 L22 34 L26 34 L28 30 L32 30 L34 26 L38 26 L40 22 L44 20 Z"
        fill={gear}
        opacity="0.9"
      />
      {/* Centre de l'engrenage */}
      <circle cx="27" cy="20" r="7" fill={centerFill} />
      <circle cx="27" cy="20" r="4" fill={innerGear} opacity="0.55" />
    </svg>
  )
}

// ─── Données des 5 variantes ──────────────────────────────────────────────────
const LOGOS = [
  {
    name: 'Clé à molette',
    description: 'Classique, reconnaissable',
    icon: (s: number) => <WrenchIcon size={s} />,
  },
  {
    name: 'Boulon hex',
    description: 'Industriel, technique',
    icon: (s: number) => <HexBoltIcon size={s} />,
  },
  {
    name: 'Bouclier M',
    description: 'Confiance, expertise',
    icon: (s: number) => <ShieldIcon size={s} />,
  },
  {
    name: 'Route & pin',
    description: 'Géo, proximité',
    icon: (s: number) => <MapPinIcon size={s} />,
  },
  {
    name: 'Engrenage',
    description: 'Premium, tech',
    icon: (s: number) => <GearIcon size={s} />,
    iconDark: (s: number) => <GearIcon size={s} dark />,
  },
] as const

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LogoPreviewPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div
      style={{
        background: '#f5f5f5',
        minHeight: '100vh',
        padding: '40px 32px',
        boxSizing: 'border-box',
      }}
    >
      {/* En-tête */}
      <h1
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 8,
          color: '#111',
          margin: '0 0 8px',
        }}
      >
        Choisissez votre logo MonGaragiste
      </h1>
      <p
        style={{
          color: '#666',
          marginBottom: 48,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 15,
          margin: '0 0 48px',
        }}
      >
        Cliquez sur un logo pour le sélectionner
      </p>

      {/* Grille sur fond clair */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 24,
          marginBottom: 60,
        }}
      >
        {LOGOS.map((logo, i) => {
          const isSelected = selected === i
          return (
            <div
              key={i}
              onClick={() => setSelected(i === selected ? null : i)}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 32,
                border: `2px solid ${isSelected ? '#1D9E75' : '#e5e5e5'}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: isSelected
                  ? '0 0 0 4px rgba(29,158,117,0.15)'
                  : '0 1px 4px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              {/* Badge "Sélectionné" */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#1D9E75',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    padding: '2px 7px',
                    borderRadius: 20,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  ✓ Sélectionné
                </div>
              )}

              {/* Logo grand format */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                {logo.icon(64)}
              </div>

              {/* Numéro + nom de la variante */}
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                  margin: '0 0 4px',
                }}
              >
                Option {i + 1}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#333',
                  margin: '0 0 2px',
                }}
              >
                {logo.name}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 12,
                  color: '#999',
                  margin: '0 0 16px',
                }}
              >
                {logo.description}
              </p>

              {/* Logo + texte (rendu app) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  background: '#f9f9f9',
                  borderRadius: 10,
                }}
              >
                {logo.icon(26)}
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15 }}>
                  <span style={{ fontWeight: 300 }}>Mon</span>
                  <span style={{ fontWeight: 700 }}>Garagiste</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Section fonds sombres */}
      <h2
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 24,
          color: '#111',
          margin: '0 0 24px',
        }}
      >
        Sur fonds sombres
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 24,
          marginBottom: 60,
        }}
      >
        {LOGOS.map((logo, i) => (
          <div
            key={i}
            style={{
              background: '#111827',
              borderRadius: 16,
              padding: 28,
              textAlign: 'center',
              border: selected === i ? '2px solid #1D9E75' : '2px solid transparent',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {'iconDark' in logo && logo.iconDark
                ? logo.iconDark(26)
                : logo.icon(26)}
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 15,
                  color: '#fff',
                }}
              >
                <span style={{ fontWeight: 300 }}>Mon</span>
                <span style={{ fontWeight: 700 }}>Garagiste</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Section tailles */}
      <h2
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 20,
          fontWeight: 700,
          color: '#111',
          margin: '0 0 24px',
        }}
      >
        Tailles (option {selected !== null ? selected + 1 : '—'})
      </h2>
      {selected !== null ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          {[16, 24, 32, 48, 64, 96].map((s) => (
            <div
              key={s}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {LOGOS[selected].icon(s)}
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 11,
                  color: '#aaa',
                }}
              >
                {s}px
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14,
            color: '#aaa',
          }}
        >
          Sélectionnez une option ci-dessus pour voir les tailles.
        </p>
      )}
    </div>
  )
}
