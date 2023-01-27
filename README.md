# Hi-Fyve

A web-app built using the VENTS stack allowing for users to view, edit, and generate data about their Spotify usage. 
- <strong>This project is LIVE and operating on a closed beta.
- While Hi-Fyve is LIVE</strong>, it is <strong>not</strong> available for public use due to our pending approval of public use from Spotify for utilization of its API. 
  - To request to be added to view the product, please send an email to `jl11701@nyu.edu` with the subject `Hi-Fyve Access Request`, containing your name and the email address your Spotify account is associated with.

#### Already have access, or just want to check out the site regardless of accessibility? You can check it out <a href="https://Hi-Fyve.herokuapp.com/">here!</a>

## Navigate
- [`About`](#about)
- [`Tech Stack`](#tech-stack)
- [`Details`](#details)
  - [`Hi-Fyve`](#hi-fyve-analytics)
  - [`User Analytics`](#user-analytics)
  - [`Synesthesia`](#synesthesia)
  - [`Worldwyde Analytics`](#worldwyde-analytics)

## **About**

Hi-Fyve allows for a user to view their Spotify statistics and fetch unique data generated for their account from their statistics by linking their Spotify accounts to our service. A user sends requests from the frontend to Hi-Fyve's backend for specific information regarding specific inquiries `ex: user's top tracks vs user's top songs` and the backend returns an object containing all relevant information. The frontend parses this information and displays it in a digestible formation for the user to view/understand.

All of Hi-Fyve's generated information/colors is unique to each user, and displays different sets of information/colors from each individual user's listening habits.

## **Tech Stack**

Hi-Fyve is built on the <strong>V.E.N.TS</strong> tech stack of various libraries and frameworks to accomplish its use case, which includes:
- Vue.js
- Express.js
- Node.js
- TypeScript

## Details

Here, we will breakdown each individual feature of Hi-Fyve and detail what tech was used where and how Hi-Fyve utilizes it to produce a smooth listening analysis experience.

### <ins>**Hi-Fyve Analytics**</ins>
This page was built on TypeScript in Vue3 utilizing the Composition API. The user is presented with a menu of different time-periods and a type of data analysis, primarily `top tracks v. top artists`. The user then selects the information they wish to see, which sends a `GET` request to Hi-Fyve's backend, written in TypeScript in a Node.js and Express.js environment. 

Upon reception of the request, the backend parses the information requested and sends another corresponding `GET` request to the Spotify API. Upon reception of data, it parses the object for relevant information and sends said object back to the frontend. Then, the frontend parses the object for relevant information and displays it in a digestible format for the user to view.

The frontend also adds descriptors to each track displayed based off of its analytics and the standard deviation that each analytics falls under from Spotify's overall track set. These calculations are performed on the frontend, after the data has been received from the backend.

### <ins>**User Analytics**</ins>
This page was also built on TypeScript in Vue3 utilizing the Composition API. Upon page load, the user's listening data is automatically fetched from the backend to create the user's generated analytics. These analytics are all statistics found within Spotify's API which includes, but is not limited to:
- Danceability
- Energy
- Loudness (dB LUFS)
- Speechiness
- Acousticness
- Instrumentalness
- Liveness
- Valence
- Tempo (bpm)
- Duration (minutes : seconds)
- Percentage of Explicit Tracks
- Average Track Popularity

These statistics are then averaged and rounded to the nearest hunderedth of a percent and displayed to the user in a digestible format following the website's design. The user can choose a different time frame, be it either one month, six months, or from the day they created their Spotify account, and the statistics will be re-calculated. 

The user can also compare their statistics with the Top 50 most played songs of a particular country. This is calculated by pulling the songs from a country's Top 50 playlist, a collection of songs most played in the last week within a certain country automatically created from Spotify, analyzing each track, averaging these new statistics, and sending over the finalized object to the frontend. The frontend then takes this object, parses the data, and displays it in a way where both the user's statistics and the country's statistics are juxtaposed with statistics being highlighted from each to show whether one side's metric was greater, less, or equal to the other side's metric. The user is then able to select whatever country they wish to view statistic from, which recalculates this comparison again.

### <ins>**Synesthesia**</ins>
Like the rest of the frontend, this page was built on TypeScript in Vue3 utilizing the Composition API. Upon page load, the user is presented with a menu that allows the user to choose either to make their own statistical visualization with their specific parameters or allow the site to randomly generate it with random parameters. This request is then sent to the backend, which pulls data from the Spotify API about a user's listening habits from their specified time period. The backend then generates colors based off of the statistics of the user's listening habits. 

After the frontend receives this information, it utilizes the `p5.js` and `p5.sound.js` libraries to create an audio visualizer that the user can use to play a snippet of a selected song (the user is able to change what song is displayed, which in turn recalculates the colors displayed). The user is also able to view a colorboard of 6 generated colors based off of the information provided to Synesthesia. The user is able to shuffle the colors (swap the r,g,b, values in each color around) and share their board via a link that transforms their Polaroid board to a downloadable image.

### <ins>**Worldwyde Analytics**</ins>
Mirroring the trend, this page was also built on TypeScript in Vue3 utilizing the Composition API. Upon page load, the user is presented with a menu that allows for them to view either the Top 50 most played tracks by country, Top 50 most Viral tracks by country, or compare up to three countries and view their differing statistics. 

For the Top 50 Most Viral or Top 50 Most Played Tracks by country, the statistics and tracks are pulled using Hi-Fyve's backend from Spotify's autogenerated playlists of tracks that are either the most viral or the most played in the past week, which is then sent to the frontend as an Object. This object is then parsed and displayed in a digestible format for the user to view.

For the Country Comparison, the frontend sends a request to Hi-Fyve's backend to parse each requested track's playlist (`Top 50 Played vs Top 50 Viral`). These statistics are all statistics found within Spotify's API which includes, but is not limited to:
- Danceability
- Energy
- Loudness (dB LUFS)
- Speechiness
- Acousticness
- Instrumentalness
- Liveness
- Valence
- Tempo (bpm)
- Duration (minutes : seconds)
- Percentage of Explicit Tracks
- Average Track Popularity

After these tracks are pulled, they are each analyzed for their attributes. This data is then averaged and sent over to the frontend as a JSON Object. The frontend parses this object into a digestible format following the website's design.The user is then able to see each country's statistics, alongside the differences between each country and the greatest & least value for each attribute, and which country it came from.

The frontend also adds descriptors to each track displayed based off of its analytics and the standard deviation that each analytics falls under from Spotify's overall track set. These calculations are performed on the frontend, after the data has been received from the backend.
