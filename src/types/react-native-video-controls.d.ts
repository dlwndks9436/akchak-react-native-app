declare module 'react-native-video-controls' {
  import {Component} from 'react';
  import {PanResponder, StyleProp, ViewStyle} from 'react-native';
  import Video, {VideoProperties} from 'react-native-video';

  export interface VideoPlayerProps extends VideoProperties {
    toggleResizeModeOnFullscreen?: boolean;
    controlTimeout?: number;
    showOnStart?: boolean;
    videoStyle?: StyleProp<ViewStyle>;
    navigator?: any;
    seekColor?: string;
    style?: StyleProp<ViewStyle>;
    paused?: boolean;

    controlAnimationTiming?: number;
    doubleTapTime?: number;
    isFullscreen?: boolean;
    title?: string;

    // Events
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
    onPause?: () => void;
    onPlay?: () => void;
    onBack?: () => void;
    onEnd?: () => void;
    // Controls
    disableFullscreen?: boolean;
    disablePlayPause?: boolean;
    disableSeekbar?: boolean;
    disableVolume?: boolean;
    disableTimer?: boolean;
    disableBack?: boolean;
  }

  export interface VideoPlayerStates {
    isFullscreen: boolean;
    showTimeRemaining: boolean;
    volumeTrackWidth: number;
    volumeFillWidth: number;
    seekerFillWidth: number;
    showControls: boolean;
    volumePosition: number;
    seekerPosition: number;
    volumeOffset: number;
    seekerOffset: number;
    seeking: boolean;
    originallyPaused: boolean;
    scrubbing: boolean;
    loading: boolean;
    currentTime: number;
    error: boolean;
    duration: number;
  }

  export interface VideoPlayerOptions {
    playWhenInactive: boolean;
    playInBackground: boolean;
    repeat: boolean;
    title: string;
  }

  export interface VideoPlayerEvents {
    onError: () => void;
    onBack: () => void;
    onEnd: () => void;
    onScreenTouch: () => void;
    onEnterFullscreen: () => void;
    onExitFullscreen: () => void;
    onShowControls: () => void;
    onHideControls: () => void;
    onLoadStart: () => void;
    onProgress: () => void;
    onSeek: () => void;
    onLoad: () => void;
    onPause: () => void;
    onPlay: () => void;
  }

  export interface VideoPlayerMethods {
    toggleFullscreen: () => void;
    togglePlayPause: () => void;
    toggleControls: () => void;
    toggleTimer: () => void;
  }

  export interface VideoPlayerSettings {
    controlTimeoutDelay: number;
    volumePanResponder: PanResponder;
    seekPanResponder: PanResponder;
    controlTimeout: number;
    tapActionTimeout: number;
    volumeWidth: number;
    iconOffset: number;
    seekerWidth: number;
    ref: Video;
    scrubbingTimeStep: number;
    tapAnywhereToPause: boolean;
  }

  class VideoPlayer extends Component<VideoPlayerProps, {}> {
    state: VideoPlayerStates;
    opts: VideoPlayerOptions;
    events: VideoPlayerEvents;
    methods: VideoPlayerMethods;
    player: VideoPlayerSettings;

    componentDidUpdate: (prevProps: VideoPlayerProps) => void;
    setControlTimeout: () => void;
    clearControlTimeout: () => void;
    resetControlTimeout: () => void;
    hideControlAnimation: () => void;
    showControlAnimation: () => void;
    loadAnimation: () => void;
    calculateTime: () => string;
    formatTime: (time?: 0) => string;
    constrainToSeekerMinMax: (val?: 0) => number;
    calculateSeekerPosition: () => number;
    calculateTimeFromSeekerPosition: () => number;
    seekTo: (time?: 0) => void;
    setSeekerPosition: (position?: 0) => void;
    setVolumePosition: (position?: 0) => void;
    constrainToVolumeMinMax: (value?: 0) => number;
    calculateVolumeFromVolumePosition: () => number;
    calculateVolumePositionFromVolume: () => number;
  }

  export default VideoPlayer;
}
