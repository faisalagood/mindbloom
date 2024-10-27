import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Loader2, ArrowLeft, Plus, Minus, Sparkles } from 'lucide-react';
import { CameraView } from './CameraView';
import styles from './MindbloomSplash.module.css';

const BackButton = ({ onBack }) => (
  <button className={styles.backButton} onClick={onBack}>
    <ArrowLeft className={styles.backIcon} />
  </button>
);

const Logo = ({ onStart }) => (
  <div className={styles.logoContainer}>
    <div className={styles.logoText}>Mindbloom</div>
    <div className={styles.logoCircle}>
      <div className={styles.innerCircle} />
      <div className={styles.pulseCircle} />
    </div>
    <button onClick={onStart} className={styles.startButton}>
      Begin Your Journey
    </button>
  </div>
);

const TypewriterText = ({ 
  messages, 
  onComplete,
  typeSpeed = 30,      // Faster typing
  deleteSpeed = 20,    // Faster deleting
  delayBetween = 500  // Shorter pause between messages
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const currentMessage = messages[currentMessageIndex];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentMessage.length) {
          setDisplayText(currentMessage.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayBetween);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentMessage.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          if (currentMessageIndex < messages.length - 1) {
            setCurrentMessageIndex(prev => prev + 1);
          } else {
            setIsComplete(true);
            onComplete();
          }
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentMessageIndex, messages, isComplete, onComplete, typeSpeed, deleteSpeed, delayBetween]);

  return (
    <div className={styles.typewriterText}>{displayText}</div>
  );
};

const AIAnalysis = ({ onAnalysisComplete }) => {
  const messages = [
    "Analyzing your responses...",
    "Oh, looks like you're taking a lazy day today! 🌟",
    "Checking the weather in London...",
    "Oh wow, it's actually raining today in London, totally unexpected! ☔",
    "Preparing your personalized mindfulness journey..."
  ];

  return (
    <div className={styles.aiAnalysisContainer}>
      <div className={styles.sparklesWrapper}>
        <Sparkles className={styles.sparklesIcon} />
        <div className={styles.sparklesRing} />
      </div>
      <TypewriterText 
        messages={messages} 
        onComplete={onAnalysisComplete}
        typeSpeed={30}     // Fast typing
        deleteSpeed={20}   // Fast deleting
        delayBetween={500} // Short pause between messages
      />
    </div>
  );
};

const DetailsForm = ({ location, setLocation, duration, adjustTime, onComplete, onBack }) => (
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
    setStep('details');
  };

  const adjustTime = (amount) => {
    setDuration(prev => {
      const newValue = prev + amount;
      return newValue >= 15 ? newValue : prev;
    });
  };

  const handleDetailsSubmit = () => {
    setAnalyzing(true);
    setStep('analysis');
  };

  const handleAnalysisComplete = () => {
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
      
      {step === 'details' && (
        <DetailsForm
          location={location}
          setLocation={setLocation}
          duration={duration}
          adjustTime={adjustTime}
          onComplete={handleDetailsSubmit}
          onBack={() => setStep('camera')}
        />
      )}

      {step === 'analysis' && (
        <AIAnalysis onAnalysisComplete={handleAnalysisComplete} />
      )}
    </div>
  );
}