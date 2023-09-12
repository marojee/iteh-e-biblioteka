import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      //provera emaila
      "email": req.body.email
    })
    if (!user)
      return res.status('401').json({
        error: "User not found"
      })
      //provera sifre 
    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }
    //token - tokenizacija pri loginovanju
    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret)
    //nbt
    res.cookie("t", token, {
      expire: new Date() + 9999
    })
    // vracas korisnikov token i njegovog usera 
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        educator: user.educator
      }
    })

  } catch (err) {

    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}
//logout- obrisi cookie /cash memorija
const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}
// ovo mora i to sluzi da sakrije sifru
const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})
// neko moze da radi nesto u aplikaciji a neko ne
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}
//exportujes sve funkcije da bi ih pozvao u rutama
export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
