import { View, Text } from 'react-native';
import {Link} from "expo-router";

const Signup = () => {
    return (
        <View>
            <Text>Sign Up</Text>
            <Link href="/(auth)/sign-up"> sign in </Link>
        </View>
    );
}

export default Signup;