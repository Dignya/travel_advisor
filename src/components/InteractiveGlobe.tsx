'use client'

import { Suspense, useRef, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Globe component with interactive features
function Globe({ destinations, onDestinationClick }: { 
  destinations: any[], 
  onDestinationClick: (destination: any) => void 
}) {
  const globeRef = useRef<THREE.Mesh>(null)
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null)
  
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

  // Memoize destination positions
  const destinationPositions = useMemo(() => {
    return destinations.map(destination => ({
      ...destination,
      position: latLngToVector3(destination.latitude, destination.longitude, 1.02)
    }))
  }, [destinations, latLngToVector3])
  
  // Optimize rotation with delta time
  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05 // Reduced rotation speed
    }
  })

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

      {/* Destination markers - optimized with memoized positions */}
      {destinationPositions.map((destination) => {
        const isHovered = hoveredDestination === destination.id
        
        return (
          <group key={destination.id} position={destination.position}>
            {/* Marker pin */}
            <mesh
              onPointerOver={() => setHoveredDestination(destination.id)}
              onPointerOut={() => setHoveredDestination(null)}
              onClick={() => onDestinationClick(destination)}
              scale={isHovered ? 1.5 : 1}
            >
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial 
                color={isHovered ? "#fbbf24" : "#ef4444"} 
                emissive={isHovered ? "#fbbf24" : "#ef4444"}
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Pulsing ring - only render when hovered */}
            {isHovered && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.03, 0.05, 16]} />
                <meshBasicMaterial 
                  color="#ef4444" 
                  transparent 
                  opacity={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Destination label (shown on hover) */}
            {isHovered && (
              <Text
                position={[0, 0.1, 0]}
                fontSize={0.05}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                rotation={[0, 0, 0]}
              >
                {destination.name}
              </Text>
            )}
          </group>
        )
      })}

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
function LoadingGlobe() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#1e40af" wireframe />
    </mesh>
  )
}

// Main Interactive Globe component
export default function InteractiveGlobe({ onDestinationSelect }: { 
  onDestinationSelect: (destination: any) => void 
}) {
  // Sample destinations with coordinates
  const destinations = [
    { id: '1', name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
    { id: '2', name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
    { id: '3', name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'USA' },
    { id: '4', name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'UK' },
    { id: '5', name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
    { id: '6', name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'UAE' },
    { id: '7', name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
    { id: '8', name: 'Barcelona', latitude: 41.3851, longitude: 2.1734, country: 'Spain' },
    { id: '9', name: 'Rome', latitude: 41.9028, longitude: 12.4964, country: 'Italy' },
    { id: '10', name: 'Bangkok', latitude: 13.7563, longitude: 100.5018, country: 'Thailand' },
  ]

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
        <Suspense fallback={<LoadingGlobe />}>
          <Globe 
            destinations={destinations} 
            onDestinationClick={onDestinationSelect}
          />
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
          Click and drag to rotate • Scroll to zoom • Click markers for details
        </p>
      </div>
    </motion.div>
  )
}