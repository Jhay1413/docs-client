
export const uploadFile = async(signedUrl:string,file:File)=>{
    try {
        const response = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        });
        return response
    } catch (error) {
        console.log(error)
    }
}