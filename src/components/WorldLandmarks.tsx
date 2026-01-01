'use client'

import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useTripStore } from '@/store/trip-store'
import { cn } from '@/lib/utils'

// Landmark data with culturally diverse locations
const landmarks = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, India',
    latitude: 27.1751,
    longitude: 78.0421,
    type: 'temple',
    description: 'Iconic white marble mausoleum and symbol of eternal love',
    color: '#ff6b6b',
    icon: '🕌'
  },
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower',
    location: 'Paris, France',
    latitude: 48.8584,
    longitude: 2.2945,
    type: 'monument',
    description: 'Iron lattice tower and symbol of French engineering',
    color: '#74c0fc',
    icon: '🗼'
  },
  {
    id: 'statue-of-liberty',
    name: 'Statue of Liberty',
    location: 'New York, USA',
    latitude: 40.6892,
    longitude: -74.0445,
    type: 'monument',
    description: 'Symbol of freedom and democracy',
    color: '#51cf66',
    icon: '🗽'
  },
  {
    id: 'great-wall',
    name: 'Great Wall of China',
    location: 'Beijing, China',
    latitude: 40.4319,
    longitude: 116.5704,
    type: 'historical',
    description: 'Ancient fortification stretching across mountains',
    color: '#ffd43b',
    icon: '🏯'
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    location: 'Cusco, Peru',
    latitude: -13.1631,
    longitude: -72.5450,
    type: 'historical',
    description: 'Ancient Incan city in the Andes mountains',
    color: '#9775fa',
    icon: '🏔️'
  },
  {
    id: 'sydney-opera',
    name: 'Sydney Opera House',
    location: 'Sydney, Australia',
    latitude: -33.8568,
    longitude: 151.2153,
    type: 'modern',
    description: 'Architectural masterpiece and performing arts center',
    color: '#ff8787',
    icon: '🎭'
  },
  {
    id: 'pyramids',
    name: 'Pyramids of Giza',
    location: 'Cairo, Egypt',
    latitude: 29.9792,
    longitude: 31.1342,
    type: 'historical',
    description: 'Ancient wonders of the world',
    color: '#fcc419',
    icon: '🔺'
  },
  {
    id: 'christ-redeemer',
    name: 'Christ the Redeemer',
    location: 'Rio de Janeiro, Brazil',
    latitude: -22.9519,
    longitude: -43.2105,
    type: 'monument',
    description: 'Art Deco statue overlooking Rio',
    color: '#20c997',
    icon: '⛪'
  }
]

// Airplane component
function Airplane({ position, rotation }: { position: THREE.Vector3, rotation: number }) {
  const airplaneRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (airplaneRef.current) {
      // Add subtle floating animation
      airplaneRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.001
      airplaneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={airplaneRef} position={position} rotation={[0, rotation, 0]}>
      {/* Airplane body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.03]} />
        <meshPhongMaterial color="#ffffff" emissive="#4a90e2" emissiveIntensity={0.3} />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.005, 0.04]} />
        <meshPhongMaterial color="#e3f2fd" />
      </mesh>

      {/* Tail */}
      <mesh position={[-0.04, 0.01, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.015]} />
        <meshPhongMaterial color="#1976d2" />
      </mesh>

      {/* Propeller */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[0.005, 0.015, 0.002]} />
        <meshPhongMaterial color="#666666" />
      </mesh>
    </group>
  )
}

// Landmark component
function Landmark({
  landmark,
  position,
  isHighlighted,
  isSelected,
  isDimmed,
  score,
  onClick,
  onHover
}: {
  landmark: typeof landmarks[0],
  position: THREE.Vector3,
  isHighlighted: boolean,
  isSelected: boolean,
  isDimmed?: boolean,
  score?: number,
  onClick: () => void,
  onHover: (isHovered: boolean) => void
}) {
  const landmarkRef = useRef<THREE.Group>(null)

  // Calculate target scale based on state
  const targetScale = useMemo(() => {
    let base = 1
    if (score && score > 0.5) base = 1 + score // Grow up to 2x if high match
    if (isHighlighted) base *= 1.2
    return base
  }, [score, isHighlighted])

  useFrame((state) => {
    if (landmarkRef.current) {
      // Smoothly lerp to target scale
      landmarkRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

      // Pulsing animation only if high score or highlighted
      if (isHighlighted || (score && score > 0.7)) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15
        landmarkRef.current.scale.addScalar(pulse)
      }

      // Gentle rotation
      landmarkRef.current.rotation.y += 0.005
    }
  })

  // Determine colors based on score
  const displayColor = useMemo(() => {
    if (score && score > 0.8) return '#fbbf24' // Gold for top matches
    if (score && score > 0.5) return '#22d3ee' // Cyan for good matches
    return landmark.color
  }, [score, landmark.color])

  return (
    <group ref={landmarkRef} position={position}>
      {/* Landmark base */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onHover(false)
        }}
        onClick={onClick}
      >
        <cylinderGeometry args={[0.03, 0.04, 0.1, 6]} />
        <meshPhongMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={isHighlighted || (score && score > 0.6) ? 0.5 : 0.1}
          transparent
          opacity={isDimmed ? 0.2 : 1}
        />
      </mesh>

      {/* Landmark icon */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshPhongMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={0.4}
          transparent
          opacity={isDimmed ? 0.2 : 1}
        />
      </mesh>

      {/* Score Ring */}
      {score && score > 0.5 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.09 + (score * 0.02), 32]} />
          <meshBasicMaterial color={displayColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.08, 16]} />
          <meshBasicMaterial
            color={displayColor}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Landmark label */}
      {(isHighlighted || isSelected || (score && score > 0.6)) && !isDimmed && (
        <Text
          position={[0, 0.15 + (score ? 0.05 : 0), 0]}
          fontSize={0.04 + (score ? score * 0.02 : 0)}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, 0]}
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {landmark.icon} {landmark.name}
          {score && score > 0 && ` (${Math.round(score * 100)}%)`}
        </Text>
      )}
    </group>
  )
}

// Main WorldLandmarks component
function WorldLandmarksScene({ onLandmarkSelect }: { onLandmarkSelect: (landmark: typeof landmarks[0]) => void }) {
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null)
  const [highlightedLandmark, setHighlightedLandmark] = useState<string | null>(null)
  const [airplanePosition, setAirplanePosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0.15, 0))
  const [airplaneRotation, setAirplaneRotation] = useState(0)
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0)

  const globeRef = useRef<THREE.Mesh>(null)

  // Connect to Trip Store
  const { recommendations, userQuery } = useTripStore()

  // Calculate scores for landmarks based on AI recommendations
  const landmarkScores = useMemo(() => {
    const scores: Record<string, number> = {}

    // 1. Try to match API recommendations to our visual landmarks
    if (recommendations.length > 0) {
      landmarks.forEach(lm => {
        const lmName = lm.name.toLowerCase()
        const lmLoc = lm.location.toLowerCase()

        // Find best matching recommendation
        const match = recommendations.find(rec => {
          const recName = rec.name?.toLowerCase() || ''
          const recCity = rec.city?.toLowerCase() || ''
          const recCountry = rec.country?.toLowerCase() || ''

          // Match if landmark name contains rec name (e.g. "Taj Mahal" contains "Agra"? No. "Agra" contains "Agra"? Yes)
          // Or rec name contains landmark name
          // Or location matches
          return lmName.includes(recName) ||
            recName.includes(lmName) ||
            lmLoc.includes(recName) ||
            lmLoc.includes(recCity) ||
            (recCity && lmLoc.includes(recCity))
        })

        if (match) {
          scores[lm.id] = match.score || 0.9 // Use API score or high default
        }
      })
    }

    // 2. Fallback: Client-side keyword matching if no API matches found yet (or to augment)
    // Only run if we didn't find specific matches, or to enhance simple queries
    if (Object.keys(scores).length === 0 && userQuery) {
      landmarks.forEach(lm => {
        let localScore = 0
        const query = userQuery.toLowerCase()
        if (query) {
          const lowerName = lm.name.toLowerCase()
          const lowerLoc = lm.location.toLowerCase()
          const lowerDesc = lm.description.toLowerCase()
          const lowerType = lm.type.toLowerCase()

          if (query.includes(lowerName)) localScore += 0.8
          else if (query.includes(lowerLoc) || lowerLoc.includes(query)) localScore += 0.5

          if (query.includes('history') && lowerType === 'historical') localScore += 0.3
          if (query.includes('modern') && lowerType === 'modern') localScore += 0.3
          if (query.includes('monument') && lowerType === 'monument') localScore += 0.3
          if (query.includes('temple') && lowerType === 'temple') localScore += 0.3

          if (query.includes('mountain') && lowerDesc.includes('mountain')) localScore += 0.3
          if (query.includes('water') || query.includes('sea')) {
            if (lm.id === 'sydney-opera' || lm.id === 'statue-of-liberty') localScore += 0.3
          }
        }

        if (localScore > 0) {
          // Keep existing score if it's higher
          scores[lm.id] = Math.max(scores[lm.id] || 0, Math.min(localScore, 1))
        }
      })
    }
    return scores
  }, [recommendations, userQuery])

  // Memoize the lat/lng conversion function
  const latLngToVector3 = useCallback((lat: number, lng: number, radius: number = 1) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    )
  }, [])

  // Memoize landmark positions
  const landmarkPositions = useMemo(() => {
    return landmarks.map(landmark => ({
      ...landmark,
      position: latLngToVector3(landmark.latitude, landmark.longitude, 1.05)
    }))
  }, [landmarks, latLngToVector3])

  // Memoize flight path positions
  const flightPaths = useMemo(() => {
    return landmarks.map((landmark, index) => {
      const nextLandmark = landmarks[(index + 1) % landmarks.length]
      const start = latLngToVector3(landmark.latitude, landmark.longitude, 1.05)
      const end = latLngToVector3(nextLandmark.latitude, nextLandmark.longitude, 1.05)
      return { start, end }
    })
  }, [landmarks, latLngToVector3])

  // Optimize rotation with delta time
  useFrame((state, delta) => {
    if (globeRef.current) {
      // Auto-rotate towards best match if exists
      const bestMatchId = Object.keys(landmarkScores).reduce((a, b) => landmarkScores[a] > landmarkScores[b] ? a : b, '')
      if (bestMatchId) {
        const best = landmarks.find(l => l.id === bestMatchId)
        // Simple rotation nudge, proper geo-rotation is complex
        // Just rotate faster if found? Or slow down?
        // Let's slow down to let user see it
        globeRef.current.rotation.y += delta * 0.01
      } else {
        globeRef.current.rotation.y += delta * 0.025
      }
    }

    // Move airplane between landmarks
    const currentLandmark = landmarks[currentTargetIndex]
    const nextLandmark = landmarks[(currentTargetIndex + 1) % landmarks.length]

    const currentPos = latLngToVector3(currentLandmark.latitude, currentLandmark.longitude, 1.1)
    const nextPos = latLngToVector3(nextLandmark.latitude, nextLandmark.longitude, 1.1)

    // Interpolate position
    const t = (state.clock.elapsedTime % 10) / 10
    const interpolatedPos = currentPos.clone().lerp(nextPos, t)

    setAirplanePosition(interpolatedPos)

    // Calculate rotation to face direction of travel
    const direction = nextPos.clone().sub(currentPos).normalize()
    setAirplaneRotation(Math.atan2(direction.x, direction.z))
  })

  const handleLandmarkClick = (landmark: typeof landmarks[0]) => {
    setSelectedLandmark(landmark.id === selectedLandmark ? null : landmark.id)
    if (landmark.id !== selectedLandmark) {
      onLandmarkSelect(landmark)
    }
  }

  // Determine if we should dim non-matches
  const hasActiveQuery = Object.keys(landmarkScores).length > 0

  return (
    <group>
      {/* Globe sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhongMaterial
          color="#1e40af"
          emissive="#0f172a"
          shininess={10}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Globe wireframe */}
      <mesh>
        <sphereGeometry args={[1.01, 24, 24]} />
        <meshBasicMaterial
          color="#60a5fa"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Flight path lines - optimized with memoized positions */}
      {flightPaths.map((path, index) => (
        <line key={`path-${index}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([
                path.start.x, path.start.y, path.start.z,
                path.end.x, path.end.y, path.end.z
              ]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.3}
            linewidth={1}
          />
        </line>
      ))}

      {/* Landmarks - optimized with memoized positions */}
      {landmarkPositions.map((landmark) => {
        const isHighlighted = highlightedLandmark === landmark.id
        const isSelected = selectedLandmark === landmark.id
        const score = landmarkScores[landmark.id]
        // Dim if we have an active query but this landmark has no score
        const isDimmed = hasActiveQuery && !score

        return (
          <Landmark
            key={landmark.id}
            landmark={landmark}
            position={landmark.position}
            isHighlighted={isHighlighted}
            isSelected={isSelected}
            isDimmed={isDimmed}
            score={score}
            onClick={() => handleLandmarkClick(landmark)}
            onHover={(isHovered) => {
              setHighlightedLandmark(isHovered ? landmark.id : null)
            }}
          />
        )
      })}

      {/* Airplane */}
      <Airplane position={airplanePosition} rotation={airplaneRotation} />

      {/* Ambient light */}
      <ambientLight intensity={0.4} />

      {/* Directional light */}
      <directionalLight
        position={[5, 3, 5]}
        intensity={1}
        castShadow
      />
    </group>
  )
}

// Loading component
function LoadingWorld() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#1e40af" wireframe />
    </mesh>
  )
}

// Main WorldLandmarks component
export default function WorldLandmarks({ onLandmarkSelect }: {
  onLandmarkSelect: (landmark: typeof landmarks[0]) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full relative"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' }}
      >
        <Suspense fallback={<LoadingWorld />}>
          <WorldLandmarksScene onLandmarkSelect={onLandmarkSelect} />
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={2}
            maxDistance={5}
            autoRotate={false}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-white/70 text-sm">
          Click and drag to rotate • Scroll to zoom • Click landmarks for details
        </p>
      </div>
    </motion.div>
  )
}