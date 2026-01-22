import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Đăng nhập thành công!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Đăng nhập thất bại", "Sai email hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={() => router.push("/forgot-password")}
        style={styles.forgotButton}
      >
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#1DB954", textAlign: "center" }}>
          Chưa có tài khoản?{" "}
          <Text style={{ fontWeight: "bold" }}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#1DB954",
    fontWeight: "bold",
  },
  // 👆
  button: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "black", fontWeight: "bold", fontSize: 18 },
});
