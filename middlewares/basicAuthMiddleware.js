
module.exports=((req,res,next)=>{
    try{
      let username  = req.body.username
      let password = req.body.password
     
         if(!username && !password){
          //  helper.duplicate(res,'token is empty please add token in header')
             res.status(400).json({
                 'statusCode':400,
                'message':'Username and Password is required for Basic Authentication!'})
         }
         else{
            if(username == 'admin' && password == 'admin'){
              next()
            }
         else{
           res.status(404).json({
             'statusCode':404,
             'message':'Enter valid Username and Password!'
           })
         }
         }
      
    }
    catch(error){
         console.log(error)
        res.status(401).json({
            'statusCode':401,
            'message':'Basic authentication required!'})
    }
   

})