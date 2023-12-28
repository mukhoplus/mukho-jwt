import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignUpDto from "../../../interface/SignUpDto";

const TOKEN: string = sessionStorage.getItem("token") || "";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const handleSignUp = async (): Promise<void> => {
    const signUpDto: SignUpDto = {
      loginId,
      password,
      name,
    };

    await axios
      .post("http://localhost:8080/api/member/signup", signUpDto)
      .then((res) => {
        alert("회원가입 되었습니다.");
        navigate("/");
      })
      .catch((e) => {
        alert("회원가입에 실패했습니다.");
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignUp();
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
      <h1>회원가입</h1>
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
        <div className="line">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="btnLine">
          <button type="submit">회원가입</button>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            뒤로가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
