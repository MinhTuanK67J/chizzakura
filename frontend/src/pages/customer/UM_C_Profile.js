import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import styles from "../../styles/customer/CProfile.module.css";
import { useTable } from "../../contexts/TableContext";

// import defaultAvtPic from "../../assets/Image_C/default_avt.jpg";

import C_Footer from "../../components/customer/C_Footer";
import C_Header from "../../components/customer/C_Header";

const UM_C_Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const { state, dispatch } = useTable();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8080/UM/user-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUserInfo(response.data);
          console.log("User info:", response.data);
        } else {
          console.error("Error fetching user info:", response.error);
        }
      } catch (error) {
        console.error(
          "Error fetching user info:",
          error.response || error.message
        );
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!userInfo?.id) {
        alert("User not found");
        return;
      }
      await axios.put(
        `http://localhost:8080/UM/update-customer/${userInfo.id}`,
        userInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error.response || error.message);
      alert("Error updating user");
    }
  };

  const handleLogOut = () => {
    dispatch({ type: "REMOVE_TABLE_NUMBER" });
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart");
    sessionStorage.removeItem("tableNo");
    navigate("/login");
  };

  return (
    <div className={styles["profile-page"]}>
      {/* Header */}
      <C_Header />

      <div className={styles["profile-container"]}>
        <button className={styles["log-out-btn"]} onClick={handleLogOut}>
          Log out
        </button>
        {/* <div className={styles["profile-pic"]}>
          
          <img src={userInfo?.avatar || defaultAvtPic} alt="profile" />
          <div className={styles["select-avt"]}>
            <label
              htmlFor="upload-input"
              className={`${styles["upload-input"]} ${styles["edit-image"]}`}
            >
              Tải lên từ máy của bạn
              <input
                type="file"
                id="upload-input"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
    
            <div className={styles["choose-btn"]}>
              <button className={styles["update-btn"]} onClick={handleSave}>
                Accept
              </button>
              <button className={styles["cancel-btn"]}>Cancel</button>
            </div>
          </div>
        </div> */}

        <div className={styles["user-info"]}>
          <h2 className={styles["title-user-info"]}>User Information</h2>

          <form className={styles["user-info-form"]}>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={userInfo?.first_name || ""}
              onChange={handleChange}
            />

            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userInfo?.last_name || ""}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={userInfo?.email || ""}
              onChange={handleChange}
            />
          </form>
        </div>

        <button className={styles["save-btn"]} onClick={handleSave}>
          Save
        </button>

        {/* <div className={styles["change-password"]}>
          <h2 className={styles["title-change-password"]}>Change Password</h2>

          <form className={styles["change-password-form"]}>
            <label>Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword || ""}
              onChange={handlePasswordChange}
            />

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword || ""}
              onChange={handlePasswordChange}
            />
          </form>

          <button className={styles["save-btn"]} onClick={handleChangePassword}>
            Change Password
          </button>
        </div> */}
      </div>

      {/* Footer */}
      <C_Footer />
    </div>
  );
};

export default UM_C_Profile;
