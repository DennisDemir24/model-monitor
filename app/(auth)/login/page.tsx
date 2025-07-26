import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: 'Login - Model Monitor',
  description: 'Login to your Model Monitor account',
}

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full space-y-8'>

        <LoginForm />
      </div>
    </div>
  )
}