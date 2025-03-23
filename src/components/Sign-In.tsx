import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      className="flex flex-col gap-4 w-96 mx-auto p-4 border rounded shadow-lg"
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label className="flex justify-between items-center">
        Email
        <input name="email" type="email" className="border rounded px-4 py-2"/>
      </label>
      <label className="flex justify-between items-center">
        Password
        <input name="password" type="password" className="border rounded px-4 py-2"/>
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg">Sign In</button>
    </form>
  )
}