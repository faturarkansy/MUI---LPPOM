// import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/grid-image/image-01.png')" }}
    >
      {/* <PageMeta
        title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <SignUpForm />
    </div>
  );
}
