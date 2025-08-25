const ENDPOINT = "http://127.0.0.1:8008";

export const makeRequest = async (route: string, body: any) => {
  const response = await fetch(`${ENDPOINT}/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return response.json().then((data) => {
    console.log(data);
    return data;
  });
};

export const translate = async (message: string) => {
  return makeRequest("translate", {message});
};

export const refineTranslation = async (
  message: string,
  conversation_id: string
) => {
  return makeRequest("refine-translation", {message, conversation_id});
};
