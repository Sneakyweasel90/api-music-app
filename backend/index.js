import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

console.log("Groq API key loaded:", GROQ_API_KEY ? "Yes" : "No");

async function queryGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.8,
      max_tokens: 1000
    })
  });

  return await response.json();
}

// Enhanced fallback function
function generateSmartPlaylist(mood, genre) {
  const songDatabase = {
    chill: {
      lofi: [
        { title: "Moonlight Sonata Lo-Fi", artist: "ChillBeats Collective", description: "Classical meets modern chill vibes" },
        { title: "Study Session", artist: "Lo-Fi Dreams", description: "Perfect background music for focus" },
        { title: "Rainy Window", artist: "Mellow Sounds", description: "Cozy vibes for introspective moments" },
        { title: "Coffee Shop Ambience", artist: "Urban Chill", description: "Warm lo-fi beats with vinyl crackle" },
        { title: "Late Night Drive", artist: "Nostalgic Sounds", description: "Dreamy lo-fi for peaceful moments" }
      ],
      jazz: [
        { title: "Smooth Evening", artist: "Jazz Lounge Collective", description: "Sophisticated and relaxing jazz" },
        { title: "Coffee House Blues", artist: "Urban Jazz Trio", description: "Perfect for a quiet evening" },
        { title: "Midnight Sax", artist: "Cool Jazz Masters", description: "Smooth saxophone melodies" },
        { title: "City Lights", artist: "Modern Jazz Ensemble", description: "Contemporary jazz with classic vibes" },
        { title: "Sunday Morning", artist: "Chill Jazz Society", description: "Laid-back jazz for lazy mornings" }
      ],
      indie: [
        { title: "Golden Hour", artist: "Indie Collective", description: "Dreamy indie with soft vocals" },
        { title: "Coastal Drive", artist: "Beach House Vibes", description: "Ethereal sounds for peaceful moments" },
        { title: "Paper Planes", artist: "Bedroom Pop", description: "Gentle indie with nostalgic feel" },
        { title: "Fading Polaroids", artist: "Soft Focus", description: "Melancholic indie for reflection" },
        { title: "Sunday Afternoon", artist: "Lazy Sunday", description: "Relaxing indie with acoustic elements" }
      ]
    },
    energetic: {
      rock: [
        { title: "Thunder Road", artist: "Electric Storm", description: "High-energy rock with powerful drums" },
        { title: "Break Free", artist: "Neon Lightning", description: "Motivational rock anthem" },
        { title: "Rise Up", artist: "Steel Phoenix", description: "Empowering guitar-driven track" },
        { title: "Fire Within", artist: "Rebel Hearts", description: "Explosive rock with driving bass" },
        { title: "Never Give Up", artist: "Victory Lane", description: "Inspirational rock with soaring vocals" }
      ],
      pop: [
        { title: "Dance All Night", artist: "Pop Stars", description: "Upbeat pop with infectious energy" },
        { title: "Feel Good Vibes", artist: "Sunshine Music", description: "Happy, danceable pop hit" },
        { title: "Electric Dreams", artist: "Neon Pop", description: "Synth-heavy energetic pop" },
        { title: "Summer Anthem", artist: "Party Wave", description: "High-energy pop perfect for parties" },
        { title: "Unstoppable", artist: "Pop Revolution", description: "Empowering pop with catchy hooks" }
      ],
      electronic: [
        { title: "Digital Dreams", artist: "Synth Masters", description: "High-energy electronic with great beats" },
        { title: "Neon Nights", artist: "EDM Collective", description: "Pumping electronic dance music" },
        { title: "Cyber Rush", artist: "Future Bass", description: "Intense electronic with heavy drops" },
        { title: "Electric Pulse", artist: "Bass Brigade", description: "Driving electronic with powerful rhythm" },
        { title: "Laser Show", artist: "Rave Nation", description: "Festival-ready electronic dance track" }
      ]
    },
    sad: {
      indie: [
        { title: "Midnight Thoughts", artist: "Melancholy Moon", description: "Introspective indie for emotional moments" },
        { title: "Empty Streets", artist: "Quiet Storm", description: "Haunting vocals with gentle instrumentation" },
        { title: "Rainy Days", artist: "Solitude", description: "Melancholic indie with piano elements" },
        { title: "Lost Letters", artist: "Broken Hearts Club", description: "Emotional indie about lost love" },
        { title: "Grey Skies", artist: "Sad Sunday", description: "Atmospheric indie for contemplation" }
      ],
      alternative: [
        { title: "Fading Light", artist: "Echo Valley", description: "Emotional alternative rock ballad" },
        { title: "Lost in Time", artist: "Shadow Hearts", description: "Melancholic alternative with deep lyrics" },
        { title: "Silent Screams", artist: "Inner Demons", description: "Powerful alternative about inner struggles" },
        { title: "Broken Glass", artist: "Shattered Dreams", description: "Raw alternative with emotional vocals" },
        { title: "End of Days", artist: "Final Chapter", description: "Dark alternative with haunting melodies" }
      ]
    },
    happy: {
      pop: [
        { title: "Sunshine Day", artist: "Happy Collective", description: "Uplifting pop with bright melodies" },
        { title: "Good Vibes Only", artist: "Positive Energy", description: "Feel-good pop anthem" },
        { title: "Dancing Queen", artist: "Joy Factory", description: "Celebratory pop with infectious rhythm" },
        { title: "Best Day Ever", artist: "Smile Brigade", description: "Optimistic pop about good times" },
        { title: "Pure Joy", artist: "Happy Hearts", description: "Upbeat pop that makes you smile" }
      ],
      folk: [
        { title: "Country Road", artist: "Folk Tales", description: "Cheerful acoustic folk song" },
        { title: "Summer Breeze", artist: "Acoustic Dreams", description: "Light-hearted folk with storytelling" },
        { title: "Sunshine Folk", artist: "Happy Trails", description: "Uplifting folk with harmonica" },
        { title: "Mountain Song", artist: "Nature's Call", description: "Joyful folk celebrating the outdoors" },
        { title: "Campfire Stories", artist: "Wandering Souls", description: "Feel-good folk with group vocals" }
      ]
    }
  };

  const moodKey = mood.toLowerCase();
  const genreKey = genre.toLowerCase();
  
  let songs = songDatabase[moodKey]?.[genreKey] || [];
  
  // If no exact match, get songs from the mood category
  if (songs.length === 0 && songDatabase[moodKey]) {
    const allMoodSongs = Object.values(songDatabase[moodKey]).flat();
    songs = allMoodSongs.slice(0, 5);
  }
  
  // If still no songs, create generic ones
  if (songs.length === 0) {
    for (let i = 0; i < 5; i++) {
      songs.push({
        title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Track ${i + 1}`,
        artist: "Various Artists",
        description: `A ${mood} ${genre} song perfect for your mood`
      });
    }
  }

  return songs.slice(0, 5);
}

app.post("/playlist", async (req, res) => {
  const { mood, genre } = req.body;

  try {
    // Try Groq API first (if you have API key)
    if (GROQ_API_KEY) {
      const prompt = `Generate a JSON array of exactly 5 ${genre} songs that match a ${mood} mood. 
      
      Use this EXACT format:
      [
        {"title": "Song Name", "artist": "Artist Name", "description": "Brief description"},
        {"title": "Song Name", "artist": "Artist Name", "description": "Brief description"},
        {"title": "Song Name", "artist": "Artist Name", "description": "Brief description"},
        {"title": "Song Name", "artist": "Artist Name", "description": "Brief description"},
        {"title": "Song Name", "artist": "Artist Name", "description": "Brief description"}
      ]
      
      Return ONLY the JSON array, nothing else.`;
      
      console.log("Trying Groq API...");
      const groqResponse = await queryGroq(prompt);
      
      if (groqResponse.choices && groqResponse.choices[0]) {
        try {
          const content = groqResponse.choices[0].message.content.trim();
          // Try to extract JSON from the response
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const playlist = JSON.parse(jsonMatch[0]);
            console.log("Groq API success!");
            return res.json(playlist);
          }
        } catch (e) {
          console.log("Groq response parsing failed:", e.message);
        }
      }
    }

    // Fallback to smart generated playlist
    console.log(`Using curated playlist for ${mood} ${genre}`);
    const playlist = generateSmartPlaylist(mood, genre);
    res.json(playlist);

  } catch (error) {
    console.error("Error:", error.message);
    // Always fallback to generated playlist
    const playlist = generateSmartPlaylist(mood, genre);
    res.json(playlist);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));