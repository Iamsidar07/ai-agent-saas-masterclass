'use client'

import React, { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AIAssistantAnimationProps {
  isActive?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const AIAssistantAnimation = ({
  isActive = true,
  className,
  size = 'md',
}: AIAssistantAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  // YouTube brand colors
  const youtubeRed = 'rgba(255, 0, 0, 0.8)' // YouTube red
  const secondaryColor = 'rgba(255, 255, 255, 0.8)' // White

  // Animate the sphere - slower animation
  useEffect(() => {
    if (!isActive) return

    let animationFrame: number
    let phase = 0
    
    const animate = () => {
      // Reduced speed (0.005 instead of 0.01)
      phase = (phase + 0.005) % 1
      setAnimationPhase(phase)
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isActive])

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center rounded-full p-4 overflow-hidden backdrop-blur-sm',
        sizeClasses[size],
        className
      )}
      style={{
        background: 'radial-gradient(circle at center, rgba(255, 0, 0, 0.8) 0%, rgba(180, 0, 0, 0.6) 40%, rgba(40, 0, 0, 0.8) 70%)',
        boxShadow: '0 0 25px 5px rgba(255, 0, 0, 0.4), inset 0 0 15px rgba(255, 0, 0, 0.3)'
      }}
    >
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(120, 0, 0, 0.6) 0%, rgba(80, 0, 0, 0.4) 50%, rgba(60, 0, 0, 0.6) 100%)',
          backdropFilter: 'blur(8px)',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(${animationPhase * 360}deg, rgba(255, 0, 0, 0.3) 0%, rgba(60, 0, 0, 0.3) 100%)`,
          opacity: 0.7,
          transform: `rotate(${animationPhase * 360}deg)`,
          transition: 'transform 0.5s ease-out',
        }}
      />
      
      {/* Sphere animation */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div 
          className="relative w-4/5 h-4/5 rounded-full"
          style={{
            background: `radial-gradient(circle, ${youtubeRed} 0%, rgba(80,0,0,0.2) 70%)`,
          }}
        >
          {/* Inner sphere */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${secondaryColor} 0%, rgba(180,0,0,0.05) 50%)`,
              opacity: 0.7,
              transform: `scale(${0.6 + Math.sin(animationPhase * Math.PI * 2) * 0.1})`,
              transition: 'transform 0.3s ease-in-out', // Slower transition
            }}
          />
          
          {/* Orbiting particles - fewer particles moving slower */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const offset = animationPhase * Math.PI * 2
            const x = Math.cos(angle + offset) * 45
            const y = Math.sin(angle + offset) * 45
            const size = 3 + Math.sin(angle + offset * 2) * 2
            
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `calc(50% + ${x}%)`,
                  top: `calc(50% + ${y}%)`,
                  transform: 'translate(-50%, -50%)',
                  background: i % 2 === 0 ? youtubeRed : secondaryColor,
                  boxShadow: `0 0 10px ${i % 2 === 0 ? youtubeRed : secondaryColor}`,
                  transition: 'all 0.3s ease-in-out', // Slower transition
                }}
              />
            )
          })}
          
          {/* Wave effect - slower expanding waves */}
          {Array.from({ length: 3 }).map((_, i) => {
            const delay = i * 0.4 // Increased delay
            const scale = isActive ? 
              0.4 + ((animationPhase + delay) % 1) * 0.6 : 
              0.4
            const opacity = isActive ? 
              1 - ((animationPhase + delay) % 1) * 0.8 : 
              0.2
            
            return (
              <div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${i % 2 === 0 ? youtubeRed : secondaryColor}`,
                  transform: `scale(${scale})`,
                  opacity: opacity,
                  transition: 'all 0.3s ease-out', // Slower transition
                }}
              />
            )
          })}
        </div>
      </div>
      
      {/* Red fading glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full z-20",
          isActive ? "animate-pulse" : ""
        )}
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.4) 0%, rgba(255,0,0,0.2) 40%, rgba(100,0,0,0.1) 70%)',
          animation: isActive ? 'pulse 3s infinite ease-in-out' : 'none', // Slower pulse animation
        }}
      />
      
      {/* Additional outer glow */}
      <div 
        className="absolute -inset-4 rounded-full z-0"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,0,0.5) 0%, rgba(180,0,0,0.2) 30%, rgba(40,0,0,0.1) 70%)',
          animation: isActive ? 'fadeInOut 4s infinite ease-in-out' : 'none',
          filter: 'blur(8px)',
          opacity: 0.6,
        }}
      />
      
      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export default AIAssistantAnimation













