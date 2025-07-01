import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";



export const authOptions: AuthOptions = {
    providers: {
        CredentialsProvider({
            name:"Next Auth",
            credentials: {
                email: {
                    lable:"Email",
                    type:"email",
                    placeholder:"Enter your email"
            },
                password: {
                    lable:"Password" , type:"password"
            }

            },
            async authorize(credential, req) {

                const user = { id: "1", name: "J Smith", email: credential?.email,

                 };

      if (user) {
    // Any object returned will be saved in `user` property of the JWT
    return user
} else {
    // If you return null then an error will be displayed advising the user to check their details.
    return null

    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
}

            },

            
        
    })
}


}