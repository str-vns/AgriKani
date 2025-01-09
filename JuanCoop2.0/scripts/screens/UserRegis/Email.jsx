import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { otpForgotPassword, OTPregister, clearErrors } from "@redux/Actions/userActions";
import Error from "@shared/Error";

const Email = (props) => {
  const emailUser = props.route.params.email;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {otps, error, loading } = useSelector(state => state.otpForgot);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(0); 
  const [errors, setErrors] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  
  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
     
       
       if (otpString.length < 6) {
         setErrors("Please fill the OTP");
         
         setTimeout(() => {
          dispatch(clearErrors());
          setErrors(""); 
        }, 5000);
       }
      
       dispatch(otpForgotPassword({ otp: otpString, email: emailUser }));
       if (error === true) {
         setErrors("Wrong OTP entered. Please try again!");
       } else {
        navigation.navigate("NewPassword", { email: emailUser });

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
    dispatch(OTPregister({ email: emailUser }));
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
   }, [isDisabled, timer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/732/732200.png",
        }} // Replace with a local asset if needed
        style={styles.image}
      />
      <Text style={styles.subtitle}>
        Please Enter The 6 Digit Code Sent To {"\n"}
          <Text style={styles.email}>{emailUser}</Text>
      </Text>
      <View style={styles.codeInputContainer}>
        {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => inputRefs.current[index] = ref}
                    value={digit}
                    onChangeText={(value) => handleChange(value, index)}
                    style={styles.codeInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    onKeyPress={(event) => handleKeyPress(index, event)}
                  />
                ))}
      </View>
      {errors ? <Error message={errors} /> : null}
       <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
              {loading ? (<ActivityIndicator size="small" color="#fff" /> )
              : 
              (<Text style={styles.buttonText}>Verify</Text>)}
              
            </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={Resend}
        disabled={isDisabled} 
      >
        <Text style={styles.loginText}>
          {isDisabled
            ? `Resend available in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`
            : "Didn't receive a code? Resend again"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#6C6C6C",
  },
  email: {
    fontWeight: "bold",
    color: "#FFB100",
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E5E5",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    backgroundColor: "#F9F9F9",
  },
  resendCode: {
    fontSize: 14,
    color: "#FFB100",
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  verifyButton: {
    width: "90%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFB100",
    alignItems: "center",
  },
  verifyButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Email;
