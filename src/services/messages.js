const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const createMessage = async (data) => {
  const accessKey = import.meta.env.EMAIL_PUBLIC_KEY;
  if (!accessKey) {
    throw new Error("Contact form is not configured. Set EMAIL_PUBLIC_KEY in the environment.");
  }

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: data.name,
      email: data.email,
      message: data.message,
    }),
  });

  const result = await res.json().catch(() => null);
  if (!res.ok || !result?.success) {
    throw new Error(result?.message ?? result?.error ?? "Could not send message. Please try again.");
  }
};