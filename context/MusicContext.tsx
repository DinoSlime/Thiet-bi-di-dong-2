import { Audio } from "expo-av";
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
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
}

const MusicContext = createContext<MusicContextType>({} as MusicContextType);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/DinoSlime/1193b2e6ca0211a348172233bcd5c4ec/raw/797640f530c0c269adcb8fce99699ec186dbdb1e/song.json"
        );
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const playSong = async (song: Song) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      console.log("Đang tải bài:", song.title);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error("Lỗi phát nhạc:", error);
      Alert.alert("Lỗi", "Không thể phát bài hát này!");
    }
  };

  const pauseSong = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSong = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <MusicContext.Provider
      value={{
        songs,
        isLoading,
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        resumeSong,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
