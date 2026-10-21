import { API_URL } from "@/const/api";

interface RegisterValues {
  username: string;
  email: string;
  password: string;
  foundationName: string;
  siglas: string;
  logo?: File;
}

export async function handleRegister(values: RegisterValues) {
  try {
    // 1️⃣ Registrar Usuario
    const registerRes = await fetch(`${API_URL}/api/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });

    if (!registerRes.ok) {
      throw new Error("Error registrando usuario");
    }

    const registerData = await registerRes.json();
    const token = registerData.jwt;
    const userId = registerData.user.id;

    let imageId = null;

    // 2️⃣ Subir Imagen (si existe)
    if (values.logo) {
      const formData = new FormData();
      formData.append("files", values.logo);

      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Error subiendo imagen");
      }

      const uploadData = await uploadRes.json();
      imageId = uploadData[0].id;
    }

    // 3️⃣ Crear Fundación
    const foundationRes = await fetch(`${API_URL}/api/foundations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          name: values.foundationName,
          siglas: values.siglas,
          image: imageId,
          users_permissions_user: userId,
        },
      }),
    });

    if (!foundationRes.ok) {
      throw new Error("Error creando fundación");
    }

    console.log("Fundación creada correctamente");
    return { success: true };
  } catch (error) {
    console.error("Error en el registro:", error);
    return { success: false };
  }
}
