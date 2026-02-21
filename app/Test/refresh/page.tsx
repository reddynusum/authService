'use client'
export default function Refresh(){
     async function refre(){
        const data = await fetch('/api/auth/refresh',{method:'POST',credentials:'include'}).then((res)=> res.json());
        console.log(data);
    }
    return(<button onClick={refre}>refresh</button>);
}