const urlVersioning = (version) => (req, res, next) => {
  if (req.path.startsWith(`/api/${version}`)) {
    next();
  } else {
    res
      .status(404)
      .json({ success: false, message: "API version not supported" });
  }
};

const headerVersioning = (version)=>(req,res,next)=>{
    if(req.get('Accept-Version') === version){
        next()
    }
}

const contentTypeVersioning = (version)=>(req,res,next)=>{
    const contentType = req.get('Content-Type')
    if(contentType && contentType.includes(`application/vnd.api${version}+json`)){
        next()
    }
}

module.exports = {urlVersioning,headerVersioning,contentTypeVersioning}