import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';


const { width, height } = Dimensions.get('window');

export default function MapWithAvatar() {
  const [position, setPosition] = useState({
    latitude: 35.0266,
    longitude: 135.7809,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    let locationSubscription;
  
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
  
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,       // 2秒ごと
          distanceInterval: 1,      // 1m移動ごと
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition({ latitude, longitude });
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 500);
        }
      );
    })();
  
    // クリーンアップ（アンマウント時に監視を止める）
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);
  
  

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const dx = gesture.dx / 10000;
        const dy = gesture.dy / 10000;

        setPosition((prev) => {
          const newPos = {
            latitude: prev.latitude - dy,
            longitude: prev.longitude + dx,
          };
          mapRef.current.animateToRegion({ ...newPos, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 100);
          return newPos;
        });
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...position,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={position} title="あなた" />
      </MapView>

      <View style={styles.joystickArea} {...panResponder.panHandlers} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  joystickArea: {
    position: 'absolute',
    bottom: 40,
    left: width / 2 - 75,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,0,255,0.2)',
    zIndex: 10,
  },
});




// 編集しました。
//HiTaが打ちました



//ログイン機能のつもりです。
// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidGmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@st\.kyoto-u\.ac\.jp$/.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!isValidGmail(email)) {
      setError("st.kyoto-u.ac.jp のメールアドレスのみ使用できます。");
      return;
    }

    if (!password) {
      setError("パスワードを入力してください。");
      return;
    }

    // プロトタイプ用の仮ログイン処理
    if (email === "test@gmail.com" && password === "password") {
      localStorage.setItem("token", "dummy-token");
      navigate("/dashboard");
    } else {
      setError("メールアドレスまたはパスワードが違います。");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="メールアドレス (gmail.com 限定)"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          value={password}
          placeholder="パスワード"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          ログイン
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
