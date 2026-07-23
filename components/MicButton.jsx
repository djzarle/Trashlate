import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function MicButton({ onRecordingStart, onRecordingEnd, onAudioAvailable }) {
  const [isRecording, setIsRecording] = useState(false);

  // --- HARDWARE BYPASS ENGINE ---
  async function startRecording() {
    try {
      setIsRecording(true);
      if (onRecordingStart) onRecordingStart();
    } catch (err) {
      console.error('Failed to trigger mock stream:', err);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    if (onRecordingEnd) onRecordingEnd();

    try {
      // Feed a fake local file URI forward so the application thinks audio completed flawlessly
      if (onAudioAvailable) {
        onAudioAvailable("mock://local-audio-buffer-stream.wav");
      }
    } catch (err) {
      console.error('Failed to terminate mock stream:', err);
    }
  }

  return (
    <View style={styles.outerContainer}>
      {/* Pulse Outer Aura Ring */}
      <View style={[
        styles.pulseRing, 
        isRecording ? styles.pulseActive : styles.pulseInactive
      ]}>
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          style={({ pressed }) => [
            styles.circleButton,
            isRecording ? styles.buttonActive : styles.buttonInactive,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={[styles.microphoneIcon, isRecording ? styles.iconActive : styles.iconInactive]}>
            🎙️
          </Text>
        </Pressable>
      </View>

      {/* Interactive State Caption */}
      <Text style={[styles.captionText, isRecording ? styles.captionActive : styles.captionInactive]}>
        {isRecording ? 'Listening Live...' : 'Hold To Talk'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 48,
  },
  pulseRing: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  pulseInactive: {
    backgroundColor: 'transparent',
    padding: 16,
  },
  pulseActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500 10%
    padding: 32,
  },
  circleButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonInactive: {
    backgroundColor: '#18181b', // zinc-900
    borderColor: '#27272a', // zinc-800
  },
  buttonActive: {
    backgroundColor: '#ef4444', // red-500
    borderColor: '#f87171', // red-400
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  microphoneIcon: {
    fontSize: 36,
  },
  iconInactive: {
    color: '#a1a1aa',
  },
  iconActive: {
    color: '#ffffff',
  },
  captionText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  captionInactive: {
    color: '#71717a',
  },
  captionActive: {
    color: '#f87171',
    fontWeight: '700',
  },
});
