export interface Scene {
  scene: number;
  storyboard: string;
  voiceover: string;
  imagePrompt: string;
  characterPrompt: string;
  veoPrompt: string;
  seconds: number;
  music: string;
}

export interface VideoScript {
  id: string;
  topic: string;
  createdAt: string;
  videoType: string;
  scenes: Scene[];
  style: string;
}