import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
    return (
        <>
            <PageMeta
                title="Sif - Sign Up"
                description="Sif - Sign Up"
            />
            <AuthLayout>
                <SignUpForm />
            </AuthLayout>
        </>
    );
}