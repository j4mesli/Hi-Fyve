import { ArrayOfCountriesThatNeedTheBeforeThem } from "../interfaces/ArrayOfCountriesThatNeedTheBeforeThem";
import { millisecondsToMinutesAndSeconds } from "./millisecondsToMinutesAndSeconds";

// adds 'The' to certain countries
const handleCountryName = (country: string) => {
    return ArrayOfCountriesThatNeedTheBeforeThem.includes(country) ? country === 'Global' ? 'The World' : 'The ' + country : country;
}

export const fillInTheBlank = (data: [country: string, value: number], type: string, isMax: boolean) => {
    switch (type) {
        case "explicit":
            return isMax ? 
                `Do you kiss your mother with that mouth?! ${handleCountryName(data[0])} has the dirtiest taste, with ${+(data[1]*100).toFixed(2)}% of their songs being explicit!`
                : `Think of the children! At least, that's what ${handleCountryName(data[0])} is doing, with only ${+(data[1]*100).toFixed(2)}% of their songs being explicit! They like their family shows!`;
        case "popularity":
            return isMax ?
                `How basic! ${handleCountryName(data[0])} has the most mainstream taste, with an average track popularity rating of ${data[1]}%. Talk about an alkaline ear!`
                : `${handleCountryName(data[0])} likes their toast with avocado and their music obscure, with an average track popularity rating of ${data[1]}%. What hipsters!`;
        case "tempo":
            return isMax ?
                `I am speed. Kerchoo. At least, that's what ${handleCountryName(data[0])} wants their music taste to be, with an average track bpm of ${+Math.round(data[1]).toFixed(2)} beats per minute!`
                : `Slow and steady wins the race! At least, that's what ${handleCountryName(data[0])} believes, with an average track bpm of ${+Math.round(data[1]).toFixed(2)} beats per minute!`;
        case "acousticness":
            return isMax ?
                `${handleCountryName(data[0])} doesn't like autotune, with an average of ${+(data[1]*100).toFixed(2)}% of each track being acoustic. Carpe Diem!`
                : `Wub wub wub wub wub! ${handleCountryName(data[0])}'s music uses more keyboard ⌨️ than keyboard 🎹, with an average of only ${+(data[1]*100).toFixed(2)}% of each track not being electronically generated.`;
        case "danceability":
            return isMax ?
                `${handleCountryName(data[0])} doesn't apologize for Party Rocking, what with an average track danceability of ${+(data[1]*100).toFixed(2)}% and all. To ${handleCountryName(data[0])}, every day is Friday.`
                : `Don't worry, André! ${handleCountryName(data[0])} definitely hears you, as with an average track danceability of ${+(data[1]*100).toFixed(2)}%, they definitely pay attention to what they listen to.`;
        case "duration_ms":
            return isMax ?
                `${handleCountryName(data[0])} uses nested for loops to solve TwoSum, as with an average track duration of ${millisecondsToMinutesAndSeconds(+(data[1]).toFixed(0))}, they don't mind an exponential run time!`
                : `With their national animal being Sonic the Hedgehog, ${handleCountryName(data[0])} likes everything fast. Their music is no exception, as with an average track duration of ${millisecondsToMinutesAndSeconds(+(data[1]).toFixed(0))}, they don't like to waste time!`;
        case "energy":
            return isMax ?
                `Like the frat house down the block, ${handleCountryName(data[0])} thrives on high energy songs. With an average track energy of ${+(data[1]*100).toFixed(2)}%, they don't like to take things easy.`
                : `${handleCountryName(data[0])} likes to meditate while listening to music, as with an average track energy of ${+(data[1]*100).toFixed(2)}%, they greatly value their R&R.`;
        case "instrumentalness":
            return isMax ?
                `${handleCountryName(data[0])} appreciates a good orchestra every now and again. With an average track instrumental interval of ${+(data[1]*100).toFixed(2)}%, they like to hear some instruments in their songs!`
                : `${handleCountryName(data[0])} likes to sing acapella, as with an average of only ${+(data[1]*100).toFixed(2)}% of each track being instrumental, singing comes first to ${handleCountryName(data[0])}!`;
        case "liveness":
            return isMax ?
                `A country of concert-goers, ${handleCountryName(data[0])} appreciates good live music. They even listen to it on Spotify, with an average track liveness of ${+(data[1]*100).toFixed(2)}%. Introversion? Not for them!`
                : `${handleCountryName(data[0])} prefers its videogames over parties, as with an average track liveness of ${+(data[1]*100).toFixed(2)}%, they're more content with staying indoors. All ${handleCountryName(data[0])} needs is themselves!`;
        case "loudness":
            return isMax ?
                `With an average track loudness of ${+data[1].toFixed(2)} dB LUFS, ${handleCountryName(data[0])} parties loudly and proudly. It's safe to say that ${handleCountryName(data[0])} goes to concerts without earplugs.`
                : `Shhh! ${handleCountryName(data[0])} respects quiet time, as with an average track loudness of ${+data[1].toFixed(2)} dB LUFS, they want to both listen to their music and respect their sleeping neighbors.`;
        case "speechiness":
            return isMax ?
                `${handleCountryName(data[0])} won't mind if you talk at the movies, as with an average track speechiness of ${+(data[1]*100).toFixed(2)}%, they even like talking in their music!`
                : `Less talk, more song! With an average track speechiness of ${+(data[1]*100).toFixed(2)}%, ${handleCountryName(data[0])} doesn't take kindly to talking in song.`;
        case "valence":
            return isMax ?
                `${handleCountryName(data[0])} likes their music as happy as can be. With an average track valence of ${+(data[1]*100).toFixed(2)}%, they appreciate music that puts a smile on your face!`
                : `At ${handleCountryName(data[0])}, the people like their music more downtrodden. With an average track valence of ${+(data[1]*100).toFixed(2)}%, they prefer the soulful stuff!`;
        // default case will never be reached
        default:
            return '';
    }
}