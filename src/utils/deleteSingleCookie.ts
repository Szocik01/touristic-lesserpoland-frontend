export default function deleteSingleCookie(key: string, path: string = "/")
{
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;${path ? `path=${path};` : ""}`;
}