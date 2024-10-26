'use client'
import React, { useState } from 'react';
import { Camera, MapPin, Clock, Loader2, ArrowLeft, Plus, Minus } from 'lucide-react';
import styles from './MindbloomSplash.module.css';

const MindbloomSplash = ({ onComplete }) => {
  const [step, setStep] = useState('logo');
  const [analyzing, setAnalyzing] = useState(false);
  const [duration, setDuration] = useState(30);

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
    onComplete({ mood: 'Lazy', duration: duration });
  };

  const BackButton = ({ previousStep }) => (
    <button
      className={styles.backButton}
      onClick={() => setStep(previousStep)}
    >
      <ArrowLeft className={styles.backIcon} />
    </button>
  );

  const Logo = () => (
    <div className={styles.logoContainer}>
      <div className={styles.logoText}>
        Mindbloom
      </div>
      <div className={styles.logoCircle}>
        <div className={styles.innerCircle} />
        <div className={styles.pulseCircle} />
      </div>
      <button 
        onClick={() => setStep('camera')}
        className={styles.startButton}
      >
        Begin Your Journey
      </button>
    </div>
  );

  const CameraView = () => (
    <div className={styles.cameraContainer}>
      <BackButton previousStep="logo" />
      <div className={styles.cameraContent}>
        <div className={styles.cameraPreview}>
          <Camera size={64} className={styles.cameraIcon} />
        </div>
        <div className={styles.alert}>
          <h4 className={styles.alertTitle}>Ready for Your Moment</h4>
          <p className={styles.alertDescription}>
            Center your subject in the frame to capture the perfect shot
          </p>
        </div>
        <button 
          onClick={handlePhotoCapture}
          className={styles.captureButton}
        >
          Capture Moment
        </button>
      </div>
    </div>
  );

  const AnalysisView = () => (
    <div className={styles.analysisContainer}>
      <div className={styles.loaderWrapper}>
        <Loader2 className={styles.loader} />
        <div className={styles.loaderRing} />
      </div>
      <p className={styles.analysisText}>Processing your moment...</p>
    </div>
  );

  const DetailsForm = () => (
    <div className={styles.formContainer}>
      <BackButton previousStep="camera" />
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
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Clock className={styles.labelIcon} />
              <span>How much time do you have?</span>
            </label>
            <div className={styles.durationPicker}>
              <button
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
                onClick={() => adjustTime(15)}
                className={styles.durationButton}
              >
                <Plus />
              </button>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleComplete}
            className={styles.continueButton}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {step === 'logo' && <Logo />}
      {step === 'camera' && <CameraView />}
      {analyzing && <AnalysisView />}
      {step === 'details' && <DetailsForm />}
    </div>
  );
};

export default MindbloomSplash;