// Đây là trang khởi đầu của App, chuyển hướng ngay đến trang Login

import { Redirect } from 'expo-router';

export default function Index() {
  // Mở App lên -> Chuyển ngay vào trang Login
  return <Redirect href="/(auth)/login" />;
}