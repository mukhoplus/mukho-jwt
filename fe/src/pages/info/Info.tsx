import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Decoded from "../../../interface/Decoded";
import UserInfo from "../../../interface/UserInfo";
import { decodeJwtToken } from "../../utils/DecodeJwtToken";

const GRANT: string = sessionStorage.getItem("grant") || "";
const TOKEN: string = sessionStorage.getItem("token") || "";

const initUserInfo: UserInfo = {
  id: 0,
  loginId: "",
  name: "",
};

const Info: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({ ...initUserInfo });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const getUserInfo = async (): Promise<void> => {
    const headers: object = {
      Authorization: `${GRANT} ${TOKEN}`,
    };

    if (TOKEN) {
      const decoded: Decoded = decodeJwtToken(TOKEN);
      const userId: number = decoded.userId;

      if (decoded.auth === "ROLE_ADMIN") {
        setIsAdmin(true);
      }

      await axios
        .get(`http://localhost:8080/api/member/info/${userId}`, { headers })
        .then((res) => {
          const data: UserInfo = res.data.data;
          setUserInfo(data);
        })
        .catch((e) => {
          alert("아이디와 비밀번호를 확인해주세요."); // 400
        });
    }
  };

  const handleLogout = (): void => {
    sessionStorage.clear();
    setUserInfo({ ...initUserInfo });
    setIsAdmin(false);
    window.location.href = "/";
  };

  useEffect(() => {
    if (!TOKEN) {
      navigate("/");
    }
    getUserInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!TOKEN) {
    return <></>;
  }

  return (
    <div className="info">
      <div className="header">
        <h1>정보</h1>
        {isAdmin && <button onClick={() => navigate("/admin")}>운영자</button>}
        <button onClick={handleLogout}>로그아웃</button>
      </div>
      <div className="userInfo" style={{ textAlign: "left" }}>
        <p>no: {userInfo.id}</p>
        <p>아이디: {userInfo.loginId}</p>
        <p>이름: {userInfo.name}</p>
        <p>권한: {isAdmin ? "운영자" : "유저"}</p>
      </div>
    </div>
  );
};

export default Info;
