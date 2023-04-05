const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../model/user");
const passport = require("passport");
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
ExtractJwt.fromAuthHeaderWithScheme("jwt");
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await UserModel.findOne({ _id: jwt_payload.id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);
