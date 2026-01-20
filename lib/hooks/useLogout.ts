import { useRouter } from "next/navigation";
import { useToast } from "./useToast";

export function useLogout() {
  const router = useRouter();
  const { addToast } = useToast();

  const logout = () => {
    localStorage.removeItem("user");
    addToast("ออกจากระบบสำเร็จ", "success");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return { logout };
}
