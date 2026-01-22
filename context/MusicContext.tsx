import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Song = {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
};

type Album = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  songIds: string[];
};

type MusicContextType = {
  songs: Song[];
  albums: Album[];
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
  const [albums, setAlbums] = useState<Album[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);

  const songsRef = useRef<Song[]>([]);
  const currentSongRef = useRef<Song | null>(null);
  const isShuffleRef = useRef(false);
  const repeatModeRef = useRef(0);
  const loadingRequestId = useRef(0);

  useEffect(() => {
    configureAudio();

    fetch(
      "https://gist.githubusercontent.com/DinoSlime/1193b2e6ca0211a348172233bcd5c4ec/raw/85047fa8b48936e10da3b9b416fcfc6ebbd9e828/song.json",
    )
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
        songsRef.current = data;
      })
      .catch((error) => console.error("Lỗi tải nhạc:", error));

    fetch(
      "https://gist.githubusercontent.com/DinoSlime/2ab0cf9c58429c0900a48dd125fa6e4e/raw/2a6bea360dfc0abd26d8d03999f1d515d3cb22dc/albums.json",
    )
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch((error) => console.error("Lỗi tải album:", error));

    loadFavorites();
  }, []);

  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playThroughEarpieceAndroid: false,
      });
    } catch (e) {
      console.error("Lỗi cấu hình Audio:", e);
    }
  };

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("favorites");
      if (jsonValue != null) {
        setFavoriteSongs(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Lỗi load favorites:", e);
    }
  };

  const toggleFavorite = async (song: Song) => {
    const isExist = favoriteSongs.some((s) => s.id === song.id);
    let newFavorites;

    if (isExist) {
      newFavorites = favoriteSongs.filter((s) => s.id !== song.id);
    } else {
      newFavorites = [...favoriteSongs, song];
    }

    setFavoriteSongs(newFavorites);
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Lỗi lưu favorites:", e);
    }
  };

  const checkIsFavorite = (songId: string) => {
    return favoriteSongs.some((s) => s.id === songId);
  };

  const toggleShuffle = () => {
    const newVal = !isShuffle;
    setIsShuffle(newVal);
    isShuffleRef.current = newVal;
  };
  const toggleRepeat = () => {
    const newVal = repeatMode === 0 ? 1 : 0;
    setRepeatMode(newVal);
    repeatModeRef.current = newVal;
  };

  const getNextSong = () => {
    const list = songsRef.current;
    const current = currentSongRef.current;

    if (list.length === 0 || !current) return null;

    if (isShuffleRef.current) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * list.length);
      } while (list.length > 1 && list[randomIndex].id === current.id);
      return list[randomIndex];
    }

    const idx = list.findIndex((s) => s.id === current.id);
    const nextIdx = (idx + 1) % list.length;
    return list[nextIdx];
  };

  const playNext = () => {
    const nextSong = getNextSong();
    if (nextSong) playSong(nextSong);
  };

  const playPrevious = () => {
    const list = songsRef.current;
    const current = currentSongRef.current;

    if (list.length === 0 || !current) return;
    const idx = list.findIndex((s) => s.id === current.id);
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

    setCurrentSong(song);
    currentSongRef.current = song;
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true },
      );
      if (myRequestId !== loadingRequestId.current) {
        await newSound.unloadAsync();
        return;
      }
      soundRef.current = newSound;
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (myRequestId !== loadingRequestId.current) return;
        if (!status.isLoaded) return;
        setPosition(status.positionMillis || 0);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish) {
          if (repeatModeRef.current === 1) {
            try {
              await newSound.replayAsync();
            } catch (e) {}
          } else {
            const nextSong = getNextSong();
            if (nextSong) playSong(nextSong);
          }
        }
      });
    } catch (error) {}
  };

  const pauseSong = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {}
  };
  const resumeSong = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {}
  };
  const seekSong = async (positionMillis: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(positionMillis);
        setPosition(positionMillis);
      }
    } catch (error) {}
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        albums,
        favoriteSongs,
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        resumeSong,
        seekSong,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        checkIsFavorite,
        isShuffle,
        repeatMode,
        position,
        duration,
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
