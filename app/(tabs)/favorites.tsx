import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMusic } from "../../context/MusicContext";

export default function FavoritesScreen() {
  const { songs, isLoading, playSong, currentSong, isPlaying } = useMusic();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Đang tải dữ liệu...
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = currentSong?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.songItem, isActive && { backgroundColor: "#282828" }]}
        onPress={() => playSong(item)}
      >
        <Text style={[styles.index, isActive && { color: "#1DB954" }]}>
          {isActive && isPlaying ? (
            <Ionicons name="musical-notes" size={16} color="#1DB954" />
          ) : (
            index + 1
          )}
        </Text>

        <Image source={{ uri: item.image }} style={styles.songImage} />

        <View style={styles.songInfo}>
          <Text
            style={[styles.songTitle, isActive && { color: "#1DB954" }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>

        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart" size={24} color="#1DB954" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài hát yêu thích</Text>
      </View>

      <Text style={styles.subTitle}>
        {songs.length} bài hát • Đã tải từ Server
      </Text>

      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: { justifyContent: "center", alignItems: "center" },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "white" },
  subTitle: {
    color: "#B3B3B3",
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: { paddingBottom: 100 },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  index: { color: "#B3B3B3", fontSize: 16, width: 25, textAlign: "center" },
  songImage: { width: 50, height: 50, borderRadius: 4, marginHorizontal: 15 },
  songInfo: { flex: 1, justifyContent: "center" },
  songTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  artist: { color: "#B3B3B3", fontSize: 14 },
  heartButton: { marginRight: 15 },
});
