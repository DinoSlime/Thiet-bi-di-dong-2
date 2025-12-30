import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface Song {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
}

interface MusicContextType {
  songs: Song[];
  isLoading: boolean;
}

const MusicContext = createContext<MusicContextType>({
  songs: [],
  isLoading: true,
});

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/DinoSlime/1193b2e6ca0211a348172233bcd5c4ec/raw/f473e3c4f43b17b08e7182867268d4538e357b29/song.json"
        );

        const data = await response.json();
        setSongs(data);
        console.log("✅ Đã tải xong:", data.length, "bài hát");
      } catch (error) {
        console.error("❌ Lỗi tải nhạc:", error);
        Alert.alert("Lỗi", "Không thể kết nối đến Server nhạc!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return (
    <MusicContext.Provider value={{ songs, isLoading }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
