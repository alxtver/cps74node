const Part = require("../models/part");

exports.getMainPage = (req, res) => {
  res.render("themes", {
    title: "Темы",
  });
};

exports.getAllThemes = async (req, res) => {
  try {
    const parts = await Part.find().sort({
      created: -1,
    });
    res.send(JSON.stringify({ parts }));
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "server error!" });
  }
};

exports.createPart = async (req, res) => {
    const part = new Part({
        part: req.body.part,
    });
    try {
       const createdPart = await part.save();
        res.send(JSON.stringify(createdPart));
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error!" });
    }
};
