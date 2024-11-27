import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Moon, Sun, Volume2, BookOpen, Ban, Square, Triangle, CircleDot, ChevronUp, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const volumeLevels = {
  low: 0.0005,
  medium: 0.001,
  high: 0.002
};

const SilentiumRaum = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [soundType, setSoundType] = useState('none');
  const [waveform, setWaveform] = useState('sine');
  const [volume, setVolume] = useState(volumeLevels.low);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showArchivInfo, setShowArchivInfo] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [activeWaveforms, setActiveWaveforms] = useState(['sine', 'square', 'triangle', 'sawtooth']);

  const frequencies = [
    { freq: '432', name: 'Natural Freq', desc: 'Harmonizes with the natural vibration of the universe' },
    { freq: '528', name: 'Healing Freq', desc: 'Known for its regenerative properties' },
    { freq: '639', name: 'Heart Freq', desc: 'Promotes connection and harmony' }
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
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      setAudioContext(ctx);
      setGainNode(gain);
    }
  }, []);

  useEffect(() => {
    if (gainNode && audioContext) {
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  }, [volume, gainNode, audioContext]);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

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
    newGainNode.gain.value = volume;
    
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
        ? 'bg-[#FF79AB] text-white hover:bg-[#E66A97]' // Hier geändert
        : 'bg-[#FF79AB] text-white hover:bg-[#E66A97]' // Hier geändert
      : isDarkMode
        ? 'bg-slate-700 text-white hover:bg-slate-600'
        : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200';
  };

  return (
    <div className={`min-h-screen p-4 pb-20 relative ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>

{/* Wellenhintergrund */}
<svg className="fixed inset-0 w-full h-full z-0 opacity-5" viewBox="0 0 1440 400" preserveAspectRatio="none">
  <path 
    fill={isDarkMode ? 'rgb(226 232 240)' : 'rgb(71 85 105)'} 
    fillOpacity="1" 
    d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,154.7C672,160,768,128,864,112C960,96,1056,96,1152,106.7C1248,117,1344,139,1392,149.3L1440,160L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"
  >
  </path>
</svg>

      <Card className={`w-full max-w-2xl mx-auto mt-10 mb-16 relative z-10 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <CardHeader className="space-y-4">
          <CardTitle className="text-center text-4xl font-light">SILENTIUM</CardTitle>
          <div className="space-y-2">
            <p className="text-center text-xl font-light">Open Space of Silence, Peace and Inner Harmony</p>
            <p className="text-center text-md font-extralight opacity-85">A peaceful place for Meditation, Relaxation, Rest and Deep Grounding.</p>
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
              <div className="flex gap-2 flex-1 justify-center">
                <Button
                  onClick={() => {
                    setVolume(volumeLevels.low);
                    if (gainNode) {
                      gainNode.gain.setValueAtTime(volumeLevels.low, audioContext.currentTime);
                    }
                  }}
                  className={getButtonClass(volume === volumeLevels.low)}
                >
                  Low
                </Button>
                <Button
                  onClick={() => {
                    setVolume(volumeLevels.medium);
                    if (gainNode) {
                      gainNode.gain.setValueAtTime(volumeLevels.medium, audioContext.currentTime);
                    }
                  }}
                  className={getButtonClass(volume === volumeLevels.medium)}
                >
                  Medium
                </Button>
                <Button
                  onClick={() => {
                    setVolume(volumeLevels.high);
                    if (gainNode) {
                      gainNode.gain.setValueAtTime(volumeLevels.high, audioContext.currentTime);
                    }
                  }}
                  className={getButtonClass(volume === volumeLevels.high)}
                >
                  High
                </Button>
              </div>
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
                      <div className="text-sm font-light">{w.name}</div>
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
                <div className="text-sm font-light">No Frequency</div>
              </div>
            </Button>
            
            {frequencies.map((freq) => (
              <Button
                key={freq.freq}
                onClick={() => startFrequency(freq.freq)}
                className={getButtonClass(soundType === freq.freq)}
              >
                <div className="text-center">
                  <div className="font-light">{freq.freq}Hz</div>
                  <div className="text-sm font-light">{freq.name}</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center text-4xl font-light">
            {formatTime(timer)}
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setIsActive(!isActive)}
              className={`px-8 ${getButtonClass(isActive)}`}
            >
              <span className="font-light">{isActive ? 'Pause' : 'Start'}</span>
            </Button>
            <Button
              onClick={() => {
                setTimer(0);
                setIsActive(false);
              }}
              className={getButtonClass(false)}
            >
              <span className="font-light">Reset</span>
            </Button>
          </div>

          <div className="flex justify-center">
  <Button 
    onClick={() => setShowArchivInfo(!showArchivInfo)}
    className={`${getButtonClass(showArchivInfo)} px-8`}
  >
    <BookOpen className="mr-2 h-4 w-4" />
    <span className="font-light">Silentium Newsletter Archive</span>
  </Button>
</div>

          {showArchivInfo && (
            <div className="flex justify-center">
              <Alert className={`max-w-xl w-full ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                <AlertTitle className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-light text-center`}>
                  Silentium Newsletter Archive
                </AlertTitle>
                <AlertDescription className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} font-light text-center`}>
                  <p className="mt-2">The newsletter will be discontinued as of 01.01.2025. Secure now the complete collection of all 15 newsletters as a digital archive.</p>
                  <Button 
                    className={`w-full mt-4 ${getButtonClass(false)}`}
                    onClick={() => window.open('https://subscribepage.io/gPh3CX', '_blank')}
                  >
                    <span className="font-light">Purchase Newsletter Collection</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="text-center space-y-2 font-light">
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

  {/* Ko-fi Button */}
  <div className="flex justify-center w-full max-w-2xl mx-auto mb-8">
        <a 
          href="https://ko-fi.com/opensilentium" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`inline-flex items-center px-6 py-3 rounded-md ${
            isDarkMode 
              ? 'bg-[#FF79AB] text-white hover:bg-[#E66A97]' 
              : 'bg-[#FF79AB] text-white hover:bg-[#E66A97]'
          }`}
        >
          <span className="font-light">Support on Ko-fi</span>
        </a>
      </div>

      <footer className={`fixed bottom-0 left-0 right-0 p-4 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-2xl mx-auto text-center">
          <p className={`text-sm font-light ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Silentium is a brand by{' '}
            <a 
              href="https://www.quintessenz.biz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`inline-flex items-center ${isDarkMode ? 'text-[#FF79AB] hover:text-[#E66A97]' : 'text-[#FF79AB] hover:text-[#E66A97]'}`}
            >
              Quintessenz
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
          <p className={`text-xs mt-1 font-light ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            © {new Date().getFullYear()} Quintessenz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { SilentiumRaum as default };