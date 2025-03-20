export default function setSingleCookie(key: string,value: string,expiration?: string, path: string = "/")
{
    let date;
    if(expiration){
        date = new Date(expiration);
    }
    document.cookie=`${key}=${value};${date ? `expires=${date.toUTCString()};` : ""}${path ? `path=${path};` : ""}`;
}