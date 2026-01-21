import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 👇 1. Import router để đá user ra
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { db, auth } from "./configs/firebaseConfig"; // 👇 2. Nhớ import auth

// 👇 3. KHAI BÁO EMAIL CỦA BẠN (ADMIN) VÀO ĐÂY
const ADMIN_EMAIL = "admin@gmail.com"; // <--- Thay bằng email thật của bạn vào đây

export default function AdminScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true); // Biến để chờ kiểm tra xong

  // 👇 4. LOGIC CHẶN CỬA (BẢO VỆ)
  useEffect(() => {
    // Nếu chưa đăng nhập HOẶC Email không khớp với Admin
    if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
      Alert.alert("Cảnh báo 🚫", "Bạn không có quyền truy cập khu vực này!");
      router.replace("/(tabs)/profile"); // Đá về trang cá nhân
    } else {
      setIsChecking(false); // Cho phép vào
    }
  }, []);

  // 1. Lấy danh sách (Giữ nguyên)
  useEffect(() => {
    if (isChecking) return; // Đang check quyền thì chưa tải dữ liệu vội

    const q = query(
      collection(db, "users"),
      where("premiumStatus", "==", "pending"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(list);
    });
    return () => unsubscribe();
  }, [isChecking]);

  // ... (Giữ nguyên các hàm handleApprove, handleReject cũ) ...
  const handleApprove = async (userId: string, userName: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isPremium: true,
        premiumStatus: "approved",
        premiumSince: new Date().toISOString(),
      });
      Alert.alert("Thành công", `Đã duyệt VIP cho ${userName}`);
    } catch (error) { Alert.alert("Lỗi", "Không thể duyệt"); }
  };

  const handleReject = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { premiumStatus: null });
      Alert.alert("Đã từ chối", "Yêu cầu đã bị hủy.");
    } catch (error) { Alert.alert("Lỗi", "Không thể từ chối"); }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.email}>{item.email || "Không có email"}</Text>
        <Text style={styles.package}>Gói: {item.package || "Không rõ"}</Text>
        <Text style={styles.date}>ID: {item.id.slice(0, 5)}...</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => handleReject(item.id)}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnApprove]} onPress={() => handleApprove(item.id, item.email)}>
          <Ionicons name="checkmark" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Nếu đang check quyền thì hiện vòng quay loading chứ chưa hiện nội dung
  if (isChecking) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={{color: 'white', marginTop: 10}}>Đang kiểm tra quyền Admin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard 🛠️</Text>
      <Text style={styles.subtitle}>Danh sách chờ duyệt ({requests.length})</Text>

      {requests.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="file-tray-outline" size={64} color="#333" />
          <Text style={{ color: "#666", marginTop: 10 }}>Hiện chưa có yêu cầu nào.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: "white" },
  subtitle: { fontSize: 16, color: "#b3b3b3", marginBottom: 20 },
  card: { backgroundColor: "#1E1E1E", padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#333" },
  email: { fontWeight: "bold", fontSize: 16, marginBottom: 4, color: "white" },
  package: { color: "#1DB954", fontWeight: "600", marginBottom: 2 },
  date: { color: "#b3b3b3", fontSize: 12 },
  actions: { flexDirection: "row", gap: 10 },
  btn: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  btnReject: { backgroundColor: "#333", borderWidth: 1, borderColor: "#ff4757" },
  btnApprove: { backgroundColor: "#1DB954" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
});