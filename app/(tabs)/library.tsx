import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
// 👇 Import useMusic
import { useMusic } from "../../context/MusicContext";

export default function LibraryScreen() {
  const router = useRouter();
  // 👇 Lấy albums từ API về
  const { albums } = useMusic();

  // Hiển thị loading nếu chưa tải xong
  if (albums.length === 0) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color="#1DB954" />
              <Text style={{color:'gray', marginTop: 10}}>Đang tải Album...</Text>
          </View>
      )
  }

  const renderAlbum = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => {
          router.push({
            pathname: "/playlist/[id]",
            // Truyền dữ liệu sang trang chi tiết
            params: { 
                id: item.id, 
                title: item.title, 
                image: item.image, 
                // Chuyển mảng ID thành chuỗi để gửi đi (VD: "1,2,3")
                songIds: item.songIds.join(',') 
            },
          });
        }}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay} />
          
          <View style={styles.cardContent}>
            <Ionicons name="disc" size={24} color="#1DB954" style={{marginBottom: 5}}/>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thư viện</Text>
        <Text style={styles.headerSub}>Bộ sưu tập nhạc</Text>
      </View>

      <FlatList
        data={albums} // 👇 Dùng dữ liệu thật
        renderItem={renderAlbum}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingTop: 50, paddingHorizontal: 15 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 32, color: "white", fontWeight: "bold" },
  headerSub: { fontSize: 14, color: "#B3B3B3" },
  
  card: {
    width: "48%",
    height: 180,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  cardSubtitle: { color: "#ddd", fontSize: 12 },
});