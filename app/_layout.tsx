import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MusicProvider } from "../context/MusicContext";
export default function RootLayout() {
  return (
    <MusicProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </MusicProvider>
  );
}
