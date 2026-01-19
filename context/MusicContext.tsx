import { Audio } from "expo-av";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Song = {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
};

type MusicContextType = {
  songs: Song[];
  favoriteSongs: Song[]; 
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  seekSong: (positionMillis: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (song: Song) => void; 
  checkIsFavorite: (songId: string) => boolean; 
  isShuffle: boolean;
  repeatMode: number;
  position: number;
  duration: number;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]); 
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  
  const songsRef = useRef<Song[]>([]);
  const isShuffleRef = useRef(false);
  const repeatModeRef = useRef(0);
  const loadingRequestId = useRef(0);

  useEffect(() => {
    // Tải nhạc từ API
    fetch("https://gist.githubusercontent.com/DinoSlime/1193b2e6ca0211a348172233bcd5c4ec/raw/485bef861e726693dd402b26e99ad5f5c1a92f0a/song.json")
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
        songsRef.current = data;
      })
      .catch((error) => console.error("Lỗi tải nhạc:", error));

    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('favorites');
      if (jsonValue != null) {
        setFavoriteSongs(JSON.parse(jsonValue));
      }
    } catch(e) { console.error("Lỗi load favorites:", e); }
  }

  const toggleFavorite = async (song: Song) => {
    const isExist = favoriteSongs.some(s => s.id === song.id);
    let newFavorites;

    if (isExist) {
        newFavorites = favoriteSongs.filter(s => s.id !== song.id);
    } else {
        newFavorites = [...favoriteSongs, song];
    }

    setFavoriteSongs(newFavorites);
    try {
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) { console.error("Lỗi lưu favorites:", e); }
  };

  const checkIsFavorite = (songId: string) => {
      return favoriteSongs.some(s => s.id === songId);
  }

  const toggleShuffle = () => {
    const newVal = !isShuffle; setIsShuffle(newVal); isShuffleRef.current = newVal;
  };
  const toggleRepeat = () => {
    const newVal = repeatMode === 0 ? 1 : 0; setRepeatMode(newVal); repeatModeRef.current = newVal;
  };
  const getNextSong = () => {
    const list = songsRef.current; if (list.length === 0 || !currentSong) return null;
    if (isShuffleRef.current) {
        let randomIndex;
        do { randomIndex = Math.floor(Math.random() * list.length); } 
        while (list.length > 1 && list[randomIndex].id === currentSong.id);
        return list[randomIndex];
    }
    const idx = list.findIndex(s => s.id === currentSong.id);
    const nextIdx = (idx + 1) % list.length;
    return list[nextIdx];
  };
  const playNext = () => { const nextSong = getNextSong(); if (nextSong) playSong(nextSong); };
  const playPrevious = () => { 
      const list = songsRef.current; if (list.length === 0 || !currentSong) return;
      const idx = list.findIndex(s => s.id === currentSong.id);
      const prevIdx = (idx - 1 + list.length) % list.length;
      playSong(list[prevIdx]);
  };

  const playSong = async (song: Song) => {
    const myRequestId = loadingRequestId.current + 1;
    loadingRequestId.current = myRequestId;
    try {
      if (soundRef.current) {
        soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {}
    setCurrentSong(song); setIsPlaying(false); setPosition(0); setDuration(0);
    try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.url }, { shouldPlay: true });
        if (myRequestId !== loadingRequestId.current) { await newSound.unloadAsync(); return; }
        soundRef.current = newSound; setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate(async (status) => {
            if (myRequestId !== loadingRequestId.current) return;
            if (!status.isLoaded) return;
            setPosition(status.positionMillis || 0); setDuration(status.durationMillis || 0); setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
                if (repeatModeRef.current === 1) { try { await newSound.replayAsync(); } catch(e) {} } 
                else { const nextSong = getNextSong(); if (nextSong) playSong(nextSong); }
            }
        });
    } catch (error) {}
  };
  const pauseSong = async () => { try { if (soundRef.current) { await soundRef.current.pauseAsync(); setIsPlaying(false); } } catch (error) {} };
  const resumeSong = async () => { try { if (soundRef.current) { await soundRef.current.playAsync(); setIsPlaying(true); } } catch (error) {} };
  const seekSong = async (positionMillis: number) => { try { if (soundRef.current) { await soundRef.current.setPositionAsync(positionMillis); setPosition(positionMillis); } } catch (error) {} };

  return (
    <MusicContext.Provider
      value={{
        songs, favoriteSongs, currentSong, isPlaying, playSong, pauseSong, resumeSong, seekSong,
        playNext, playPrevious, toggleShuffle, toggleRepeat, toggleFavorite, checkIsFavorite, 
        isShuffle, repeatMode, position, duration,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within a MusicProvider");
  return context;
};