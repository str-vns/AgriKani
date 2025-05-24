import React, { useState, useRef, useEffect, useContext  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Error from "@shared/Error";
import { loginUser } from "@redux/Actions/Auth.actions";
import { OTPregister, clearErrors, clearRegister, registeruser, saveDeviceToken } from "@redux/Actions/userActions";
import AsyncStorage from '@react-native-async-storage/async-storage'
import AuthGlobal from "@redux/Store/AuthGlobal";
import messaging from "@react-native-firebase/messaging";

const UserOTP = (props) => {
  const { route } = props;
  const { params: registration } = route; 
  const navigation = useNavigation(); 
  const dispatch = useDispatch();
  const { isAuthenticated, error, loading, user  } = useSelector(state => state.register);
  console.log("hello:", useSelector(state => state.register));
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [errors, setErrors] = useState("");
  const [timer, setTimer] = useState(0); 
  const [isDisabled, setIsDisabled] = useState(false);
  const [fcmToken, setFcmToken] = useState(""); 
  const context = useContext(AuthGlobal)

  useEffect(() => {
    messaging().getToken().then((token) => {
      setFcmToken(token);
    });
  },[])

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
         if(error) {
          setErrors("Wrong OTP entered. Please try again!");
          setTimeout(() => {
            dispatch(clearErrors());
            setErrors("");
          }, 1000);
        }
  }, [error])
  const handleVerify = () => {
    const otpString = otp.join('');
    
    if (otpString.length < 6) {
      setErrors("Please fill the OTP");
    }
    
    const registerInfo = {
      otp: otpString,
      ...registration,  
    };
  
    dispatch(registeruser(registerInfo));

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
    dispatch(OTPregister({ email: registration.registration.email }));
  }

  
  useEffect(() => {
    
    console.log("User State: ", user);
    console.log("Is Authenticated: ", isAuthenticated);
  
    if (isAuthenticated && user?.email && user?.password) {
      const saveDtoken = {
        email: user.email,
        deviceToken: fcmToken,
      };
      dispatch(saveDeviceToken(saveDtoken));
      const userCredentials = { email: user.email, password: registration.registration.password };
      console.log("Attempting auto login with: ", userCredentials);
      loginUser(userCredentials, context.dispatch);
      setOtp(['', '', '', '', '', '']);
      dispatch(clearErrors());
      navigation.navigate("Home");
    }
  }, [isAuthenticated, user, navigation, context.dispatch]);


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
      <Image
        source={require('@assets/img/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>JuanKooP</Text>
      <Text style={styles.subtitle}>OTP Verification</Text>
      <Text style={styles.subsubtitle}>Please enter the 6-digit code sent to your email for verification</Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => inputRefs.current[index] = ref}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            style={styles.otpInput}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 10,
  },
  loginText: {
    color: "#007bff",
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  subsubtitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 24,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#f7b900',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default UserOTP;
