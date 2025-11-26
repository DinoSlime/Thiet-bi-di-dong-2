// Đây là bố cục xác thực của ứng dụng, định nghĩa các màn hình trong nhóm xác thực

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Khai báo các màn hình con trong nhóm này */}
      <Stack.Screen name="login" />
    </Stack>
  );
}