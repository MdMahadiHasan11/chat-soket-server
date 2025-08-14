import { Response } from "express";
import { envVars } from "../../config/env";

export interface ITokenInfo {
  accessToken?: string;
  refreshToken?: string;
}
export const setCookie = async (res: Response, tokenInfo: ITokenInfo) => {
  if (tokenInfo.accessToken && tokenInfo.refreshToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
