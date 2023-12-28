import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginDto from "../../../interface/LoginDto";

const TOKEN: string = sessionStorage.getItem("token") || "";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    const loginDto: LoginDto = {
      loginId,
      password,
    };

    await axios
      .post("http://localhost:8080/api/member/login", loginDto)
      .then((res) => {
        const jwtToken = res.data.data;
        sessionStorage.setItem("grant", jwtToken.grantType);
        sessionStorage.setItem("token", jwtToken.accessToken);
        window.location.href = "/info";
      })
      .catch((e) => {
        alert("아이디와 비밀번호를 확인해주세요.");
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    if (TOKEN) {
      navigate("/info");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (TOKEN) {
    return <></>;
  }

  return (
    <div className="login">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div className="line">
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>
        <div className="line">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="btnLine">
          <button type="submit">로그인</button>
          <button onClick={() => navigate("/signup")}>회원가입</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
