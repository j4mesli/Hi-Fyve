export interface synesthesiaOutput {
    top_x_songs: Array<{ name: string, artists: string[], image: string, mp3: string }>;
    top_name: string;
    top_artists: string[];
    top_image: string;
    top_mp3: string;
    color1: number[];
    color1_hex: string;
    color1_name: string;
    color2: number[];
    color2_hex: string;
    color2_name: string;
}