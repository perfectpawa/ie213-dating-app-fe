import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import type { ISourceOptions } from "tsparticles-engine";

interface ParticlesBackgroundProps {
  options?: ISourceOptions;
  className?: string;
  id?: string;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  options,
  className = "absolute inset-0 z-0",
  id = "tsparticles"
}) => {
  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  const defaultOptions: ISourceOptions = {
    fpsLimit: 60,
    particles: {
      color: {
        value: "#4edcd8"
      },
      links: {
        color: "#4edcd8",
        distance: 120,
        enable: true,
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        outModes: {
          default: "bounce"
        },
        random: true,
        speed: 0.8,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 1000
        },
        value: 35
      },
      opacity: {
        value: 0.4
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 2.5 }
      }
    },
    detectRetina: true,
    interactivity: {
      events: {
        onClick: {
          enable: false
        },
        onHover: {
          enable: false
        }
      }
    }
  };
  return (
    <Particles
      id={id}
      init={particlesInit}
      options={options || defaultOptions}
      className={`${className} pointer-events-none`}
    />
  );
};

export default ParticlesBackground;