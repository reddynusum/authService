'use client'
export default function Logout(){
    async function out() {
        const data = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          }).then((res)=>res.json());
          console.log(data);
    }
    return <button onClick={out}>out</button>
}
