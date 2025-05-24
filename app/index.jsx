import {View, Text} from 'react-native'
import React from 'react'
const index =() => {
    const router =useRouter();
    return(
        <ScreenWrapper>
            <Text>index</Text>
            <Button title="Welcome" onPress={()=> router.push('welcome')} />
        </ScreenWrapper>
    )
}

export default index