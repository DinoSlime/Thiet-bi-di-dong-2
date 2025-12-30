
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

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (username === "admin" && password === "123") {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Đăng nhập thất bại",
        "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!"
      );
      setPassword("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MY MUSIC APP</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên người dùng</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên người dùng (admin)"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu (123)"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signup")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 32,
    color: "#1DB954",
    fontWeight: "bold",
    marginBottom: 40,
  },

  inputContainer: { width: "80%", gap: 10 },

  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: -5,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  input: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  linkButton: { marginTop: 20 },
  linkText: { color: "#1DB954", fontSize: 14, fontWeight: "bold" },
});
