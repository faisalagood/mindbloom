// components/MindbloomSplash/MindbloomSplash.js
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Loader2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CameraView } from './CameraView';
import styles from './MindbloomSplash.module.css';

const BackButton = ({ previousStep, onBack }) => (
  <button
    className={styles.backButton}
    onClick={onBack}
  >
    <ArrowLeft className={styles.backIcon} />
  </button>
);

const Logo = ({ onStart }) => (
  <div className={styles.logoContainer}>
    <div className={styles.logoText}>
      Mindbloom
    </div>
    <div className={styles.logoCircle}>
      <div className={styles.innerCircle} />
      <div className={styles.pulseCircle} />
    </div>
    <button 
      onClick={onStart}
      className={styles.startButton}
    >
      Begin Your Journey
    </button>
  </div>
);

const AnalysisView = () => (
  <div className={styles.analysisContainer}>
    <div className={styles.loaderWrapper}>
      <Loader2 className={styles.loader} />
      <div className={styles.loaderRing} />
    </div>
    <p className={styles.analysisText}>Analyzing your mood...</p>
  </div>
);

const DetailsForm = ({ 
  location, 
  setLocation, 
  duration, 
  adjustTime, 
  onComplete, 
  onBack 
}) => (
  <div className={styles.formContainer}>
    <BackButton onBack={onBack} />
    <div className={styles.formCard}>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <MapPin className={styles.labelIcon} />
            <span>Where are you?</span>
          </label>
          <input 
            type="text"
            placeholder="Enter your location" 
            className={styles.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Clock className={styles.labelIcon} />
            <span>How much time do you have?</span>
          </label>
          <div className={styles.durationPicker}>
            <button
              type="button"
              onClick={() => adjustTime(-15)}
              disabled={duration <= 15}
              className={styles.durationButton}
            >
              <Minus />
            </button>
            
            <div className={styles.durationDisplay}>
              <span className={styles.durationValue}>{duration}</span>
              <span className={styles.durationUnit}>minutes</span>
            </div>
            
            <button
              type="button"
              onClick={() => adjustTime(15)}
              className={styles.durationButton}
            >
              <Plus />
            </button>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={onComplete}
          className={styles.continueButton}
        >
          Begin Tasks
        </button>
      </form>
    </div>
  </div>
);

export default function MindbloomSplash({ onComplete }) {
  const router = useRouter();
  const [step, setStep] = useState('logo');
  const [analyzing, setAnalyzing] = useState(false);
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState('');

  const handlePhotoCapture = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep('details');
    }, 2000);
  };

  const adjustTime = (amount) => {
    setDuration(prev => {
      const newValue = prev + amount;
      return newValue >= 15 ? newValue : prev;
    });
  };

  const handleComplete = () => {
    onComplete({
      mood: 'Lazy',
      duration: duration,
      location: location || 'Highgate, London'
    });
  };

  return (
    <div className={styles.container}>
      {step === 'logo' && (
        <Logo onStart={() => setStep('camera')} />
      )}
      
      {step === 'camera' && (
        <>
          <BackButton onBack={() => setStep('logo')} />
          <CameraView onCapture={handlePhotoCapture} />
        </>
      )}
      
      {analyzing && <AnalysisView />}
      
      {step === 'details' && (
        <DetailsForm
          location={location}
          setLocation={setLocation}
          duration={duration}
          adjustTime={adjustTime}
          onComplete={handleComplete}
          onBack={() => setStep('camera')}
        />
      )}
    </div>
  );
}