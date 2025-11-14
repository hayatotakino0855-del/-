import React, { useEffect, useState, useRef } from 'react';
import { Message } from '../../shared/models/Message';
import { TeleopSettings } from '../../shared/models/Settings';

const TeleopBar: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<TeleopSettings | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    loadMessages();
    loadSettings();

    const interval = setInterval(() => {
      loadMessages();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const allMessages = await window.electronAPI.getMessages();
      const activeMessages = allMessages.filter((m: Message) => m.enabled);
      setMessages(activeMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const teleopSettings = await window.electronAPI.getSettings();
      setSettings(teleopSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  useEffect(() => {
    if (!isPlaying || !settings) return;

    const animate = () => {
      setOffset((prev) => {
        const newOffset = prev - (settings.animation.speed / 60);
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          if (Math.abs(newOffset) > containerWidth) {
            return 0;
          }
        }
        return newOffset;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, settings]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  const messageText = messages.length > 0
    ? messages.map((m) => m.content).join(' '.repeat(Math.floor(settings.animation.gap / 10)))
    : 'No messages to display';

  const backgroundColor = `${settings.colors.background}${Math.floor(settings.colors.backgroundOpacity * 255).toString(16).padStart(2, '0')}`;

  return (
    <div
      style={{
        width: '100%',
        height: `${settings.display.height}px`,
        backgroundColor,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          whiteSpace: 'nowrap',
          transform: `translateX(${offset}px)`,
          fontFamily: settings.font.family,
          fontSize: `${settings.font.size}px`,
          fontWeight: settings.font.weight,
          color: settings.colors.text,
          paddingLeft: '100%',
        }}
      >
        {messageText}
      </div>
      <div
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          gap: '5px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={togglePlayPause}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => window.electronAPI.openSettings()}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          ⚙
        </button>
      </div>
    </div>
  );
};

export default TeleopBar;
