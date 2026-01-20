import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MusicProvider } from "../context/MusicContext";

export default function RootLayout() {
  return (
    <MusicProvider>
      <Stack screenOptions={{ contentStyle: { backgroundColor: "#121212" } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            headerShown: false,
            presentation: "card",
            animation: "slide_from_bottom",
            animationDuration: 350,
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </MusicProvider>
  );
}
