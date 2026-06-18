import { Link } from 'expo-router';
import { Text, View } from 'react-native';

const SignIn = () => {
  return (
    <View>
      <Text>Sign In</Text>
      <Link href="/(auth)/sign-up"> create account </Link>
    </View>
  );
};

export default SignIn;
