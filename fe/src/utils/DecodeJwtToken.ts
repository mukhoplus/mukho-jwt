import Decoded from "../../interface/Decoded";

export const decodeJwtToken = (token: string): Decoded => {
  const segments = token.split(".");
  const payload = JSON.parse(decodeURIComponent(atob(segments[1])));

  return payload;
};
