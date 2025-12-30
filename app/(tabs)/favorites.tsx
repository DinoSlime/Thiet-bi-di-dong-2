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
const MOCK_FAVORITES = [
  {
    id: "1",
    title: "Hẹn hò nhưng không yêu",
    artist: "Wendy Thảo",
    image: require("../../assets/images/Camellya.jpg"),
  },
  {
    id: "2",
    title: "Thương một người mất cả tương lai",
    artist: "Thành Đạt",
    image: require("../../assets/images/TheShore.png"),
  },
  {
    id: "3",
    title: "Người yêu bỏ lỡ(愛人錯過)",
    artist: "JAccusefive (告五人)",
    image: require("../../assets/images/Camellya2.jpg"),
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity style={styles.songItem}>
      <Text style={styles.index}>{index + 1}</Text>

      <Image source={item.image} style={styles.songImage} />

      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>

      <TouchableOpacity style={styles.heartButton}>
        <Ionicons name="heart" size={24} color="#1DB954" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={20} color="#B3B3B3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài hát yêu thích</Text>
        <View style={styles.playButtonContainer}>
          <TouchableOpacity style={styles.playAllButton}>
            <Ionicons name="play" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subTitle}>
        {MOCK_FAVORITES.length} bài hát • Đã lưu vào thư viện
      </Text>

      <FlatList
        data={MOCK_FAVORITES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  playButtonContainer: {},
  playAllButton: {
    backgroundColor: "#1DB954",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    color: "#B3B3B3",
    fontSize: 14,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 100,
  },

  songItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  index: {
    color: "#B3B3B3",
    fontSize: 16,
    width: 25,
    textAlign: "center",
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginHorizontal: 15,
  },
  songInfo: {
    flex: 1,
    justifyContent: "center",
  },
  songTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  artist: {
    color: "#B3B3B3",
    fontSize: 14,
  },
  heartButton: {
    marginRight: 15,
  },
});
