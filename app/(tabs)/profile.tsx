import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PremiumModal from "../../components/PremiumModal";
import { auth, db } from "../configs/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          }
        });
        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 👇 ĐÃ SỬA: Xóa dòng router.replace để không bị đá ra ngoài
  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có muốn chuyển sang chế độ Khách?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đồng ý",
        style: "destructive",
        onPress: async () => {
          await auth.signOut();
          // ❌ Đã xóa dòng: router.replace("/"); 
          // ✅ Để im đây, giao diện sẽ tự biến hình thành chế độ Khách
        },
      },
    ]);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleCancelRequest = async () => {
    if (!currentUser) return;
    Alert.alert("Hủy yêu cầu", "Bạn muốn hủy yêu cầu nâng cấp?", [
      { text: "Không", style: "cancel" },
      {
        text: "Hủy",
        style: "destructive",
        onPress: async () => {
          try {
            await updateDoc(doc(db, "users", currentUser.uid), {
              premiumStatus: null,
            });
          } catch (e) {
            Alert.alert("Lỗi", "Không thể hủy");
          }
        },
      },
    ]);
  };

  const MenuRow = ({ icon, title, isDestructive = false, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: currentUser
                  ? "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />
            {currentUser &&
              (userData?.isPremium ? (
                <View
                  style={[
                    styles.editBadge,
                    { backgroundColor: "#FFD700", borderColor: "#FFD700" },
                  ]}
                >
                  <Ionicons name="ribbon" size={14} color="black" />
                </View>
              ) : (
                <TouchableOpacity style={styles.editBadge}>
                  <Ionicons name="pencil" size={14} color="#fff" />
                </TouchableOpacity>
              ))}
          </View>

          {currentUser ? (
            <>
              <Text style={styles.name}>Thượng Đế</Text>
              <Text style={styles.email}>{currentUser.email}</Text>
            </>
          ) : (
            <>
              <Text style={styles.name}>Chào Khách!</Text>
              <TouchableOpacity onPress={handleLogin} style={{ marginTop: 5 }}>
                <Text style={{ color: "#1DB954", fontWeight: "bold" }}>
                  Bấm vào đây để đăng nhập
                </Text>
              </TouchableOpacity>
            </>
          )}

          {currentUser && (
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
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>

          {!currentUser ? (
            <MenuRow
              icon="log-in-outline"
              title="Đăng nhập tài khoản"
              onPress={handleLogin}
            />
          ) : (
            <>
              <MenuRow icon="person-outline" title="Hồ sơ cá nhân" />

              {userData?.isPremium ? (
                <View style={styles.premiumBadge}>
                  <Ionicons
                    name="ribbon"
                    size={24}
                    color="#000"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.premiumText}>Thành viên Premium 👑</Text>
                </View>
              ) : userData?.premiumStatus === "pending" ? (
                <View style={styles.pendingBadge}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <Ionicons
                      name="time"
                      size={24}
                      color="#000"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.pendingText}>Đang chờ duyệt ⏳</Text>
                  </View>
                  <Text
                    style={{ fontSize: 11, color: "#333", marginBottom: 10 }}
                  >
                    Admin đang kiểm tra...
                  </Text>
                  <TouchableOpacity
                    onPress={handleCancelRequest}
                    style={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Hủy yêu cầu
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <MenuRow
                  icon="card-outline"
                  title="Nâng cấp Premium"
                  onPress={() => setModalVisible(true)}
                />
              )}

              <MenuRow icon="time-outline" title="Lịch sử nghe nhạc" />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <MenuRow icon="notifications-outline" title="Thông báo" />
          <MenuRow icon="language-outline" title="Ngôn ngữ" />
          <MenuRow icon="moon-outline" title="Giao diện" />
          <MenuRow icon="lock-closed-outline" title="Quyền riêng tư" />
        </View>

        <View style={[styles.section, { marginBottom: 40 }]}>
          {currentUser && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.version}>Phiên bản 1.0.2 (Beta)</Text>

          <Link href="/admin" asChild>
            <TouchableOpacity
              style={{
                marginTop: 20,
                alignSelf: "center",
                opacity: 0.3,
                padding: 10,
              }}
            >
              <Text style={{ color: "#666", fontSize: 12 }}>
                Admin Area (Dev Only) 🛠️
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      <PremiumModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
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
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  premiumText: { color: "black", fontWeight: "bold", fontSize: 16 },
  pendingBadge: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  pendingText: { color: "black", fontWeight: "bold", fontSize: 15 },
});