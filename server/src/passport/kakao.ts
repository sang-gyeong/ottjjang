import * as passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import User from "../entities/User";

const passportKakaoConfig = (): void => {
  const kakaoStrategyOptions = {
    clientID: process.env.KAKAO_CLIENT_ID as string, // 카카오 로그인에서 발급받은 REST API 키
    callbackURL: process.env.KAKAO_CALLBACK_URL as string, // 카카오 로그인 Redirect URI 경로
    clientSecret: process.env.KAKAO_CLIENT_SECRET as string, // 카카오 로그인 보안 강화를 위한 client_secret 키
  };

  // Provider의 토큰은 사용하지 않음 (_ : accessToken __ : refreshToken)
  const kakaoVerify = async (
    _: string,
    __: string,
    profile: any,
    done: any
  ): Promise<void> => {
    console.log("kakao profile : ", profile);

    try {
      const {
        id: kakaoId,
        username: nickname,
        _json: {
          properties: { profile_image },
        },
      } = profile;

      let user = await User.findOne({ kakaoId });
      // 이미 가입된 카카오 프로필이면 성공
      if (user) {
        user.kakaoId = kakaoId;
        done(null, user); // 로그인 인증 완료
      } else {
        // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
        user = new User();
        user.kakaoId = kakaoId;
        user.nickname = nickname ?? "";
        user.profileURL = profile_image;
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  };
  passport.use("kakao", new KakaoStrategy(kakaoStrategyOptions, kakaoVerify));
};

export default passportKakaoConfig;
