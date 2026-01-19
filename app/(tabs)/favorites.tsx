import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function FavoritesScreen() {
  const { favoriteSongs, playSong, currentSong, toggleFavorite } = useMusic();
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => {
    const isActive = currentSong?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isActive && styles.activeItem]}
        onPress={() => {
          playSong(item);
          router.push("/modal");
        }}
      >
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.textContainer}>
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

        {isActive && (
            <Ionicons 
                name="stats-chart" 
                size={18} 
                color="#1DB954" 
                style={{ marginRight: 5 }} 
            />
        )}

        <TouchableOpacity
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item);
          }}
        >
          <Ionicons name="heart" size={24} color="#1DB954" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yêu thích</Text>
        <Text style={styles.subTitle}>{favoriteSongs.length} bài hát</Text>
      </View>

      {favoriteSongs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color="#333" />
          <Text style={styles.emptyText}>Chưa có bài hát nào</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteSongs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 32, color: "white", fontWeight: "bold" },
  subTitle: { color: "#B3B3B3", fontSize: 14, marginTop: 5 },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  activeItem: { backgroundColor: "#282828" },
  image: { width: 50, height: 50, borderRadius: 4 },

  textContainer: { flex: 1, marginLeft: 15, paddingRight: 10 },
  songTitle: { color: "white", fontSize: 16, fontWeight: "500" },
  artist: { color: "#B3B3B3", fontSize: 14 },

  removeButton: {
    padding: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptySubText: { color: "#777", marginTop: 10 },
});