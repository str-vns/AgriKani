import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createDriver, clearErrors } from "@redux/Actions/driverActions";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Error from "@shared/Error";
import { OTPregister } from "@redux/Actions/userActions";

const Otp = (props) => {
  const registration = props.route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const inputRefs = useRef([])
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { loading, error } = useSelector((state) => state.driverApi);
  const [errors, setErrors] = useState("");
  const [timer, setTimer] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        setToken(res);
      } catch (error) {
        console.error("Error retrieving JWT: ", error);
      }
    };
    fetchJwt();
  }, [dispatch]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.nativeEvent.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const Resend = () => {
      setIsDisabled(true);
      setTimer(7 * 60);
      dispatch(OTPregister({ email: registration.riderRegister.email }));
  }

  useEffect(() => {
    let interval;
    if (isDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000); 
    }

    if (timer === 0) {
      setIsDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isDisabled, timer])

  useEffect(() => {
    if (error) {
      setErrors("Wrong OTP entered. Please try again!");

      setTimeout(() => {
        dispatch(clearErrors());
        setErrors(""); 
      }, 1000); 
    }
  })
  
  const handleVerify = () => {
    const otpString = otp.join('');
    
    if (otpString.length < 6) {
      setErrors("Please fill the OTP");
    }

    const registerInfo = {
      otp: otpString,
      ...registration,  
    };
   
    dispatch(createDriver(registerInfo, token));

    setOtp(["", "", "", "", "", ""]);
    Alert.alert("Driver created successfully! Please Wait for Admin Approval");
    navigation.navigate("Riderlist");
  };
 

  return (
    <View style={styles.container}>


      <Text style={styles.title}>Phone verification</Text>
      <Text style={styles.subtitle}>Enter your OTP code</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(event) => handleKeyPress(index, event)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => inputRefs.current[index] = ref}
          />
        ))}
      </View>

      
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t receive code?</Text>
        <TouchableOpacity   onPress={Resend}
        disabled={isDisabled}  >
          <Text style={styles.resendButton}>{isDisabled
            ? `Resend available in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
            : "Resend again"}</Text>
        </TouchableOpacity>
      </View>

      {errors ? <Error message={errors} /> : null}
      <TouchableOpacity style={styles.verifyButton} 
       onPress={handleVerify} >
          {loading ? (<ActivityIndicator size="small" color="#fff" /> )
                : 
                (<Text style={styles.verifyText}>Verify</Text>)}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  otpInput: {
    width: 40, // Reduced size
    height: 40, // Reduced size
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16, // Adjusted font size
    backgroundColor: "#f9f9f9",
    marginHorizontal: 5, // Add spacing between boxes
  },
  
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendButton: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "bold",
    marginLeft: 5,
  },
  verifyButton: {
    backgroundColor: "#FFC107",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Otp;
