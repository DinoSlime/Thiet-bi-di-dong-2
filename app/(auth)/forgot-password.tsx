import { useRouter } from "expo-router"; 
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../configs/firebaseConfig"; 

export default function ForgotPasswordScreen() {
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email của bạn!");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);

      Alert.alert(
        "Đã gửi email!",
        `Link đặt lại mật khẩu đã được gửi tới ${email}. Hãy kiểm tra cả hộp thư Spam nhé.`,
        [
          { text: "OK", onPress: () => router.back() }, 
        ],
      );
    } catch (error: any) {
      setLoading(false);
      let msg = error.message;
      if (error.code === "auth/user-not-found")
        msg = "Email này chưa đăng ký tài khoản nào!";
      if (error.code === "auth/invalid-email")
        msg = "Địa chỉ email không hợp lệ!";
      Alert.alert("Lỗi", msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu?</Text>
      <Text style={styles.subtitle}>Nhập email để lấy lại mật khẩu nhé.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
      
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>GỬI YÊU CẦU</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    justifyContent: "center",
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { color: "#fff", marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  button: {
    backgroundColor: "#1DB954",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  backButton: { marginTop: 20, alignItems: "center" },
  backText: { color: "#1DB954", fontSize: 16, fontWeight: "600" },
});
