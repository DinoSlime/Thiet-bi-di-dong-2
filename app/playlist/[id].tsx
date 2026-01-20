import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMusic } from "../../context/MusicContext";

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { title, image, songIds } = params;

  const { songs, playSong, currentSong } = useMusic();

  const targetIds = ((songIds as string) || "").split(",");
  const playlistSongs = songs.filter((song) => targetIds.includes(song.id));

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = currentSong?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isActive && styles.activeItem]}
        onPress={() => {
          playSong(item);
          router.push("/modal");
        }}
      >
        <Text style={[styles.index, isActive && { color: "#1DB954" }]}>
          {index + 1}
        </Text>
        <Image source={{ uri: item.image }} style={styles.songImage} />

        <View style={styles.textContainer}>
          <Text
            style={[styles.songTitle, isActive && { color: "#1DB954" }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.artist}>{item.artist}</Text>
        </View>

        {isActive && <Ionicons name="stats-chart" size={20} color="#1DB954" />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.imageBackground}>
          <Image source={{ uri: image as string }} style={styles.coverImage} />
          <View style={styles.overlay} />
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.playlistTitle}>{title}</Text>
          <Text style={styles.playlistCount}>
            {playlistSongs.length} bài hát
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            if (playlistSongs.length > 0) {
              playSong(playlistSongs[0]);
              router.push("/modal");
            }
          }}
        >
          <Ionicons
            name="play"
            size={32}
            color="black"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlistSongs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 40 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 45,
  },

  header: {
    height: 300,
    justifyContent: "flex-end",
    position: "relative",
    marginHorizontal: 10,
    marginBottom: 10, 
    zIndex: 1, 
  },

  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30, 
    overflow: "hidden", 
    backgroundColor: "#333",
  },

  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerInfo: {
    padding: 20,
    paddingBottom: 30,
  },
  playlistTitle: { color: "white", fontSize: 32, fontWeight: "bold" },
  playlistCount: { color: "#ddd", fontSize: 16, marginTop: 5 },

  playButton: {
    position: "absolute",
    right: 20,
    bottom: -30, 
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 20, 
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  activeItem: {
    backgroundColor: "#282828",
    paddingVertical: 10,
    borderRadius: 8,
  },
  index: { color: "#777", width: 30, fontSize: 16, textAlign: "center" },
  songImage: { width: 50, height: 50, borderRadius: 4, marginRight: 15 },
  textContainer: { flex: 1 },
  songTitle: { color: "white", fontSize: 16, fontWeight: "500" },
  artist: { color: "#B3B3B3", fontSize: 14 },
});
