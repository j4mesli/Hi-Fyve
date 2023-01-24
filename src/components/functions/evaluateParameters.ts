// stats from https://rstudio-pubs-static.s3.amazonaws.com/865163_48e1876017ed4375b5885fb9eebd4f89.html
import { SpotifyTrackAttributes } from "../interfaces/SpotifyTrackAttributes";
import { handleTrackAttribute } from "../interfaces/handleTrackAttribute";

interface output {
    acousticness?: [string, number];
    liveness?: [string, number];
    danceability: [string, number];
    energy: [string, number];
    valence: [string, number];
} 

export const evaluateParameters = (attrs: SpotifyTrackAttributes) => {
    const acousticness: handleTrackAttribute = { acousticness: attrs.acousticness as number };
    const danceability: handleTrackAttribute = { danceability: attrs.danceability as number };
    const energy: handleTrackAttribute = { energy: attrs.energy as number };
    const liveness: handleTrackAttribute = { liveness: attrs.liveness as number };
    const valence: handleTrackAttribute = { valence: attrs.valence as number };
    const obj: output = {
        // ternary format as follows:
        /// handle left skew
        //// +3std ? 'string' : +2std ? 'string' : +1std : 'string' : 0std: 'string' : undefined
        // OR
        /// handle minimal/no skew
        //// +2std ? 'string' : +1std ? 'string' : 0std ? 'string' : -1std ? 'string' : 'string'
        acousticness: 
            acousticness.acousticness >= .68 ? ['Acoustic', 3]
            : acousticness.acousticness >= .52 ? ['Rhythmic', 2]
            : acousticness.acousticness >= .35 ? ['Cadenced', 1]
            : acousticness.acousticness >= .18 ? ['Mellifluous', 0]
            : undefined,
        liveness: 
            liveness.liveness >= .51 ? [ 'Exuberant', 3]
            : liveness.liveness >= .41 ? [ 'Vivacious', 2]
            : liveness.liveness >= .30 ? [ 'Lively', 1]
            : liveness.liveness >= .19 ? [ 'Spirited', 0]
            : undefined,
        energy: 
            energy.energy >= .95 ? [ 'Envigorating', 2 ]
            : energy.energy >= .83 ? [ 'Animated', 1]
            : energy.energy >= .7 ? [ 'Dynamic', 0 ]
            : energy.energy >= .52 ? [ 'Energetic', -1 ]
            : energy.energy >= .34 ? [ 'Relaxed', -2 ]
            : [ 'Peaceful', -3 ],
        danceability: 
            danceability.danceability >= .87 ? [ 'Infectious', 3 ] 
            : danceability.danceability >= .80 ? [ 'Vibrant', 2 ] 
            : danceability.danceability >= .73 ? [ 'Kinetic', 1 ]
            : danceability.danceability >= .65 ? [ 'Catchy', 0 ] 
            : danceability.danceability >= .5 ? [ 'Upbeat', -1 ] 
            : danceability.danceability >= .35 ? [ 'Danceable', -2 ] 
            : [ 'Steady', -3 ],
        valence: 
            valence.valence >= .89 ? [ 'Radiant', 2 ]
            : valence.valence >= .70 ? [ 'Jovial', 1]
            : valence.valence >= .51 ? [ 'Bright', 0 ]
            : valence.valence >= .28 ? [ 'Stirring', -1 ]
            : valence.valence >= .05 ? [ 'Melancholic', -2 ]
            : [ 'Blue', -3 ]
    }
    if (obj.acousticness === undefined) {
        delete obj.acousticness;
    }
    if (obj.liveness === undefined) {
        delete obj.liveness;
    }
    return obj as unknown as { [key: string]: Array<string | number> };
}