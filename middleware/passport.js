const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config/key')
const User = require('../models/User')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.JWT
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options,async (payload,done)=>{
            try{
                const user = await User.findById(payload.userID).select('email id')
                if(user){
                    done(null,user)
                }
                else{
                    done(null,false)
                }
            }
            catch(error){
                console.log(error)
            }

        })
    )
}