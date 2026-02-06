'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text, Environment } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';

function Footstep({ position, rotation, delay }: { position: [number, number, number], rotation: [number, number, number], delay: number }) {
    const ref = useRef<Group>(null);

    useFrame((state) => {
        if (ref.current) {
            // Simple gentle bobbing independent of Float for more variety
            ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.002;
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            floatingRange={[-0.2, 0.2]}
        >
            <group ref={ref} position={position} rotation={rotation}>
                {/* Abstract Footstep Shape - Using Text for simplicity without assets */}
                <Text
                    fontSize={1.5}
                    color="#A5A6F6" // Primary Light
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={0.4}
                >
                    👣
                </Text>
            </group>
        </Float>
    );
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#5D5FEF" />

                {/* Atmospheric Particles - matching brand colors */}
                <Sparkles
                    count={100}
                    scale={15}
                    size={4}
                    speed={0.4}
                    opacity={0.6}
                    color="#00C9A7" // Secondary
                />
                <Sparkles
                    count={80}
                    scale={20}
                    size={6}
                    speed={0.2}
                    opacity={0.4}
                    color="#5D5FEF" // Primary 
                />

                {/* Floating Footsteps Path */}
                <group>
                    <Footstep position={[-4, 2, -2]} rotation={[0, 0, 0.2]} delay={0} />
                    <Footstep position={[-2, -1, 0]} rotation={[0, 0, -0.1]} delay={1} />
                    <Footstep position={[3, 1, -1]} rotation={[0, 0, 0.1]} delay={2} />
                    <Footstep position={[5, -2, -3]} rotation={[0, 0, -0.2]} delay={3} />
                </group>

                {/* Subtle environment reflection for glass if we were using real glass materials */}
                {/* <Environment preset="city" /> */}
            </Canvas>
        </div>
    );
}
