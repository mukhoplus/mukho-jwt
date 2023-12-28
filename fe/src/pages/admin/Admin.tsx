import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Decoded from "../../../interface/Decoded";
import { decodeJwtToken } from "../../utils/DecodeJwtToken";

const GRANT: string = sessionStorage.getItem("grant") || "";
const TOKEN: string = sessionStorage.getItem("token") || "";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string>("");

  const handleNotice = async (): Promise<void> => {
    const headers: object = {
      Authorization: `${GRANT} ${TOKEN}`,
    };

    await axios
      .get("http://localhost:8080/api/member/admin", { headers })
      .then((res) => {
        setNotice(res.data);
      })
      .catch((e) => {
        if (e.response.status === 403) {
          alert("권한이 없습니다.");
          navigate("/");
        }
      });
  };

  useEffect(() => {
    handleNotice();
  }, []); // eslint-disable-line

  if (!TOKEN) {
    return <></>;
  }

  const decoded: Decoded = decodeJwtToken(TOKEN);
  if (decoded.auth !== "ROLE_ADMIN") {
    return <></>;
  }

  return (
    <div className="admin">
      <h2>{notice}</h2>
      <a href="/info">뒤로 가기</a>
    </div>
  );
};

export default Admin;
