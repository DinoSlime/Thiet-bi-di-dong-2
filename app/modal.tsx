import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react"; 
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useMusic } from "../context/MusicContext";

const formatTime = (millis: number) => {
  if (!millis) return "0:00";
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function ModalScreen() {
  const router = useRouter();
  const { 
      currentSong, isPlaying, pauseSong, resumeSong, 
      position, duration, seekSong, 
      playNext, playPrevious, toggleShuffle, toggleRepeat, 
      isShuffle, repeatMode,
      toggleFavorite, checkIsFavorite 
  } = useMusic();

  if (!currentSong) {
    router.back();
    return null;
  }
  const isLiked = checkIsFavorite(currentSong.id);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />


      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
          }}
          style={styles.closeButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="chevron-down" size={32} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Đang phát nhạc</Text>

        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.artworkContainer}>
        <Image source={{ uri: currentSong.image }} style={styles.artwork} />
      </View>

      <View style={styles.infoContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist}>{currentSong.artist}</Text>
        </View>

        <TouchableOpacity onPress={() => toggleFavorite(currentSong)}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={28}
            color={isLiked ? "#1DB954" : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seekSong}
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
        <TouchableOpacity onPress={toggleShuffle}>
          <Ionicons
            name="shuffle"
            size={24}
            color={isShuffle ? "#1DB954" : "#777"}
          />
          {isShuffle && <View style={styles.dot} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={playPrevious}>
          <Ionicons name="play-skip-back" size={35} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButtonWrapper}
          onPress={() => (isPlaying ? pauseSong() : resumeSong())}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={36}
            color="black"
            style={{ marginLeft: isPlaying ? 0 : 4 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}>
          <Ionicons
            name={repeatMode === 1 ? "repeat" : "repeat"}
            size={24}
            color={repeatMode === 1 ? "#1DB954" : "#777"}
          />
          {repeatMode === 1 && (
            <View style={[styles.dot, { right: 8 }]}>
              <Text style={{ color: "white", fontSize: 8, fontWeight: "bold" }}>
                1
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: "space-between",
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  closeButton: { padding: 5 },
  headerTitle: {
    color: "#ccc",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  artworkContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  artwork: { width: 320, height: 320, borderRadius: 12 },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
  },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 2 },
  artist: { color: "#B3B3B3", fontSize: 16 },
  sliderContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -5,
  },
  timeText: { color: "#b3b3b3", fontSize: 12 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  playButtonWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    bottom: -5,
    alignSelf: "center",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
  },
});