import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?:string;
  username?:string;
  accessToken?:string;
  isLoggedIn:boolean
}

export const defaultSession:SessionData = {
  isLoggedIn:false
}

export const sessionOptions: SessionOptions ={
  password: "testpasldkjgepjgkslđjfsdfgd65a54a6a4va45DF45SDF4G1V8S8d51afgds",
  cookieName: "l-session",
  cookieOptions:{
    httpOnly:true,
    secure: false,
  }
}