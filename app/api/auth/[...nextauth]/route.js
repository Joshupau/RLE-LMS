import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export const authOptions = ({
  pages:{
    signIn: "/"
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
        name: "credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith"},
          password: { label: "Password", type: "password" },
          schoolId: { label: "ID Number", type: "number"},
          email: { label: "Email", type: "email"}
        },
        async authorize(credentials){
          try {
            
            if(!credentials.schoolId || !credentials.password){
              return null;
            }
  
            const user = await prisma.user.findUnique({
              where: {
                  schoolId: parseInt(credentials.schoolId)
              }
            });
  
            if(!user) {
              return null;
            }

            const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword);
  
            if(!passwordsMatch){
              return null;
            }
            if(user.role === 'SystemAdmin'){
              return user;
            }

            console.log(user);
            return user;
          } catch (error) {
            console.log("Error: ", error);
            return null;
          }

        }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async onError(error, session, query) {
      console.error('NextAuth.js error:', error);
    },
    async jwt({ token, user, trigger, session }) {

      if(trigger === "update"){

       return{ 
        ...token,          
        id: user.id,
        schoolId: user.schoolId,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        role: user.role,
        age: user.age,
      } 
      }
      if (user) {
        return {
          ...token,
          id: user.id,
          schoolId: user.schoolId,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          role: user.role,
          age: user.age,
        };
      }
      return token;
    },
    async session(session, token) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          middleName: token.middleName,
          role: token.role,
          age: token.age,
        };
      }
      return session;
    }
    
  },
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };