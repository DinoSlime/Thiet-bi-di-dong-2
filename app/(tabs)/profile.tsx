import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất khỏi tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        style: "destructive",
        onPress: () => {
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const MenuRow = ({
    icon,
    title,
    isDestructive = false,
  }: {
    icon: any;
    title: string;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View
          style={[styles.iconBox, isDestructive && styles.iconBoxDestructive]}
        >
          <Ionicons
            name={icon}
            size={22}
            color={isDestructive ? "#ff4757" : "#fff"}
          />
        </View>
        <Text
          style={[styles.menuText, isDestructive && styles.textDestructive]}
        >
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>Thượng Đế</Text>
        <Text style={styles.email}>@admin</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Playlist</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.5k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>240</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <MenuRow icon="person-outline" title="Hồ sơ cá nhân" />
        <MenuRow icon="card-outline" title="Gói Premium" />
        <MenuRow icon="time-outline" title="Lịch sử nghe nhạc" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        <MenuRow icon="notifications-outline" title="Thông báo" />
        <MenuRow icon="language-outline" title="Ngôn ngữ" />
        <MenuRow icon="moon-outline" title="Giao diện" />
        <MenuRow icon="lock-closed-outline" title="Quyền riêng tư" />
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Phiên bản 1.0.2 (Beta)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#1E1E1E",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#1DB954",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1DB954",
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1E1E1E",
  },
  name: { color: "white", fontSize: 22, fontWeight: "bold" },
  email: { color: "#B3B3B3", fontSize: 14, marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "80%",
    justifyContent: "space-between",
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { color: "white", fontSize: 18, fontWeight: "bold" },
  statLabel: { color: "#B3B3B3", fontSize: 12 },
  statDivider: { width: 1, height: "100%", backgroundColor: "#333" },

  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: {
    color: "#666",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconBoxDestructive: { backgroundColor: "rgba(255, 71, 87, 0.1)" },
  menuText: { color: "white", fontSize: 16, fontWeight: "500" },
  textDestructive: { color: "#ff4757" },

  logoutButton: {
    marginTop: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff4757",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#ff4757", fontSize: 16, fontWeight: "bold" },
  version: { textAlign: "center", color: "#444", marginTop: 20, fontSize: 12 },
});
