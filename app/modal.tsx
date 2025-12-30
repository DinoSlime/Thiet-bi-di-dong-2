import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let soundObject: Audio.Sound | null = null;

    async function startMusic() {
      try {
        const { sound } = await Audio.Sound.createAsync(Number(params.uri), {
          shouldPlay: true,
        });

        soundObject = sound;
        setSound(sound);
        setIsPlaying(true);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      } catch (error) {
        console.log("Lỗi tải nhạc:", error);
      }
    }

    startMusic();

    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  async function togglePlay() {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }

  async function seekAudio(amount: number) {
    if (!sound) return;
    const newPosition = position + amount * 1000;
    await sound.setPositionAsync(newPosition);
  }

  async function onSliderValueChange(value: number) {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  }

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
        <Ionicons name="chevron-down" size={32} color="#fff" />
      </TouchableOpacity>

      <View style={styles.artworkWrapper}>
        <Image source={Number(params.image)} style={styles.artwork} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{params.title}</Text>
        <Text style={styles.artist}>{params.artist}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={onSliderValueChange}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#555"
          thumbTintColor="#1DB954"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => seekAudio(-10)}>
          <Ionicons name="play-back" size={35} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={40}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => seekAudio(10)}>
          <Ionicons name="play-forward" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  artworkWrapper: {
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  artwork: { width: 300, height: 300, borderRadius: 10 },
  info: { marginTop: 30, alignItems: "center" },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  artist: { color: "#ccc", fontSize: 18, marginTop: 5 },
  progressContainer: { width: "100%", marginTop: 40 },
  timeContainer: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { color: "#ccc" },

  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 20,
  },
  playBtn: {
    backgroundColor: "#1DB954",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
