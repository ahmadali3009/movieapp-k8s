let axios = require('axios');
async function handletopmoviedetails(req, res) {
    try {
        let {inputque} = req.body;
        console.log("geminiipoutquie" , inputque)
        let response = await axios(
            {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        data: {
          "contents": [{
            "parts": [{
              "text": `Give me the top 5 movies or TV shows similar to "${inputque}" and also show mostly does which are available in TMDB database then show others . Return the response as a JSON array with objects containing "title" and "reason" fields. The "reason" should be 100 words long and explain why this movie is similar to "${inputque}".`
            }]
          }]
        }
      })
   
    return res.status(200).json(response.data.candidates[0].content.parts[0].text
);

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = handletopmoviedetails;