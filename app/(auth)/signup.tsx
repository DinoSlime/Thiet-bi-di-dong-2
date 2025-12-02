// File: app/(auth)/signup.tsx

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

  // Tạo 3 biến để lưu dữ liệu nhập
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // 1. Kiểm tra rỗng
    if (username === "" || password === "" || confirmPassword === "") {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // 2. Kiểm tra mật khẩu có khớp không
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp!");
      return;
    }

    // (Vì không có DB nên ta không lưu, chỉ báo thành công rồi quay về Login)
    Alert.alert("Thành công", "Tạo tài khoản thành công! Vui lòng đăng nhập.");

    // Quay lại màn hình Login
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ĐĂNG KÝ</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Tên người dùng</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên người dùng..."
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu..."
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />


        <Text style={styles.label}>Nhập lại mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu..."
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>
        </TouchableOpacity>

        {/* Nút quay lại Login */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.linkConfig}
        >
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1DB954",
    marginBottom: 10,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
  },

  
  form: {
    gap: 10,
    width: "100%", 
  },

  
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: -5,
    marginTop: 5,
  },

  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 15,
    borderRadius: 10, 
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 10, 
    alignItems: "center",
    marginTop: 25, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkConfig: {
    alignItems: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#1DB954",
    fontSize: 16,
    fontWeight: "bold",
  },
});
