import { getData } from "./getData";
/**
 * @param {string} userId 
 * @param {string} userToken 
 * @param {string} userAuthCode
 * @param {string} targetUserID
 * @returns {boolean} isFollowing
*/
export async function isFollowing(userID, userToken, userAuthCode, targetUserID) {
    const response = await fetch("https://physics-api-cn.turtlesim.com:443/Users/GetRelations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-API-Token": userToken,
        "x-API-AuthCode": userAuthCode,
      },
      body: {
        "UserID": userID,
        "DisplayType": 1,
        "Skip": 0,
        "Take": 99999,
        "Query": targetUserID,
      }
  });
  return response.json().Status==200;
}