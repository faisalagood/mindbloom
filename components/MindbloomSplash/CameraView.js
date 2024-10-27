'use client'
import { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import styles from './MindbloomSplash.module.css';

export function CameraView({ onCapture }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    async function setupCamera() {
      try {
        const constraints = {
          video: { 
            facingMode: 'user', // This prioritizes the front camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    setupCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.cameraContent}>
        <div className={styles.cameraPreview}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={styles.videoFeed}
          />
          <div className={styles.cameraOverlay}>
            <div className={styles.scanLine}></div>
          </div>
        </div>
        
        <div className={styles.alert}>
          <h4 className={styles.alertTitle}>Ready for Your Moment</h4>
          <p className={styles.alertDescription}>
            Center yourself in the frame for a quick mood scan
          </p>
        </div>
        
        <button 
          onClick={onCapture}
          className={styles.captureButton}
        >
          Scan Mood
        </button>
      </div>
    </div>
  );
}