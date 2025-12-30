
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BAI_HAT = [
  {
    id: "1",
    title: "Hẹn hò nhưng không yêu",
    artist: "Wendy Thảo",
    image: require("../../assets/images/Camellya.jpg"),
    uri: require("../../assets/music/HenHoNhungKhongYeu.mp3"),
  },
  {
    id: "2",
    title: "Thương một người mất cả tương lai",
    artist: "Thành Đạt",
    image: require("../../assets/images/TheShore.png"),
    uri: require("../../assets/music/ThuongMotNguoiMatCaTuongLai.mp3"),
  },

  {
    id: "3",
    title: "Người yêu bỏ lỡ(愛人錯過)",
    artist: "Accusefive (告五人)",
    image: require("../../assets/images/Camellya2.jpg"),
    uri: require("../../assets/music/NguoiYeuBoLo.mp3"),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Chào buổi sáng";
    if (hour >= 11 && hour < 14) return "Chào buổi trưa";
    if (hour >= 14 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const filteredSongs = BAI_HAT.filter(
    (song) =>
      song.title.toLowerCase().includes(searchText.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchText.toLowerCase())
  );

  const openPlayer = (baiHat: any) => {
    router.push({
      pathname: "/modal",
      params: {
        title: baiHat.title,
        artist: baiHat.artist,
        image: baiHat.image,
        uri: baiHat.uri,
      },
    });
  };

  const renderVerticalItem = ({ item }: any) => (
    <TouchableOpacity style={styles.songItem} onPress={() => openPlayer(item)}>
      <Image source={item.image} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <Ionicons name="play-circle" size={30} color="#1DB954" />
    </TouchableOpacity>
  );

  const renderHorizontalItem = ({ item }: any) => (
    <TouchableOpacity style={styles.cardItem} onPress={() => openPlayer(item)}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist}>{item.artist}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.username}>Thượng Đế</Text>
          </View>
          <TouchableOpacity onPress={() => alert("Chưa có thông báo!")}>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Bạn muốn nghe gì?"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 200 }}
      >
        {searchText === "" && (
          <View>
            <Text style={styles.sectionTitle}>🔥 Có thể bạn sẽ thích</Text>
            <FlatList
              data={BAI_HAT}
              renderItem={renderHorizontalItem}
              keyExtractor={(item) => item.id}
              horizontal={true} 
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 30 }}
            />
          </View>
        )}


        <Text style={styles.sectionTitle}>
          {searchText ? "Kết quả tìm kiếm" : "Danh sách phát"}
        </Text>

        {filteredSongs.length > 0 ? (
          filteredSongs.map((item) => (
            <View key={item.id}>{renderVerticalItem({ item })}</View>
          ))
        ) : (
          <Text style={{ color: "#888", textAlign: "center" }}>
            Không tìm thấy bài hát
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },

  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { color: "#ccc", fontSize: 14 },
  username: { color: "#fff", fontSize: 24, fontWeight: "bold" },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
  },
  searchInput: { flex: 1, fontSize: 16, color: "#000" },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },

  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#2A2A2A",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  songImage: { width: 60, height: 60, borderRadius: 8 },
  songInfo: { flex: 1, marginLeft: 15 },
  songTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  songArtist: { color: "#b3b3b3", fontSize: 14 },

  cardItem: { marginRight: 15, width: 140, marginLeft: 20 },
  cardImage: { width: 140, height: 140, borderRadius: 15, marginBottom: 10 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  cardArtist: { color: "#b3b3b3", fontSize: 14 },
});
