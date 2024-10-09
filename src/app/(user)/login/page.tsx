import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <section className="min-h-screen flex items-center justify-center  text-center">
      <div className="bg-white rounded-lg p-8 w-full ">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">تسجيل الدخول</h1> */}
        <LoginForm />
      </div>
    </section>
  )
}

export default LoginPage;
