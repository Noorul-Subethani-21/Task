import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ZONES = {
  red: {
    name: 'Upper Region',
    meshes: [
      'designzone_upper-region--1', 'designzone_upper-region--2', 'designzone_upper-region--3',
      'designzone_upper-region--4', 'designzone_upper-region--5', 'designzone_strap--1',
      'designzone_strap--2', 'designzone_strap--3', 'designzone_strap--4','Mesh', 'Mesh_1','Pattern2D_1907031_1', 'Pattern2D_1907031_2',
       'Pattern2D_1907031_2', 'Pattern2D_1907032_1', 'Pattern2D_1907032_2',' Pattern2D_1907032_3',
      'Stitch_1770981', 'Stitch_1770981_1', 'Stitch_1770981_2', 'Stitch_1770982',
      'Stitch_1770982_1', 'Stitch_1770982_2',
      'Stitch_1770983', 'Stitch_1770983_1', 'Stitch_1770983_2', 'Stitch_1770985',
      'designzone_upper-region--6', 'Body_Front_2_1', 'Body_Front_2_2', 'Body_Front_2_3',
      'designzone_upper-region--7', 'Body_Back_3_1', 'Body_Back_3_2', 'Body_Back_3_3',
      'designzone_upper-region--8', 'Sleeves_6_1', 'Sleeves_6_2', 'designzone_upper-region--9',
      'Pattern_577026_1', 'Pattern_577026_2', 'Pattern_577026_3',
      'Pattern_577027_1', 'Pattern_577027_2', 'Pattern_577027_3', 'designzone_upper-region--10',
      '甯界墖_1', '甯界墖_2', '甯界墖_3', '甯界墖_瀵圭О_3_1', '甯界墖_瀵圭О_3_2','甯界墖_瀵圭О_3_3',
      'Sleeves_9_1', 'Sleeves_9_2', 'Body_Front_2_1', 'Body_Front_2_2', 'Body_Front_2_3','Pattern2D_1907032_3','Mesh_1','Pattern2D_1907031_3'
    ],
    defaultColor: '#ff0000'
  },
  yellow: {
    name: 'Middle Region',
    meshes: [
      'designzone_middle-region--1', 'designzone_middle-region--2', 'designzone_middle-region--3',
      'Body_Front_4_1', 'Body_Front_4_2', 'Body_Front_4_3', 'Sleeves_4_1', 'Sleeves_4_2',
      'designzone_middle-region--4', 'Sleeves_5_1', 'Sleeves_5_2', 'Sleeves_5_3',
      'designzone_middle-region--5', 'Sleeves_7_1', 'Sleeves_7_2', 'designzone_middle-region--6',
      'Sleeves_8_1', 'Sleeves_8_2', 'Sleeves_8_3','Body_Back_4_1', 'Body_Back_4_2', 'Body_Back_4_3',
    ],
    defaultColor: '#ffff00'
  },
  green: {
    name: 'Lower Region',
    meshes: [
      'designzone_lower-region--1', 'designzone_lower-region--2', 'designzone_lower-region--3',
      'designzone_lower-region--4', 'Body_Front_3_1', 'Body_Front_3_2', 'Body_Back_2_1',
      'Body_Back_2_2', 'Pattern_1010407_1', 'Pattern_1010407_2', 'Pattern_1010408_1', 'Pattern_1010408_2','Pattern_1010408_3','Pattern_1010407_3'
    ],
    defaultColor: '#00ff00'
  }
};

const COLOR_PALETTE = [
  { name: 'Red', hex: '#ff0000' },
  { name: 'Blue', hex: '#0000ff' },
  { name: 'Yellow', hex: '#ffff00' },
  { name: 'Green', hex: '#00ff00' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Black', hex: '#000000' },
  { name: 'Orange', hex: '#ff8800' },
  { name: 'Purple', hex: '#8800ff' },
  { name: 'Pink', hex: '#ff00ff' },
];

function App() {
  const [colors, setColors] = useState({
    red: ZONES.red.defaultColor,
    yellow: ZONES.yellow.defaultColor,
    green: ZONES.green.defaultColor,
  });
  const [selectedZone, setSelectedZone] = useState('red');
  const [highlightZone, setHighlightZone] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleColorChange = (zone, color) => {
    setColors(prev => ({ ...prev, [zone]: color }));
    setHighlightZone(zone);
    setTimeout(() => setHighlightZone(null), 1000); 
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    width: '100vw',
    height: '100vh',
    background: '#f5f5f5',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden'
  };

  const sidebarStyle = {
    width: isMobile ? '100%' : '300px',
    minWidth: isMobile ? 'auto' : '250px',
    height: isMobile ? 'auto' : '100%',
    background: '#fff',
    boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '2px 0 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const mainStyle = {
    flex: 1,
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: isMobile ? '60vh' : '100%'
  };

  const colorPickerStyle = {
    position: 'absolute',
    bottom: isMobile ? '12px' : '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: isMobile ? '12px' : '20px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)',
    maxWidth: '90%'
  };

  const colorButtonStyleBase = {
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const resetButtonStyle = {
    position: 'absolute',
    top: isMobile ? '12px' : '24px',
    right: isMobile ? '12px' : '24px',
    padding: isMobile ? '8px 16px' : '12px 24px',
    background: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={containerStyle}>
      {/* Left Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e0e0e0' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#333' }}>Garment Designer</h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>Customize your design</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {Object.entries(ZONES).map(([zoneKey, zone]) => (
            <div
              key={zoneKey}
              style={{
                marginBottom: '16px',
                padding: '16px',
                background: selectedZone === zoneKey ? '#f0f7ff' : '#fafafa',
                borderRadius: '8px',
                border: `2px solid ${selectedZone === zoneKey ? '#2196F3' : '#e0e0e0'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setSelectedZone(zoneKey)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#333' }}>{zone.name}</h3>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: colors[zoneKey],
                    border: '2px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
              
            </div>
          ))}
        </div>
      </div>
      {/* Main Canvas Area */}
      <div style={mainStyle}>
        <Canvas camera={{ position: [5, 4, 8], fov: 50 }} style={{ background: 'transparent', width: '100%', height: '100%' }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
          <Model colors={colors} highlightZone={highlightZone} />
          <CustomOrbitControls />
        </Canvas>
        {/* Color Picker Panel */}
        <div style={colorPickerStyle}>
          <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: '#333', textAlign: 'center' }}>
            Editing: <span style={{ color: '#2196F3' }}>{ZONES[selectedZone].name}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorChange(selectedZone, color.hex)}
                style={{
                  ...colorButtonStyleBase,
                  background: color.hex,
                  border: colors[selectedZone] === color.hex ? '3px solid #2196F3' : '2px solid #ddd',
                  boxShadow: colors[selectedZone] === color.hex ? '0 4px 12px rgba(33, 150, 243, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)',
                  transform: colors[selectedZone] === color.hex ? 'scale(1.1)' : 'scale(1)',
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        {/* Reset Button */}
        <button
          onClick={() => setColors({
            red: ZONES.red.defaultColor,
            yellow: ZONES.yellow.defaultColor,
            green: ZONES.green.defaultColor,
          })}
          style={resetButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = '#f5f5f5';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#fff';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Reset Colors
        </button>
      </div>
    </div>
  );
}

function CustomOrbitControls() {
  const controlsRef = useRef();
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!controlsRef.current) return;
      
      const controls = controlsRef.current;
      const speed = 0.1;
      
      // Get current spherical coordinates
      const spherical = new THREE.Spherical();
      const offset = new THREE.Vector3();
      offset.copy(controls.object.position).sub(controls.target);
      spherical.setFromVector3(offset);
      
      switch (event.key) {
        case 'ArrowLeft':
          spherical.theta -= speed;
          break;
        case 'ArrowRight':
          spherical.theta += speed;
          break;
        case 'ArrowUp':
          spherical.phi = Math.max(0.1, spherical.phi - speed);
          break;
        case 'ArrowDown':
          spherical.phi = Math.min(Math.PI - 0.1, spherical.phi + speed);
          break;
        default:
          return;
      }
      
     
      offset.setFromSpherical(spherical);
      controls.object.position.copy(controls.target).add(offset);
      controls.update();
      
      event.preventDefault();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      autoRotate
      autoRotateSpeed={0.5}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
    />
  );
}

function Model({ colors, highlightZone }) {
  const [scene, setScene] = useState(null);
  const highlightRef = useRef({ timer: null, intensity: 0 });

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      '/Front End 3d file.glb',
      (gltf) => {
        setScene(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }, []);

  useEffect(() => {
    if (!scene) return;
    // Apply colors and handle highlighting
    scene.traverse((child) => {
      if (child.isMesh) {
        Object.entries(ZONES).forEach(([zoneKey, zone]) => {
          if (zone.meshes.includes(child.name)) {
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material.clone();
            }
            const mat = child.userData.originalMaterial.clone();
            mat.color = new THREE.Color(colors[zoneKey]);
            if (highlightZone === zoneKey) {
              mat.emissive = new THREE.Color(0xffffff);
              mat.emissiveIntensity = 0.5; // Initial highlight
            } else {
              mat.emissive = new THREE.Color(0x000000);
              mat.emissiveIntensity = 0;
            }
            child.material = mat;
            child.material.needsUpdate = true;
          }
        });
      }
    });
    // Fade out highlight
    if (highlightZone) {
      if (highlightRef.current.timer) clearInterval(highlightRef.current.timer);
      highlightRef.current.intensity = 0.5;
      highlightRef.current.timer = setInterval(() => {
        highlightRef.current.intensity -= 0.05;
        if (highlightRef.current.intensity <= 0) {
          clearInterval(highlightRef.current.timer);
          return;
        }
        scene.traverse((child) => {
          if (child.isMesh && ZONES[highlightZone].meshes.includes(child.name)) {
            child.material.emissiveIntensity = highlightRef.current.intensity;
            child.material.needsUpdate = true;
          }
        });
      }, 50);
    }
  }, [scene, colors, highlightZone]);

  useEffect(() => {
    if (!scene) return;
    // Center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  return scene ? <primitive object={scene} scale={1} /> : null;
}

export default App;