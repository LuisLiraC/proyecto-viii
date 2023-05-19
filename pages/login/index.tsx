import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import Head from "next/head";

export default function Login() {
  return (
    <div className="Login">
      <Head>
        <title>Login | Open Dev Projects</title>
      </Head>
      <SignInForm/>
      <SignUpForm/>
    </div>
  );
}
