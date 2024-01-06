import { getSession } from "next-auth/react";

export async function getServerSideProps({ req }) {
    const session = await getSession({ req }); // Get user session
  
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    const user = session.user;
  
    return {
      props: {
        user,
      },
    };
  }
  