"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Entry = {kind:"page"|"blog";slug:string;title:string;summary:string;body:string;status:"draft"|"published";updated_at?:string};
const pages=["home","about","pricing","solutions","resources"];
const blank=(kind:"page"|"blog",slug:string):Entry=>({kind,slug,title:"",summary:"",body:"",status:"draft"});
export function ContentEditor(){
 const [items,setItems]=useState<Entry[]>([]);
 const [active,setActive]=useState<Entry>(blank("page","home"));
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 const [saving,setSaving]=useState(false);
 useEffect(()=>{fetch("/api/admin/content",{cache:"no-store"}).then(async r=>{if(!r.ok)throw Error((await r.json()).error);return r.json()}).then(d=>setItems(d.entries)).catch(e=>setMessage(e.message)).finally(()=>setLoading(false))},[]);
 function select(kind:"page"|"blog",slug:string){setActive(items.find(i=>i.kind===kind&&i.slug===slug)||blank(kind,slug));setMessage("")}
 async function save(){setSaving(true);setMessage("");try{const r=await fetch("/api/admin/content",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(active)});const data=await r.json();if(!r.ok)throw Error(data.error);setItems(old=>[...old.filter(i=>!(i.kind===active.kind&&i.slug===active.slug)),data.entry]);setActive(data.entry);setMessage("Saved successfully")}catch(e){setMessage(e instanceof Error?e.message:"Save failed")}finally{setSaving(false)}}
 function newBlog(){const slug=prompt("New blog slug (letters, digits and hyphens)")?.trim();if(!slug)return;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){setMessage("Use lowercase letters, numbers and hyphens.");return}select("blog",slug)}
 return <main className="min-h-screen bg-[#f7f8f8] text-[#192b25]">
  <header className="flex items-center justify-between border-b bg-white px-4 py-3"><div className="text-sm font-semibold">ALEPH / Content Manager</div><nav className="flex gap-4 text-xs"><Link href="/admin/leads">Leads</Link><Link href="/">View website</Link></nav></header>
  <div className="mx-auto grid max-w-7xl gap-3 p-3 md:grid-cols-[240px_minmax(0,1fr)]">
   <aside className="rounded border bg-white p-3"><div className="mb-2 text-xs font-semibold uppercase text-gray-500">Pages</div>{pages.map(slug=><button key={slug} onClick={()=>select("page",slug)} className="block w-full rounded px-2 py-2 text-left text-sm hover:bg-gray-100">{slug}</button>)}
   <div className="mt-5 flex items-center justify-between"><span className="text-xs font-semibold uppercase text-gray-500">Blogs</span><button className="rounded border px-2 py-1 text-xs" onClick={newBlog}>+ New</button></div>
   {items.filter(i=>i.kind==="blog").map(i=><button key={i.slug} onClick={()=>select("blog",i.slug)} className="block w-full truncate rounded px-2 py-2 text-left text-sm hover:bg-gray-100">{i.title||i.slug}</button>)}</aside>
   <section className="rounded border bg-white p-4"><div className="flex items-center justify-between border-b pb-3"><h1 className="text-sm font-semibold">Edit {active.kind}: {active.slug}</h1><span className="text-xs text-gray-500">{active.status}</span></div>
   <div className="grid gap-3 py-3">
    <label className="text-xs font-medium">Title<input className="mt-1 block h-9 w-full rounded border px-2 text-sm" value={active.title} maxLength={180} onChange={e=>setActive({...active,title:e.target.value})}/></label>
    <label className="text-xs font-medium">Summary<input className="mt-1 block h-9 w-full rounded border px-2 text-sm" value={active.summary} maxLength={800} onChange={e=>setActive({...active,summary:e.target.value})}/></label>
    <label className="text-xs font-medium">Content (plain text, separate paragraphs with blank lines)<textarea className="mt-1 block min-h-72 w-full rounded border p-2 font-mono text-sm" value={active.body} maxLength={30000} onChange={e=>setActive({...active,body:e.target.value})}/></label>
    <label className="text-xs font-medium">Publication status<select className="mt-1 block h-9 w-full rounded border px-2 text-sm" value={active.status} onChange={e=>setActive({...active,status:e.target.value as Entry["status"]})}><option value="draft">Draft</option><option value="published">Published</option></select></label>
    <p className="text-xs text-gray-500">Only the home page hero text and CMS-authored blog posts are rendered from this editor in this release. Other page records are saved but not yet wired to their public page.</p>
    <div className="flex items-center gap-3"><button className="rounded bg-[#173d30] px-4 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={saving||loading} onClick={save}>{saving?"Saving...":"Save changes"}</button><span role="status" className="text-xs">{message}</span></div>
   </div></section>
  </div>
 </main>;
}
