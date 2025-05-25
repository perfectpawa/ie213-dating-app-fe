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
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1
      },
      move: {
        enable: true,
        outModes: {
          default: "bounce"
        },
        random: true,
        speed: 1,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 40
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 3 }
      }
    },
    detectRetina: true
  };

  return (
    <Particles
      id={id}
      init={particlesInit}
      options={options || defaultOptions}
      className={className}
    />
  );
};

export default ParticlesBackground;