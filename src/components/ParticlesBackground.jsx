import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // loads tsparticles-slim
// import { loadFull } from "tsparticles"; // loads tsparticles

export default function ParticlesBackground() {
    const particlesInit = useCallback(async engine => {
        // console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the slim version of tsParticles for better performance
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        // await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fpsLimit: 60,
                fullScreen: { enable: true, zIndex: -1 },
                background: {
                    color: {
                        value: "#000000",
                    },
                },
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                        },
                        onHover: {
                            enable: false,
                        },
                        resize: true,
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        enable: false, // OFF for performance
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "out",
                        },
                        random: false,
                        speed: 0.8, // Low speed
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 20, // Reduced from 35 for better performance
                    },
                    opacity: {
                        value: 0.2, // More subtle
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 2 },
                    },
                },
                detectRetina: false, // Disabled for performance
            }}
        />
    );
}
