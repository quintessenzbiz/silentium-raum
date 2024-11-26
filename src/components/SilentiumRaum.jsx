import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun, Volume2, VolumeX, BookOpen, Ban, Square, Triangle, CircleDot, ChevronUp, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Slider } from '../components/ui/slider';

const SilentiumRaum = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundType, setSoundType] = useState('none');
  const [waveform, setWaveform] = useState('sine');
  const [volume, setVolume] = useState(0.01);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showArchivInfo, setShowArchivInfo] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [activeWaveforms, setActiveWaveforms] = useState(['sine', 'square', 'triangle', 'sawtooth']);

  const frequencies = [
    { freq: '432', name: 'Natural Frequency', desc: 'Harmonizes with the natural vibration of the universe' },
    { freq: '528', name: 'Healing Frequency', desc: 'Known for its regenerative properties' },
    { freq: '639', name: 'Heart Frequency', desc: 'Promotes connection and harmony' }
  ];

  const waveforms = [
    { type: 'sine', name: 'Sine', icon: CircleDot },
    { type: 'square', name: 'Square', icon: Square },
    { type: 'triangle', name: 'Triangle', icon: Triangle },
    { type: 'sawtooth', name: 'Sawtooth', icon: ChevronUp }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      setAudioContext(ctx);
      setGainNode(gain);
    }
  }, []);

  useEffect(() => {
    if (gainNode && audioContext) {
      gainNode.gain.value = volume;
    }
  }, [volume, gainNode, audioContext]);

  useEffect(() => {
    if (!activeWaveforms.includes(waveform)) {
      if (oscillator) {
        oscillator.stop();
        setOscillator(null);
      }
      setSoundType('none');
    }
  }, [activeWaveforms]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleWaveform = (type) => {
    setActiveWaveforms(prev => {
      if (prev.includes(type)) {
        if (type === waveform) {
          const nextActive = prev.filter(w => w !== type)[0] || 'none';
          setWaveform(nextActive);
        }
        return prev.filter(w => w !== type);
      }
      return [...prev, type];
    });
  };

  const startFrequency = (frequency) => {
    if (oscillator) {
      oscillator.stop();
      setOscillator(null);
    }

    if (frequency === 'none' || !activeWaveforms.includes(waveform)) {
      setSoundType('none');
      return;
    }

    const newOscillator = audioContext.createOscillator();
    const newGainNode = audioContext.createGain();
    newGainNode.gain.value = volume; // Hier setzen wir die initiale Lautstärke
    
    newOscillator.type = waveform;
    newOscillator.frequency.setValueAtTime(parseFloat(frequency), audioContext.currentTime);
    
    newOscillator.connect(newGainNode);
    newGainNode.connect(audioContext.destination);
    newOscillator.start();
    
    setOscillator(newOscillator);
    setGainNode(newGainNode);
    setSoundType(frequency);
};

  const changeWaveform = (newWaveform) => {
    if (!activeWaveforms.includes(newWaveform)) return;
    setWaveform(newWaveform);
    if (soundType !== 'none') {
      startFrequency(soundType);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonClass = (isActive, isDisabled = false) => {
    if (isDisabled) {
      return isDarkMode 
        ? 'bg-slate-800 text-slate-500' 
        : 'bg-slate-100 text-slate-400';
    }
    return isActive 
      ? isDarkMode 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-blue-500 text-white hover:bg-blue-600'
      : isDarkMode
        ? 'bg-slate-700 text-white hover:bg-slate-600'
        : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200';
  };

  return (
    <div className={`min-h-screen p-4 pb-20 relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Card className={`w-full max-w-2xl mx-auto mt-10 mb-16 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <CardHeader className="space-y-4">
          <CardTitle className="text-center text-4xl font-bold">SILENTIUM</CardTitle>
          <div className="space-y-2">
            <p className="text-center text-xl font-medium">Open Space of Silence, Peace and Inner Harmony</p>
            <p className="text-center text-md opacity-85">A peaceful place for Meditation, Relaxation and Deep Grounding!</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={getButtonClass(false)}
            >
              {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 flex-shrink-0" />
              <Slider
  defaultValue={[1]}
  onValueChange={(value) => {
    const newVolume = value[0] / 500; // Teilen durch einen größeren Wert für feinere Kontrolle
    setVolume(newVolume);
    if (gainNode) {
      gainNode.gain.setValueAtTime(newVolume, audioContext.currentTime);
    }
  }}
  min={0}
  max={100}
  step={1}
  className="flex-1"
/>
              <span className="w-12 text-right">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {waveforms.map((w) => {
              const IconComponent = w.icon;
              const isActive = activeWaveforms.includes(w.type);
              return (
                <div key={w.type} className="flex flex-col space-y-2">
                  <Button
                    onClick={() => changeWaveform(w.type)}
                    className={getButtonClass(waveform === w.type, !isActive)}
                    disabled={!isActive}
                  >
                    <div className="text-center">
                      <IconComponent className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm">{w.name}</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => toggleWaveform(w.type)}
                    className={`h-8 text-xs ${getButtonClass(isActive)}`}
                  >
                    {isActive ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => startFrequency('none')}
              className={getButtonClass(soundType === 'none')}
            >
              <div className="text-center">
                <Ban className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm">No Frequency</div>
              </div>
            </Button>
            
            {frequencies.map((freq) => (
              <Button
                key={freq.freq}
                onClick={() => startFrequency(freq.freq)}
                className={getButtonClass(soundType === freq.freq)}
              >
                <div className="text-center">
                  <div className="font-bold">{freq.freq}Hz</div>
                  <div className="text-sm">{freq.name}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center text-4xl font-mono">
            {formatTime(timer)}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setIsActive(!isActive)}
              className={`px-8 ${getButtonClass(isActive)}`}
            >
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={() => {
                setTimer(0);
                setIsActive(false);
              }}
              className={getButtonClass(false)}
            >
              Reset
            </Button>
          </div>

          <Button 
            onClick={() => setShowArchivInfo(!showArchivInfo)}
            className={getButtonClass(showArchivInfo)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Silentium Newsletter Archive
          </Button>

          {showArchivInfo && (
            <Alert className={isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}>
              <AlertTitle className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                Silentium Newsletter Archive
              </AlertTitle>
              <AlertDescription className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                <p className="mt-2">The newsletter will be discontinued as of 01.01.2025. Secure now the complete collection of all 15 newsletters as a digital archive.</p>
                <Button 
                  className={`w-full mt-4 ${getButtonClass(false)}`}
                  onClick={() => window.open('https://subscribepage.io/gPh3CX', '_blank')}
                >
                  Purchase Newsletter Collection
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-2">
            <p>Current Frequency: {soundType === 'none' ? 'None' : `${soundType}Hz`}</p>
            <p>Waveform: {waveforms.find(w => w.type === waveform)?.name}</p>
            {soundType !== 'none' && (
              <p className="opacity-75">
                {frequencies.find(f => f.freq === soundType)?.desc}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <footer className={`fixed bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm">
            Silentium is a brand by{' '}
            <a 
              href="https://www.quintessenz.biz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Quintessenz
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            © {new Date().getFullYear()} Quintessenz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { SilentiumRaum as default };