export const uploadFile = async (signedUrl: string, file: File) => {
  try {
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong ! ");
  }
};
