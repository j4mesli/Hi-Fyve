export interface songStatistics {
    danceability: number,
    energy: number,
    loudness: number,
    speechiness: number,
    acousticness: number,
    instrumentalness: number,
    liveness: number,
    valence: number,
    tempo: number,
    duration_ms: number,
    explicit?: number,
    popularity?: number,
}