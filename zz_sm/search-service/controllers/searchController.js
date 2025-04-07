const Search = require("../models/Search");
const searchPostController = async (req, res) => {
  try {
    const { query } = req.query;


    const result = await Search.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    ).sort({score: { $meta: "textScore" }}).limit(10)


    res.json(result)
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { searchPostController };
