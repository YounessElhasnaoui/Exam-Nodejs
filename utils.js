const verifyJoke = (author,joke)=>{
    if(!author)
        return {status:false, msg:"author is required"}

    if(!joke)
        return {status:false, msg:"joke is required"}
   
    if(joke.length<=5)
        return  {status:false, msg:"joke must contains at least 5 caracters"}

    return {status:true, msg:""}
}
const middlewareVerification  = (req,res,next)=>{

    let {author,joke} = req.body
    
    let {status,msg} = verifyJoke(author,joke)
    if(status)
        return next()
    res.status(400).json({status:"error",msg: msg})
}
module.exports={
    middlewareVerification
}