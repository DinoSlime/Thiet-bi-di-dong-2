import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMusic } from "../context/MusicContext";

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    playNext,
    playPrevious,
  } = useMusic();
  const router = useRouter();
  if (!currentSong) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => router.push("/modal")}
    >
      <Image source={{ uri: currentSong.image }} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {currentSong.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentSong.artist}
        </Text>
      </View>

      <View style={styles.controlsWrapper}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playPrevious();
          }}
          style={styles.controlButton}
        >
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            isPlaying ? pauseSong() : resumeSong();
          }}
          style={styles.controlButton}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playNext();
          }}
          style={styles.controlButton}
        >
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: "#282828",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    height: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#1DB954",
  },
  image: { width: 48, height: 48, borderRadius: 4, marginRight: 10 },
  textContainer: { flex: 1, justifyContent: "center", paddingRight: 5 },
  title: { color: "white", fontSize: 14, fontWeight: "bold" },
  artist: { color: "#B3B3B3", fontSize: 12 },
  controlsWrapper: { flexDirection: "row", alignItems: "center", gap: 5 },
  controlButton: { padding: 5 },
});
