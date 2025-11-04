let axios = require('axios');
async function handletopmoviedetails(req, res) {
    try {
        let {page} = req.query;
        console.log("page", page)
        let response = await  axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=2548a82cdbcc3c2703fceec99fee278e&page=${page}`);
        return res.status(200).json(response.data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = handletopmoviedetails;