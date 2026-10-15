import pages from '@/data/pages.json';import Page from '@/components/Page';import {notFound} from 'next/navigation';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(pages).map(p=>({slug:p.split('/').filter(Boolean)}))}
export async function generateMetadata({params}:{params:Promise<{slug?:string[]}>}){const p=await params;const route=p.slug?.length?'/'+p.slug.join('/')+'/':'/';const data=pages[route as keyof typeof pages];return {title:data?.title||'Progressive Autosports'}}
export default async function ArchivePage({params}:{params:Promise<{slug?:string[]}>}){const p=await params;const route=p.slug?.length?'/'+p.slug.join('/')+'/':'/';if(!(route in pages))notFound();return <Page route={route as keyof typeof pages}/>}
