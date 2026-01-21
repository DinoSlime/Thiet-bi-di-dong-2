import { Ionicons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react"; 
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../app/configs/firebaseConfig";

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
}

const MY_BANK = {
  BANK_ID: "TPB",
  ACCOUNT_NO: "03344556677",
  TEMPLATE: "compact",
};

export default function PremiumModal({ visible, onClose }: PremiumModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<"test" | "1month" | "1year" | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(false);      
      setShowQR(false);       
      setSelectedPackage(null); 
    }
  }, [visible]);

  const packages = {
    "test": { price: 1000, name: "Gói Test (Dùng thử)" },
    "1month": { price: 20000, name: "Gói 1 Tháng" },
    "1year": { price: 200000, name: "Gói 1 Năm (Siêu hời)" },
  };

  const getQRLink = () => {
    if (!selectedPackage || !auth.currentUser) return "";
    const amount = packages[selectedPackage].price;
    const content = `User ${auth.currentUser.uid.slice(0, 5)} mua vip`;
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-${MY_BANK.TEMPLATE}.png?amount=${amount}&addInfo=${content}`;
  };

  const handlePaymentSuccess = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        isPremium: false,
        premiumStatus: 'pending',
        premiumRequestDate: new Date().toISOString(),
        email: auth.currentUser.email,
        package: packages[selectedPackage!].name
      }, { merge: true });

      Alert.alert("Đã gửi yêu cầu", "Hệ thống đang kiểm tra giao dịch...");
      onClose();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    } finally {
      
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Nâng cấp Premium ✨</Text>

          {!showQR ? (
            <View style={{ width: "100%" }}>
              <Text style={styles.subTitle}>Chọn gói phù hợp với bạn:</Text>

              <TouchableOpacity
                style={[
                  styles.option,
                  selectedPackage === "test" && styles.selectedOption,
                ]}
                onPress={() => setSelectedPackage("test")}
              >
                <Text style={styles.optionText}>Gói Test (Thử nghiệm)</Text>
                <Text style={styles.priceText}>1.000đ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  selectedPackage === "1month" && styles.selectedOption,
                ]}
                onPress={() => setSelectedPackage("1month")}
              >
                <Text style={styles.optionText}>1 Tháng</Text>
                <Text style={styles.priceText}>20.000đ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  selectedPackage === "1year" && styles.selectedOption,
                ]}
                onPress={() => setSelectedPackage("1year")}
              >
                <Text style={styles.optionText}>1 Năm</Text>
                <Text style={styles.priceText}>200.000đ</Text>
              </TouchableOpacity>
         

              <TouchableOpacity
                style={[styles.payButton, !selectedPackage && { opacity: 0.5 }]}
                disabled={!selectedPackage}
                onPress={() => setShowQR(true)}
              >
                <Text style={styles.payText}>Tiếp tục thanh toán</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: "center", width: "100%" }}>
              <Text style={styles.subTitle}>Quét mã để thanh toán:</Text>

              {getQRLink() !== "" ? (
                <Image
                  source={{ uri: getQRLink() }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.qrImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' }]}>
                  <Text style={{ color: 'white', textAlign: 'center', padding: 10 }}>
                    Lỗi thông tin user.
                  </Text>
                </View>
              )}

              <Text style={{color: "#aaa", fontSize: 12, textAlign: "center", marginVertical: 10}}>
                Hệ thống sẽ tự động điền nội dung.
              </Text>

              
              <TouchableOpacity
                style={[styles.payButton, { backgroundColor: "#1DB954", opacity: loading ? 0.7 : 1 }]}
                onPress={handlePaymentSuccess}
                disabled={loading} 
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.payText}>Tôi đã chuyển tiền</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowQR(false)}
                style={{ marginTop: 15 }}
                disabled={loading} 
              >
                <Text style={{ color: "#bbb" }}>Quay lại chọn gói</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  closeBtn: { position: "absolute", top: 15, right: 15, zIndex: 10 },
  title: { fontSize: 22, color: "white", fontWeight: "bold", marginBottom: 20 },
  subTitle: { color: "#ccc", marginBottom: 15 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 10,
  },
  selectedOption: { borderColor: "#1DB954", backgroundColor: "#1DB95420" },
  optionText: { color: "white", fontSize: 16, fontWeight: "bold" },
  priceText: { color: "#1DB954", fontSize: 16, fontWeight: "bold" },
  payButton: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  payText: { color: "black", fontWeight: "bold", fontSize: 16 },
  qrImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: "white",
  },
});