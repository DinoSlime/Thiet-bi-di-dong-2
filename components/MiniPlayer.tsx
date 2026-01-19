import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMusic } from "../context/MusicContext";

export default function MiniPlayer() {
  const { currentSong, isPlaying, pauseSong, resumeSong } = useMusic();
  const router = useRouter();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => {
        console.log("Mở Full Player");
      }}
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
      <TouchableOpacity
        onPress={() => (isPlaying ? pauseSong() : resumeSong())}
        style={styles.playButton}
      >
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50, 
    left: 10,
    right: 10,
    backgroundColor: "#282828",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#1DB954",
  },
  image: { width: 44, height: 44, borderRadius: 4, marginRight: 10 },
  textContainer: { flex: 1, justifyContent: "center" },
  title: { color: "white", fontSize: 14, fontWeight: "bold" },
  artist: { color: "#B3B3B3", fontSize: 12 },
  playButton: { padding: 10 },
});
