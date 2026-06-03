interface LoginUserProps {
  email: string;
  password: string;
}

export async function loginService(userData: LoginUserProps) {
  try {
    const response = await fetch(
      "https://backend.roaafouda.deno.net/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return {
        error:
          data.error ||
          data.message ||
          "الإيميل أو الباسورد خطأ , الرجاء المحاولة مرة أخرى",
      };
    }
    return data;
  } catch (err) {
    return err;
  }
}
