import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function App() {
  const [color, setColor] = useState('#ff0000')

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [5, 4, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model color={color} />
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>

      
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          background: 'rgba(0,0,0,0.6)',
          padding: '20px',
          borderRadius: '12px',
        }}
      >
        {['#ff0000', '#0000ff', '#00ff00', '#ffff00'].map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{
              width: '50px',
              height: '50px',
              background: c,
              borderRadius: '10px',
              border: '2px solid white',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Model({ color }) {
  const { scene } = useGLTF('/Front End 3d file.glb');

  useEffect(() => {
    if (!scene) return;

    console.log('Mesh List:');
    scene.traverse((child) => {
      if (child.isMesh) console.log(child.name);
    });

   
    const targetMeshes = ['body', 'Body_01', 'frame', 'main'];

    scene.traverse((child) => {
      if (child.isMesh) {
        const isBody = targetMeshes.some((name) =>
          child.name.toLowerCase().includes(name.toLowerCase())
        );

        if (isBody) {
          child.material = child.material.clone();
          child.material.color = new THREE.Color(color);
        }
      }
    });
  }, [scene, color]);

  
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  scene.position.sub(center);

  return <primitive object={scene} scale={1} />;
}

export default App;
